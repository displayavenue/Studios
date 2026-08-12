#!/usr/bin/env bash
# Deploy production build to Hostinger over SSH.
# Usage: SSH_PASS='...' ./scripts/deploy-ssh.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
DOC="${SSH_DOC:-domains/displayavenuestudios.com/public_html}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)

echo "Building…"
npm run build

echo "Preparing deploy folder…"
rm -rf /tmp/da-deploy
mkdir -p /tmp/da-deploy
cp -a dist/. /tmp/da-deploy/
# Prefer latest public/admin + content over stale dist copies
cp -a public/admin/. /tmp/da-deploy/admin/
cp -a public/content/. /tmp/da-deploy/content/
cp -f public/llms.txt /tmp/da-deploy/llms.txt 2>/dev/null || true
cp -f public/robots.txt /tmp/da-deploy/robots.txt 2>/dev/null || true
cp -f public/send-inquiry.php /tmp/da-deploy/send-inquiry.php 2>/dev/null || true

echo "Uploading to $HOST:$DOC …"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p $DOC && find $DOC -mindepth 1 -maxdepth 1 ! -name content -exec rm -rf {} +; mkdir -p $DOC"
# Keep remote CMS content if present; sync everything else then merge content
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r /tmp/da-deploy/. "$HOST:$DOC/"

sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "chmod 755 $DOC/content $DOC/content/uploads $DOC/admin; chmod 644 $DOC/content/*.json $DOC/index.html $DOC/.htaccess; test -f $DOC/assets/*.js && echo DEPLOY_OK"

echo "Done."
