#!/usr/bin/env bash
# Builds the production Docker image, serves it on 127.0.0.1:${E2E_PORT:-4310}, runs Playwright
# against it and always removes the container. The image tag and container name derive from the
# checkout folder, so parallel worktrees (each with its own E2E_PORT) never collide.
# Extra arguments go to `playwright test` (e.g. `npm run e2e -- --project=mobile e2e/root.spec.ts`).
set -euo pipefail

cd "$(dirname "$0")/.."
slug="$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9_.\n-' '-')"
image="amiticia-site-e2e:${slug}"
container="amiticia-site-e2e-${slug}"
port="${E2E_PORT:-4310}"
base_url="http://127.0.0.1:${port}"

cleanup() { docker rm -f "$container" >/dev/null 2>&1 || true; }
trap cleanup EXIT INT TERM

echo "e2e: building ${image}"
docker build --quiet --tag "$image" . >/dev/null

cleanup
docker run --detach --rm --name "$container" --publish "127.0.0.1:${port}:3000" "$image" >/dev/null

echo "e2e: waiting for ${base_url}"
for _ in $(seq 1 50); do
  if curl --silent --fail --output /dev/null "${base_url}/br"; then break; fi
  sleep 0.2
done
curl --silent --fail --output /dev/null "${base_url}/br" || { echo "e2e: container did not answer"; docker logs "$container" || true; exit 1; }

E2E_BASE_URL="$base_url" npx playwright test "$@"
