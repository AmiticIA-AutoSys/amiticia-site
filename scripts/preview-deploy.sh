#!/usr/bin/env bash
# Usage: scripts/preview-deploy.sh https://<random>.trycloudflare.com
# Builds the site image locally with the tunnel URL baked into canonical/og URLs and noindex on every
# page, ships it to the VPS (docker save | ssh docker load), syncs the VPS checkout with the local
# v2-br and starts the preview `web` service.
# Touches only /opt/amiticia/amiticia-site-preview and the `amiticia-site-preview` compose project.
set -euo pipefail

if [ $# -ne 1 ] || ! [[ "$1" =~ ^https://[a-z0-9-]+\.trycloudflare\.com/?$ ]]; then
  echo "usage: $0 https://<random>.trycloudflare.com   (run scripts/preview-tunnel.sh first)" >&2
  exit 2
fi
tunnel_url="${1%/}"
cd "$(dirname "$0")/.."

REMOTE_DIR=/opt/amiticia/amiticia-site-preview
image=amiticia-site-preview:local

echo "preview-deploy: syncing the VPS checkout with the local v2-br"
bash scripts/preview-sync.sh

echo "preview-deploy: building ${image} for ${tunnel_url} (noindex)"
docker build --build-arg "SITE_URL=${tunnel_url}" --build-arg SITE_NOINDEX=1 --tag "$image" .

echo "preview-deploy: shipping ${image} to the VPS"
docker save "$image" | gzip | ssh hostinger 'gunzip | docker load'

echo "preview-deploy: starting the web service"
ssh hostinger bash -s -- "$REMOTE_DIR" <<'REMOTE'
set -euo pipefail
cd "$1/deploy/preview"
# --force-recreate: the image tag is reused, so make sure the container runs the freshly loaded one.
docker compose up -d --force-recreate web
docker compose ps
REMOTE

echo "preview-deploy: done. Open ${tunnel_url}/br on a phone."
