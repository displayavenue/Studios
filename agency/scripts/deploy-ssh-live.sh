#!/usr/bin/env bash
# Deploy agency site to LIVE displayavenue.com root (public_html).
# Preserves /demo and /os. Backs up previous root first.
# Usage: SSH_PASS='...' ./scripts/deploy-ssh-live.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
DOC="${SSH_DOC:-domains/displayavenue.com/public_html}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)

echo "Building agency LIVE bundle with base / …"
# Empty demoBasePath for root SEO URLs
python3 - <<'PY'
import json
from pathlib import Path
p = Path("public/content/settings.json")
d = json.loads(p.read_text())
d["demoBasePath"] = ""
d["siteUrl"] = "https://displayavenue.com"
p.write_text(json.dumps(d, indent=2) + "\n")
print("settings.demoBasePath cleared for root")
PY

DEPLOY_BASE=/ npm run build

echo "Preparing live deploy folder…"
rm -rf /tmp/da-agency-live
mkdir -p /tmp/da-agency-live
cp -a dist/. /tmp/da-agency-live/
rm -rf /tmp/da-agency-live/admin /tmp/da-agency-live/content
cp -a public/admin /tmp/da-agency-live/admin
cp -a public/content /tmp/da-agency-live/content

STAMP="$(date -u +%Y%m%d-%H%M%S)"
BACKUP="backups/displayavenue-root-${STAMP}"

echo "Backing up current root → ~/${BACKUP} (keeps demo/ + os/)…"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p ${BACKUP} && \
   cd ${DOC} && \
   for item in * .[!.]*; do \
     [ \"\$item\" = 'demo' ] && continue; \
     [ \"\$item\" = 'os' ] && continue; \
     [ \"\$item\" = '.' ] && continue; \
     [ \"\$item\" = '..' ] && continue; \
     [ -e \"\$item\" ] || continue; \
     cp -a \"\$item\" \$HOME/${BACKUP}/; \
   done; \
   ls -la \$HOME/${BACKUP} | head -20; \
   echo BACKUP_OK"

echo "Uploading live site to ${DOC} …"
# Clear root except demo/ and os/
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "cd ${DOC} && \
   for item in * .[!.]*; do \
     [ \"\$item\" = 'demo' ] && continue; \
     [ \"\$item\" = 'os' ] && continue; \
     [ \"\$item\" = '.' ] && continue; \
     [ \"\$item\" = '..' ] && continue; \
     [ -e \"\$item\" ] || continue; \
     rm -rf \"\$item\"; \
   done; \
   mkdir -p ${DOC}"

sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r /tmp/da-agency-live/. "$HOST:$DOC/"

sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "chmod 755 ${DOC} ${DOC}/content ${DOC}/admin ${DOC}/assets 2>/dev/null || true; \
   chmod 644 ${DOC}/index.html ${DOC}/.htaccess ${DOC}/robots.txt ${DOC}/sitemap.xml ${DOC}/llms.txt 2>/dev/null || true; \
   chmod 664 ${DOC}/content/*.json; \
   php -r \"require '${DOC}/admin/seo-sync.php'; \\\$r=da_sync_seo_artifacts('${DOC}/content', '${DOC}'); echo 'SEO_URLS='.\\\$r['urlCount'].PHP_EOL;\" 2>/dev/null || echo 'SEO sync skipped'; \
   ls -la ${DOC} | head -30; \
   echo LIVE_DEPLOY_OK"

echo "Live site: https://displayavenue.com/"
echo "CMS admin:  https://displayavenue.com/admin/"
echo "Backup:     ~/${BACKUP}"
