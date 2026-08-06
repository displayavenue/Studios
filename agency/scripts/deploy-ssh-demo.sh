#!/usr/bin/env bash
# Deploy agency demo + CMS to Hostinger at displayavenue.com/demo/
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

echo "Preparing deploy folder (SPA + admin CMS + content)…"
rm -rf /tmp/da-agency-deploy
mkdir -p /tmp/da-agency-deploy
cp -a dist/. /tmp/da-agency-deploy/
# Ensure CMS + editable JSON ship with the site
rm -rf /tmp/da-agency-deploy/admin /tmp/da-agency-deploy/content
cp -a public/admin /tmp/da-agency-deploy/admin
# Preserve remote content if present; seed from local if first deploy
cp -a public/content /tmp/da-agency-deploy/content

echo "Uploading to $HOST:$DOC …"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p $DOC"

# Keep existing remote content/ edits if folder exists
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "if [ -d $DOC/content ]; then cp -a $DOC/content /tmp/da-content-backup-\$\$; fi; \
   find $DOC -mindepth 1 -maxdepth 1 ! -name content -exec rm -rf {} +; \
   mkdir -p $DOC"

sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r /tmp/da-agency-deploy/. "$HOST:$DOC/"

# Restore remote content if backup existed (prefer live CMS edits over local seed)
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "if ls -d /tmp/da-content-backup-* >/dev/null 2>&1; then \
     rm -rf $DOC/content; \
     mv /tmp/da-content-backup-* $DOC/content; \
   fi; \
   chmod 755 $DOC $DOC/content $DOC/admin; \
   chmod 644 $DOC/content/*.json $DOC/index.html $DOC/.htaccess 2>/dev/null || true; \
   chmod 664 $DOC/content/*.json; \
   ls -la $DOC | head -20; \
   echo DEMO_CMS_DEPLOY_OK"

echo "Live demo: https://displayavenue.com/demo/"
echo "CMS admin:  https://displayavenue.com/demo/admin/"
