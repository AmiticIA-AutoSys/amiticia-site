#!/usr/bin/env bash
# Usage: scripts/preview-deploy.sh
# Syncs the preview checkout on $PREVIEW_HOST with the checked-out branch, builds the site image
# THERE with noindex on every page (the host is arm64; building on it needs no emulation), and
# starts the preview `web` service. The tunnel URL is not baked in: nginx.preview.conf rewrites
# the origin per request, so the web service and the tunnel can be (re)started in any order.
# Touches only /opt/amiticia/amiticia-site-preview and the `amiticia-site-preview` compose project.
set -euo pipefail

cd "$(dirname "$0")/.."

REMOTE_DIR=/opt/amiticia/amiticia-site-preview
PREVIEW_HOST="${PREVIEW_HOST:-oracle}"   # the second app host since 2026-11-20 (arm64)
image=amiticia-site-preview:local

echo "preview-deploy: syncing the preview checkout with the checked-out branch"
bash scripts/preview-sync.sh

echo "preview-deploy: building ${image} (noindex) on ${PREVIEW_HOST} and starting the web service"
ssh "$PREVIEW_HOST" bash -s -- "$REMOTE_DIR" "$image" <<'REMOTE'
set -euo pipefail
cd "$1"
docker build --build-arg SITE_NOINDEX=1 --tag "$2" .
cd deploy/preview
# --force-recreate: the image tag is reused, so make sure the container runs the fresh build.
docker compose up -d --force-recreate web
docker compose ps
REMOTE

echo "preview-deploy: done. scripts/preview-tunnel.sh prints the URL to open on a phone (<url>/br)."
