#!/usr/bin/env bash
# Usage: scripts/preview-deploy.sh https://<random>.trycloudflare.com
# Builds the site image locally with the tunnel URL baked into canonical/og URLs and noindex on every
# page, ships it to the VPS (docker save | ssh docker load) and starts the preview `web` service.
# Touches only /opt/amiticia/amiticia-site-preview and the `amiticia-site-preview` compose project.
set -euo pipefail

if [ $# -ne 1 ] || ! [[ "$1" =~ ^https://[a-z0-9-]+\.trycloudflare\.com/?$ ]]; then
  echo "usage: $0 https://<random>.trycloudflare.com   (run scripts/preview-tunnel.sh first)" >&2
  exit 2
fi
tunnel_url="${1%/}"
cd "$(dirname "$0")/.."

REMOTE_DIR=/opt/amiticia/amiticia-site-preview
PROD_DIR=/opt/amiticia/amiticia-site
image=amiticia-site-preview:local

echo "preview-deploy: building ${image} for ${tunnel_url} (noindex)"
docker build --build-arg "SITE_URL=${tunnel_url}" --build-arg SITE_NOINDEX=1 --tag "$image" .

echo "preview-deploy: shipping ${image} to the VPS"
docker save "$image" | gzip | ssh hostinger 'gunzip | docker load'

echo "preview-deploy: updating ${REMOTE_DIR} and starting the web service"
ssh hostinger bash -s -- "$REMOTE_DIR" "$PROD_DIR" <<'REMOTE'
set -euo pipefail
dir="$1"; prod="$2"
if [ ! -d "$dir/.git" ]; then
  git clone "$(git -C "$prod" remote get-url origin)" "$dir"
fi
cd "$dir"
git fetch origin
git checkout v2-br
git reset --hard origin/v2-br
cd deploy/preview
# --force-recreate: the image tag is reused, so make sure the container runs the freshly loaded one.
docker compose up -d --force-recreate web
docker compose ps
REMOTE

echo "preview-deploy: done. Open ${tunnel_url}/br on a phone."
