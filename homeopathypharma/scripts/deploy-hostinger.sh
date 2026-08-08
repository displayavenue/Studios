#!/usr/bin/env bash
# Deploy static storefront to Hostinger public_html for homeopathypharma.com
# Deletes remote WordPress/public_html contents (after backup) and uploads out/
#
# Required: SSH_PASS
# Optional: SSH_HOST (default u452926742@195.35.44.93), SSH_PORT (65002)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
DOC="${SSH_DOC:-domains/homeopathypharma.com/public_html}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)
export WEB_URL="${WEB_URL:-https://homeopathypharma.com}"
export NEXT_PUBLIC_WEB_URL="${NEXT_PUBLIC_WEB_URL:-$WEB_URL}"

echo "==> Building shared packages + static storefront"
pnpm --filter @homeopathypharma/ui build
pnpm --filter @homeopathypharma/seo build
pnpm --filter @homeopathypharma/web build

OUT="$ROOT/apps/web/out"
test -f "$OUT/index.html" || { echo "Missing $OUT/index.html"; exit 1; }

STAMP="$(date +%Y%m%d-%H%M%S)"
echo "==> Backing up remote $DOC → backups/homeopathypharma-predeploy-${STAMP}.tar.gz"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p backups && tar -czf backups/homeopathypharma-predeploy-${STAMP}.tar.gz -C domains/homeopathypharma.com public_html"

echo "==> Wiping remote public_html (WordPress and prior files)"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "find $DOC -mindepth 1 -maxdepth 1 -exec rm -rf {} + && mkdir -p $DOC"

echo "==> Uploading static export"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r "$OUT"/. "$HOST:$DOC/"

echo "==> Setting permissions"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "find $DOC -type d -exec chmod 755 {} +; find $DOC -type f -exec chmod 644 {} +; test -f $DOC/index.html && echo DEPLOY_OK"

echo "==> Done. Visit https://homeopathypharma.com"
