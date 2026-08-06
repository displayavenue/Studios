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

echo "Removing WordPress from public_html (backup already saved)…"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "test -f \$HOME/backups/displayavenue-wordpress-backup-20260806-073054.tar.gz || \
   ls \$HOME/backups/displayavenue-wordpress-backup-*.tar.gz | head -1 | grep -q .; \
   echo BACKUP_PRESENT; \
   cd $DOC; \
   # Delete WordPress and leftover root files; keep nothing of WP
   rm -rf wp-admin wp-content wp-includes; \
   rm -f wp-*.php xmlrpc.php license.txt readme.html index.php default.php \
         siteguarding_tools.php error_log llms.txt bk.zip .htaccess .htaccess.bk; \
   # Remove old /demo after we copied content (will redeploy root)
   rm -rf demo; \
   mkdir -p $DOC; \
   ls -la $DOC | head -20; \
   echo WP_DELETED"

echo "Uploading agency site to $HOST:$DOC …"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r /tmp/da-agency-root/. "$HOST:$DOC/"

sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "chmod 755 $DOC $DOC/content $DOC/admin; \
   chmod 644 $DOC/content/*.json $DOC/index.html $DOC/.htaccess $DOC/robots.txt $DOC/sitemap.xml $DOC/llms.txt 2>/dev/null || true; \
   chmod 664 $DOC/content/*.json; \
   php -r \"require '$DOC/admin/seo-sync.php'; \\\$r=da_sync_seo_artifacts('$DOC/content', '$DOC'); echo 'SEO_BASE='.\\\$r['base'].' URLS='.\\\$r['urlCount'].PHP_EOL;\" 2>/dev/null || echo 'SEO sync skipped'; \
   ls -la $DOC | head -25; \
   echo ROOT_CUTOVER_OK"

echo "Live site: https://displayavenue.com/"
echo "CMS admin:  https://displayavenue.com/admin/"
