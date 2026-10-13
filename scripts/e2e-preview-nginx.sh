#!/usr/bin/env bash
# Proves the preview stack locally: builds the image the way preview-deploy.sh does, runs it with
# deploy/preview/nginx.preview.conf mounted and asserts the preview rules (noindex everywhere, no
# /k, robots.txt disallow, canonical/og rewritten to the requested host). Local Docker only; removes
# its container.
# Usage: PREVIEW_TEST_PORT=4325 bash scripts/e2e-preview-nginx.sh
set -euo pipefail
cd "$(dirname "$0")/.."

slug="$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9_.\n-' '-')"
image="amiticia-site-preview-test:${slug}"
container="amiticia-site-preview-test-${slug}"
port="${PREVIEW_TEST_PORT:-4325}"
base="http://127.0.0.1:${port}"
tunnel_host="preview-test.trycloudflare.com"
site_url="https://${tunnel_host}"

cleanup() { docker rm -f "$container" >/dev/null 2>&1 || true; }
trap cleanup EXIT INT TERM

fail=0
check() { # check <description> <condition-result: 0|1>
  if [ "$2" -eq 0 ]; then echo "  ok   $1"; else echo "  FAIL $1"; fail=1; fi
}
header() { curl -s -o /dev/null -D - "$base$1" | tr -d '\r'; }
status() { curl -s -o /dev/null -w '%{http_code}' "$base$1"; }

echo "preview-test: building ${image}"
docker build --quiet --build-arg SITE_NOINDEX=1 --tag "$image" . >/dev/null
cleanup
docker run --detach --rm --name "$container" --publish "127.0.0.1:${port}:3000" \
  --volume "$PWD/deploy/preview/nginx.preview.conf:/etc/nginx/conf.d/default.conf:ro" "$image" >/dev/null
for _ in $(seq 1 50); do curl -sf -o /dev/null "$base/br" && break; sleep 0.2; done

asset="$(curl -s "$base/br" | grep -oE '/assets/[^"]+\.js' | head -1)"

echo "preview-test: assertions"
for url in /br /br/wahub /br/patricia / "$asset" /og/br-home.jpg /k /k/data/x /k/api/x /robots.txt /nope; do
  header "$url" | grep -qi '^x-robots-tag: noindex, nofollow$'; check "X-Robots-Tag on ${url}" $?
done
check "/br answers 200" "$([ "$(status /br)" = 200 ]; echo $?)"
check "/k answers 404" "$([ "$(status /k)" = 404 ]; echo $?)"
check "/k/data/x answers 404" "$([ "$(status /k/data/x)" = 404 ]; echo $?)"
check "/k/api/x answers 404" "$([ "$(status /k/api/x)" = 404 ]; echo $?)"
check "robots.txt body disallows everything" "$([ "$(curl -s "$base/robots.txt")" = "$(printf 'User-agent: *\nDisallow: /')" ]; echo $?)"
html="$(curl -s -H "Host: ${tunnel_host}" "$base/br/wahub")"
check "page has meta robots noindex" "$(grep -q '<meta name="robots" content="noindex, nofollow" />' <<<"$html"; echo $?)"
check "canonical uses the requested host" "$(grep -q "<link rel=\"canonical\" href=\"${site_url}/br/wahub\" />" <<<"$html"; echo $?)"
check "og:image uses the requested host" "$(grep -q "og:image\" content=\"${site_url}/og/br-wahub.jpg\"" <<<"$html"; echo $?)"
check "no production origin left in the HTML" "$(! grep -q 'https://amiticia.cc' <<<"$html"; echo $?)"
check "subdomain links stay intact (WaHub login)" "$(grep -q 'https://wahub.amiticia.cc' <<<"$html"; echo $?)"
check "HTML stays no-cache" "$(header /br | grep -qi '^cache-control: no-cache, no-store, must-revalidate$'; echo $?)"
check "/assets is immutable" "$(header "$asset" | grep -qi '^cache-control: public, immutable$'; echo $?)"
check "og image cached for an hour" "$(header /og/br-home.jpg | grep -qi '^cache-control: public, max-age=3600$'; echo $?)"
exit "$fail"
