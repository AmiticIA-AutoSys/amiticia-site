#!/usr/bin/env bash
# Usage: scripts/preview-deploy.sh
# Builds the site image locally with noindex on every page, ships it to the VPS (docker save | ssh
# docker load), syncs the VPS checkout with the local v2-br and starts the preview `web` service.
# The tunnel URL is not baked in: nginx.preview.conf rewrites the origin per request, so the web
# service and the tunnel can be (re)started in any order.
# Touches only /opt/amiticia/amiticia-site-preview and the `amiticia-site-preview` compose project.
set -euo pipefail

cd "$(dirname "$0")/.."

REMOTE_DIR=/opt/amiticia/amiticia-site-preview
image=amiticia-site-preview:local

echo "preview-deploy: syncing the VPS checkout with the local v2-br"
bash scripts/preview-sync.sh

echo "preview-deploy: building ${image} (noindex)"
docker build --build-arg SITE_NOINDEX=1 --tag "$image" .

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

echo "preview-deploy: done. scripts/preview-tunnel.sh prints the URL to open on a phone (<url>/br)."
