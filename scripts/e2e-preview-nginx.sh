#!/usr/bin/env bash
# Proves the preview stack locally: builds the image the way preview-deploy.sh does, runs it with
# deploy/preview/nginx.preview.conf mounted and asserts the preview rules (noindex everywhere, no
# /k, robots.txt disallow, both production origins rewritten to the requested host, Brazil on clean paths and Italy under /it). Local Docker only; removes
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
for _ in $(seq 1 50); do curl -sf -o /dev/null "$base/it" && break; sleep 0.2; done

asset="$(curl -s "$base/it" | grep -oE '/assets/[^"]+\.js' | head -1)"
loc() { curl -s -o /dev/null -D - "$base$1" | tr -d '\r' | grep -i '^location:' | cut -d' ' -f2; }

echo "preview-test: assertions"
for url in / /wahub /patricia /it /it/wahub /it/patricia /br /br/wahub "$asset" /og/br-home.jpg /k /k/data/x /k/api/x /robots.txt /nope; do
  header "$url" | grep -qi '^x-robots-tag: noindex, nofollow$'; check "X-Robots-Tag on ${url}" $?
done

# One tunnel host serves both markets: Brazil on the clean paths, Italy under /it, no language redirect.
check "/ answers 200 (Brazilian home, no language redirect)" "$([ "$(status /)" = 200 ]; echo $?)"
check "/ ignores Accept-Language" "$([ "$(curl -s -o /dev/null -w '%{http_code}' -H 'Accept-Language: it-IT' "$base/")" = 200 ]; echo $?)"
# grep -q on a here-string, not a pipe: with pipefail, curl would die of SIGPIPE when grep exits early.
brhome="$(curl -s -H 'Accept-Language: it-IT' "$base/")"
check "/ is the Brazilian home" "$(grep -q '<h1[^>]*>Inteligência e Automação que Escala</h1>' <<<"$brhome"; echo $?)"
check "/wahub and /patricia answer 200" "$([ "$(status /wahub)$(status /patricia)" = 200200 ]; echo $?)"
brwahub="$(curl -s "$base/wahub")"
check "/wahub is the Brazilian WaHub page" "$(grep -q '<h1[^>]*>Seu time inteiro atendendo no mesmo número do WhatsApp</h1>' <<<"$brwahub"; echo $?)"
check "/it and its pages are served locally (200, no cross-domain redirect)" "$([ "$(status /it)$(status /it/wahub)$(status /it/patricia)" = 200200200 ]; echo $?)"
ithome="$(curl -s "$base/it")"
check "/it is the Italian home" "$(grep -q '<h1[^>]*>Intelligenza e Automazione che Scalano</h1>' <<<"$ithome"; echo $?)"
check "/br → 301 /" "$([ "$(status /br)" = 301 ] && [ "$(loc /br)" = / ]; echo $?)"
check "/br/wahub → 301 /wahub (same host, relative Location)" "$([ "$(status /br/wahub)" = 301 ] && [ "$(loc /br/wahub)" = /wahub ]; echo $?)"
check "/br/patricia → 301 /patricia" "$([ "$(loc /br/patricia)" = /patricia ]; echo $?)"
check "/br/x?a=1 keeps the query string" "$([ "$(loc '/br/wahub?a=1')" = '/wahub?a=1' ]; echo $?)"
check "/k answers 404" "$([ "$(status /k)" = 404 ]; echo $?)"
check "/k/data/x answers 404" "$([ "$(status /k/data/x)" = 404 ]; echo $?)"
check "/k/api/x answers 404" "$([ "$(status /k/api/x)" = 404 ]; echo $?)"
check "robots.txt body disallows everything" "$([ "$(curl -s "$base/robots.txt")" = "$(printf 'User-agent: *\nDisallow: /')" ]; echo $?)"

# Both baked origins follow the requested host; other subdomains stay intact.
html="$(curl -s -H "Host: ${tunnel_host}" "$base/wahub")"
check "page has meta robots noindex" "$(grep -q '<meta name="robots" content="noindex, nofollow" />' <<<"$html"; echo $?)"
check "canonical uses the requested host" "$(grep -q "<link rel=\"canonical\" href=\"${site_url}/wahub\" />" <<<"$html"; echo $?)"
check "og:image uses the requested host" "$(grep -q "og:image\" content=\"${site_url}/og/br-wahub.jpg\"" <<<"$html"; echo $?)"
check "language switcher link follows the requested host" "$(grep -q "href=\"${site_url}/it/wahub\"" <<<"$html"; echo $?)"
check "no production origin left in the Brazilian HTML" "$(! grep -qE 'https://amiticia\.(cc|com\.br)' <<<"$html"; echo $?)"
check "subdomain links stay intact (WaHub login)" "$(grep -q 'https://wahub.amiticia.cc' <<<"$html"; echo $?)"
ithtml="$(curl -s -H "Host: ${tunnel_host}" "$base/it/wahub")"
check "Italian page: canonical on the requested host" "$(grep -q "<link rel=\"canonical\" href=\"${site_url}/it/wahub\" />" <<<"$ithtml"; echo $?)"
check "Italian page: switcher to Brazil follows the requested host" "$(grep -q "href=\"${site_url}/wahub\"" <<<"$ithtml"; echo $?)"
check "no production origin left in the Italian HTML" "$(! grep -qE 'https://amiticia\.(cc|com\.br)' <<<"$ithtml"; echo $?)"
check "HTML stays no-cache" "$(header /wahub | grep -qi '^cache-control: no-cache, no-store, must-revalidate$'; echo $?)"
check "/assets is immutable" "$(header "$asset" | grep -qi '^cache-control: public, immutable$'; echo $?)"
check "og image cached for an hour" "$(header /og/br-home.jpg | grep -qi '^cache-control: public, max-age=3600$'; echo $?)"
exit "$fail"
