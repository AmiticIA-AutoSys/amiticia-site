#!/usr/bin/env bash
# Ships the local v2-br commit to the VPS preview checkout (/opt/amiticia/amiticia-site-preview)
# as a git bundle over ssh, so the preview needs no push to GitHub. The checkout stays a real
# clone of this repo (origin points at GitHub) at exactly the commit being previewed.
# Called by scripts/preview-tunnel.sh and scripts/preview-deploy.sh; touches nothing else.
set -euo pipefail

REMOTE_DIR=/opt/amiticia/amiticia-site-preview
REMOTE_BUNDLE=/tmp/amiticia-site-preview.bundle
branch=v2-br
cd "$(dirname "$0")/.."

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$branch" ]; then
  echo "preview-sync: check out ${branch} first (the preview shows that branch)" >&2
  exit 2
fi
if ! git diff --quiet HEAD --; then
  echo "preview-sync: commit your changes first (the VPS checkout gets the commit, not the working tree)" >&2
  exit 2
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
echo "preview-sync: bundling ${branch} at $(git rev-parse --short HEAD)"
git bundle create "$tmp/preview.bundle" "$branch" 2>/dev/null
ssh hostinger "cat > ${REMOTE_BUNDLE}" < "$tmp/preview.bundle"

echo "preview-sync: updating ${REMOTE_DIR}"
ssh hostinger bash -s -- "$REMOTE_DIR" "$REMOTE_BUNDLE" "$branch" "$(git remote get-url origin)" <<'REMOTE'
set -euo pipefail
dir="$1"; bundle="$2"; branch="$3"; origin_url="$4"
if [ ! -d "$dir/.git" ]; then
  git clone --quiet --branch "$branch" "$bundle" "$dir"
  git -C "$dir" remote set-url origin "$origin_url"
else
  git -C "$dir" fetch --quiet "$bundle" "$branch"
  git -C "$dir" checkout --quiet -B "$branch" FETCH_HEAD
  git -C "$dir" reset --quiet --hard FETCH_HEAD
fi
rm -f "$bundle"
echo "preview-sync: ${dir} is at $(git -C "$dir" log --oneline -1)"
REMOTE
