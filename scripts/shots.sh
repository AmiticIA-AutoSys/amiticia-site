#!/usr/bin/env bash
# Builds the production Docker image, serves it on 127.0.0.1:${E2E_PORT:-4395}, saves phone and desktop
# screenshots of the market pages to shots/ (gitignored) and always removes the container. The image tag
# and container name derive from the checkout folder, like scripts/e2e-preview.sh.
# Arguments narrow the set: `npm run shots -- --market br --page home --device phone`
# (market br|it, page home|wahub, device phone|desktop; comma-separated; --dry-run lists the files).
set -euo pipefail

cd "$(dirname "$0")/.."
slug="$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9_.\n-' '-')"
image="amiticia-site-shots:${slug}"
container="amiticia-site-shots-${slug}"
port="${E2E_PORT:-4395}"
base_url="http://127.0.0.1:${port}"

# A mistyped argument fails here, before the image build.
node scripts/shots/capture.mjs --dry-run "$@" >/dev/null || exit $?

cleanup() { docker rm -f "$container" >/dev/null 2>&1 || true; }
trap cleanup EXIT INT TERM

echo "shots: building ${image}"
docker build --quiet --tag "$image" . >/dev/null

cleanup
docker run --detach --rm --name "$container" --publish "127.0.0.1:${port}:3000" "$image" >/dev/null

echo "shots: waiting for ${base_url}"
for _ in $(seq 1 50); do
  if curl --silent --fail --output /dev/null "${base_url}/it"; then break; fi
  sleep 0.2
done
curl --silent --fail --output /dev/null "${base_url}/it" || { echo "shots: container did not answer"; docker logs "$container" || true; exit 1; }

E2E_PORT="$port" node scripts/shots/capture.mjs "$@"
