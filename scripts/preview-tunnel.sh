#!/usr/bin/env bash
# Starts ONLY the Cloudflare quick tunnel of the preview stack on the VPS and prints its public
# https://*.trycloudflare.com URL (polls the tunnel logs for up to 60 s). Run it first, then pass the
# URL to scripts/preview-deploy.sh. Touches only /opt/amiticia/amiticia-site-preview and the
# `amiticia-site-preview` compose project. See deploy/preview/docker-compose.yaml for the whole picture.
set -euo pipefail

REMOTE_DIR=/opt/amiticia/amiticia-site-preview
PROD_DIR=/opt/amiticia/amiticia-site

echo "preview-tunnel: ensuring the checkout ${REMOTE_DIR} exists and is on v2-br"
echo "preview-tunnel: starting the tunnel service (compose project amiticia-site-preview)"
echo "preview-tunnel: waiting up to 60 s for the tunnel URL"

ssh hostinger bash -s -- "$REMOTE_DIR" "$PROD_DIR" <<'REMOTE'
set -euo pipefail
dir="$1"; prod="$2"
if [ ! -d "$dir/.git" ]; then
  # Same origin as the production checkout (read only), cloned into the preview folder.
  git clone "$(git -C "$prod" remote get-url origin)" "$dir"
fi
cd "$dir"
git fetch origin
git checkout v2-br
git reset --hard origin/v2-br
cd deploy/preview
# --no-deps: the web service does not exist yet (its image is shipped by preview-deploy.sh).
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
