#!/usr/bin/env bash
# Starts ONLY the Cloudflare quick tunnel of the preview stack on the VPS and prints its public
# https://*.trycloudflare.com URL (polls the tunnel logs for up to 60 s). If the tunnel already runs,
# it just prints the current URL. Independent of scripts/preview-deploy.sh. Touches only /opt/amiticia/amiticia-site-preview and the
# `amiticia-site-preview` compose project. See deploy/preview/docker-compose.yaml for the whole picture.
set -euo pipefail

REMOTE_DIR=/opt/amiticia/amiticia-site-preview
cd "$(dirname "$0")/.."

echo "preview-tunnel: syncing the VPS checkout with the local v2-br"
bash scripts/preview-sync.sh

echo "preview-tunnel: starting the tunnel service (compose project amiticia-site-preview)"
echo "preview-tunnel: waiting up to 60 s for the tunnel URL"
ssh hostinger bash -s -- "$REMOTE_DIR" <<'REMOTE'
set -euo pipefail
cd "$1/deploy/preview"
# --no-deps: the web service may not exist yet (its image is shipped by preview-deploy.sh).
docker compose up -d --no-deps tunnel
url=""
for _ in $(seq 1 60); do
  url="$(docker compose logs --no-color tunnel 2>&1 | grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' | grep -v '^https://api\.' | tail -1 || true)"
  [ -n "$url" ] && break
  sleep 1
done
if [ -z "$url" ]; then
  echo "preview-tunnel: no tunnel URL after 60 s; last logs:" >&2
  docker compose logs --no-color --tail 20 tunnel >&2 || true
  exit 1
fi
echo "$url"
REMOTE
