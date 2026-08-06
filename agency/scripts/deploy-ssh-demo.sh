#!/usr/bin/env bash
# Deploy agency demo to Hostinger over SSH at displayavenue.com/demo/
# Does NOT replace the WordPress root — demo only.
# Usage: SSH_PASS='...' ./scripts/deploy-ssh-demo.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
DOC="${SSH_DOC:-domains/displayavenue.com/public_html/demo}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)

echo "Building agency demo with base /demo/ …"
DEPLOY_BASE=/demo/ npm run build

echo "Uploading to $HOST:$DOC …"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p $DOC && find $DOC -mindepth 1 -maxdepth 1 -exec rm -rf {} +"

sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r dist/. "$HOST:$DOC/"

sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "chmod 755 $DOC; chmod 644 $DOC/index.html $DOC/.htaccess 2>/dev/null || true; ls -la $DOC | head -20; echo DEMO_DEPLOY_OK"

echo "Live demo: https://displayavenue.com/demo/"
