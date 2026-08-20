#!/usr/bin/env bash
# Deploy static storefront to Hostinger public_html for homeopathypharma.com
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
DOC="${SSH_DOC:-domains/homeopathypharma.com/public_html}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no -o ConnectTimeout=30 -o ServerAliveInterval=15)
export WEB_URL="${WEB_URL:-https://homeopathypharma.com}"
export NEXT_PUBLIC_WEB_URL="${NEXT_PUBLIC_WEB_URL:-$WEB_URL}"

echo "==> Refreshing catalog snapshot for CMS/API"
pnpm --filter @homeopathypharma/worker exec tsx "$ROOT/scripts/refresh-catalog-snapshot.ts" || true

echo "==> Building shared packages + static storefront"
pnpm --filter @homeopathypharma/content-store build
pnpm --filter @homeopathypharma/ui build
pnpm --filter @homeopathypharma/seo build
pnpm --filter @homeopathypharma/web build

OUT="$ROOT/apps/web/out"
test -f "$OUT/index.html" || { echo "Missing $OUT/index.html"; exit 1; }

STAMP="$(date +%Y%m%d-%H%M%S)"
TAR="/tmp/hp-web-${STAMP}.tar.gz"
echo "==> Packing static export → $TAR"
tar -C "$OUT" -czf "$TAR" .

echo "==> Backing up remote $DOC"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p backups && tar -czf backups/homeopathypharma-predeploy-${STAMP}.tar.gz -C domains/homeopathypharma.com public_html"

echo "==> Uploading archive + scp extract"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "find $DOC -mindepth 1 -maxdepth 1 -exec rm -rf {} + && mkdir -p $DOC"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" "$TAR" "$HOST:backups/hp-web-latest.tar.gz"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "tar -xzf backups/hp-web-latest.tar.gz -C $DOC && find $DOC -type d -exec chmod 755 {} +; find $DOC -type f -exec chmod 644 {} +; test -f $DOC/index.html && echo DEPLOY_OK"

rm -f "$TAR"
echo "==> Done. Visit https://homeopathypharma.com"
