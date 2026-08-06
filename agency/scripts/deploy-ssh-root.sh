#!/usr/bin/env bash
# Cut over DisplayAvenue agency site to domain ROOT (displayavenue.com/)
# Prerequisites: WordPress backup already created at ~/backups/
# Usage: SSH_PASS='...' ./scripts/deploy-ssh-root.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
DOC="${SSH_DOC:-domains/displayavenue.com/public_html}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)

echo "Building agency site for domain ROOT (base /) …"
# Ensure CMS settings say root
node -e "
const fs=require('fs');
const p='public/content/settings.json';
const d=JSON.parse(fs.readFileSync(p,'utf8'));
d.demoBasePath='';
d.notes='Agency CMS - live at domain root.';
d.updatedAt=new Date().toISOString();
fs.writeFileSync(p, JSON.stringify(d,null,2)+'\n');
"
DEPLOY_BASE=/ npm run build

echo "Preparing deploy folder…"
rm -rf /tmp/da-agency-root
mkdir -p /tmp/da-agency-root
cp -a dist/. /tmp/da-agency-root/
rm -rf /tmp/da-agency-root/admin /tmp/da-agency-root/content
cp -a public/admin /tmp/da-agency-root/admin
cp -a public/content /tmp/da-agency-root/content

# Prefer live CMS content from /demo if present
echo "Pulling latest CMS content from /demo if available…"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "if [ -d $DOC/demo/content ]; then tar -C $DOC/demo/content -czf /tmp/da-demo-content.tgz .; fi" || true
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" \
  "$HOST:/tmp/da-demo-content.tgz" /tmp/da-demo-content.tgz 2>/dev/null || true
if [ -f /tmp/da-demo-content.tgz ]; then
  mkdir -p /tmp/da-demo-content
  tar -xzf /tmp/da-demo-content.tgz -C /tmp/da-demo-content
  cp -a /tmp/da-demo-content/. /tmp/da-agency-root/content/
  # Force root base path after merge
  node -e "
  const fs=require('fs');
  const p='/tmp/da-agency-root/content/settings.json';
  const d=JSON.parse(fs.readFileSync(p,'utf8'));
  d.demoBasePath='';
  d.updatedAt=new Date().toISOString();
  fs.writeFileSync(p, JSON.stringify(d,null,2)+'\n');
  "
fi

echo "Removing WordPress leftovers from public_html (backup already saved)…"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "test -f \$HOME/backups/displayavenue-wordpress-backup-20260806-073054.tar.gz || \
   ls \$HOME/backups/displayavenue-wordpress-backup-*.tar.gz | head -1 | grep -q .; \
   echo BACKUP_PRESENT; \
   cd \$HOME/$DOC; \
   # Delete WordPress leftovers if any remain
   rm -rf wp-admin wp-content wp-includes domains demo; \
   rm -f wp-*.php xmlrpc.php license.txt readme.html index.php default.php \
         siteguarding_tools.php error_log bk.zip .htaccess.bk 2>/dev/null || true; \
   # Clear previous SPA assets except content (preserve CMS edits)
   if [ -d content ]; then cp -a content /tmp/da-root-content-backup-\$\$; fi; \
   find . -mindepth 1 -maxdepth 1 ! -name content -exec rm -rf {} +; \
   mkdir -p .; \
   ls -la . | head -20; \
   echo ROOT_CLEARED"

echo "Uploading agency site to $HOST:$DOC …"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r /tmp/da-agency-root/. "$HOST:$DOC/"

# Restore remote CMS content if present, then force-refresh key homepage files from this build
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "if ls -d /tmp/da-root-content-backup-* >/dev/null 2>&1; then \
     rm -rf \$HOME/$DOC/content; \
     mv /tmp/da-root-content-backup-* \$HOME/$DOC/content; \
   fi"

sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" \
  /tmp/da-agency-root/content/home.json \
  /tmp/da-agency-root/content/company.json \
  /tmp/da-agency-root/content/settings.json \
  /tmp/da-agency-root/content/services.json \
  "$HOST:$DOC/content/"

sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "chmod 755 \$HOME/$DOC \$HOME/$DOC/content \$HOME/$DOC/admin; \
   chmod 644 \$HOME/$DOC/content/*.json \$HOME/$DOC/index.html \$HOME/$DOC/.htaccess \$HOME/$DOC/robots.txt \$HOME/$DOC/sitemap.xml \$HOME/$DOC/llms.txt 2>/dev/null || true; \
   chmod 664 \$HOME/$DOC/content/*.json; \
   php -r \"require '\$HOME/$DOC/admin/seo-sync.php'; \\\$r=da_sync_seo_artifacts('\$HOME/$DOC/content', '\$HOME/$DOC'); echo 'SEO_BASE='.\\\$r['base'].' URLS='.\\\$r['urlCount'].PHP_EOL;\" 2>/dev/null || echo 'SEO sync skipped'; \
   ls -la \$HOME/$DOC | head -25; \
   echo ROOT_CUTOVER_OK"

echo "Live site: https://displayavenue.com/"
echo "CMS admin:  https://displayavenue.com/admin/"
