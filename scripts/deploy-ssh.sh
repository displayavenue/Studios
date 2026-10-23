#!/usr/bin/env bash
# Deploy DisplayAvenue Realty to Hostinger over SSH.
# Usage: SSH_PASS='...' ./scripts/deploy-ssh.sh
# Optional: SSH_DOC=domains/displayavenuerealty.com/public_html
#           VITE_BASE=/realestate/  (subdirectory deploy)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
DOC="${SSH_DOC:-domains/displayavenuerealty.com/public_html}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)

echo "Building (VITE_BASE=${VITE_BASE:-/})…"
npm run build

echo "Preparing deploy folder…"
rm -rf /tmp/da-re-deploy
mkdir -p /tmp/da-re-deploy
cp -a dist/. /tmp/da-re-deploy/
cp -a public/admin/. /tmp/da-re-deploy/admin/ 2>/dev/null || true
cp -a public/content/. /tmp/da-re-deploy/content/
cp -f public/llms.txt /tmp/da-re-deploy/llms.txt 2>/dev/null || true
cp -f public/robots.txt /tmp/da-re-deploy/robots.txt 2>/dev/null || true
cp -f public/sitemap.xml /tmp/da-re-deploy/sitemap.xml 2>/dev/null || true
cp -f public/sitemap_index.xml /tmp/da-re-deploy/sitemap_index.xml 2>/dev/null || true
cp -f public/sitemap-basic.xml /tmp/da-re-deploy/sitemap-basic.xml 2>/dev/null || true
cp -f public/sitemap.php /tmp/da-re-deploy/sitemap.php 2>/dev/null || true
mkdir -p /tmp/da-re-deploy/sitemaps
cp -f public/sitemaps/realty.xml /tmp/da-re-deploy/sitemaps/realty.xml 2>/dev/null || true
cp -f public/send-inquiry.php /tmp/da-re-deploy/send-inquiry.php 2>/dev/null || true
cp -f public/.htaccess /tmp/da-re-deploy/.htaccess 2>/dev/null || true
cp -a public/admin/seo-sync.php /tmp/da-re-deploy/admin/seo-sync.php 2>/dev/null || true

echo "Ensuring remote path $DOC …"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p $DOC/content $DOC/admin"

echo "Uploading to $HOST:$DOC …"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r /tmp/da-re-deploy/. "$HOST:$DOC/"

sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "chmod -R u+rwX $DOC; chmod 755 $DOC/content $DOC/admin 2>/dev/null; ls $DOC/index.html $DOC/assets >/dev/null && echo DEPLOY_OK"

echo "Done → $DOC"
