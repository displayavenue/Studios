#!/usr/bin/env bash
# Safe live deploy to displayavenue.com public_html.
# - Backs up current root first
# - Overwrites SPA build + admin helpers + content JSON
# - Does NOT delete protected live-only trees or wipe the docroot
# - Preserves admin/.meta-capi.secret.php, admin/.crm.secret.php, admin/config.php, admin/social-local.php
#   (social-local.php holds cron_key for daily blog autopilot — never wipe it)
#
# Usage: SSH_PASS='...' ./scripts/deploy-ssh-safe-live.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
DOC="${SSH_DOC:-domains/displayavenue.com/public_html}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)
RSYNC_SSH="sshpass -e ssh ${SSH_OPTS[*]} -p ${PORT}"

export SSHPASS="$PASS"

if ! command -v sshpass >/dev/null 2>&1; then
  echo "Installing sshpass…"
  sudo apt-get update -qq && sudo apt-get install -y -qq sshpass
fi
if ! command -v rsync >/dev/null 2>&1; then
  echo "Installing rsync…"
  sudo apt-get update -qq && sudo apt-get install -y -qq rsync
fi

echo "Building agency LIVE bundle with base / …"
SETTINGS_BAK="$(mktemp)"
cp public/content/settings.json "$SETTINGS_BAK"
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

cleanup_settings() {
  cp "$SETTINGS_BAK" public/content/settings.json
  rm -f "$SETTINGS_BAK"
}
trap cleanup_settings EXIT

DEPLOY_BASE=/ npm run build

echo "Preparing staging…"
STAGE=/tmp/da-agency-safe
rm -rf "$STAGE"
mkdir -p "$STAGE"
cp -a dist/. "$STAGE/"
rm -rf "$STAGE/admin" "$STAGE/content"
cp -a public/admin "$STAGE/admin"
cp -a public/content "$STAGE/content"
rm -f "$STAGE/admin/.meta-capi.secret.php" "$STAGE/admin/.crm.secret.php" "$STAGE/admin/social-local.php"

STAMP="$(date -u +%Y%m%d-%H%M%S)"
BACKUP="backups/displayavenue-root-${STAMP}"

echo "Backing up current root → ~/${BACKUP} …"
sshpass -e ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p ${BACKUP} && \
   rsync -a --delete ${DOC}/ \$HOME/${BACKUP}/ && \
   echo BACKUP_OK && du -sh \$HOME/${BACKUP}"

echo "Safe rsync (no docroot wipe; preserve protected trees + secrets)…"
# Clean only hashed SPA assets so old bundles do not linger
sshpass -e rsync -az --delete \
  -e "ssh ${SSH_OPTS[*]} -p ${PORT}" \
  "$STAGE/assets/" "$HOST:${DOC}/assets/"

# Sync everything else without --delete; never touch protected paths / secrets
sshpass -e rsync -az \
  -e "ssh ${SSH_OPTS[*]} -p ${PORT}" \
  --exclude 'assets/' \
  --exclude 'strategy/' \
  --exclude 'data/' \
  --exclude 'catalogue/' \
  --exclude 'invoice/' \
  --exclude 'q/' \
  --exclude 'realestate/' \
  --exclude 'domains/' \
  --exclude 'uploads/' \
  --exclude 'admin/.meta-capi.secret.php' \
  --exclude 'admin/.crm.secret.php' \
  --exclude 'admin/config.php' \
  --exclude 'admin/social-local.php' \
  --exclude 'admin/.leads/' \
  "$STAGE/" "$HOST:${DOC}/"

echo "Post-deploy permissions + checks…"
sshpass -e ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "chmod 755 ${DOC} ${DOC}/content ${DOC}/admin ${DOC}/assets 2>/dev/null || true; \
   chmod 644 ${DOC}/index.html ${DOC}/.htaccess ${DOC}/robots.txt ${DOC}/sitemap.xml ${DOC}/llms.txt 2>/dev/null || true; \
   chmod 664 ${DOC}/content/*.json 2>/dev/null || true; \
   chmod 600 ${DOC}/admin/social-local.php 2>/dev/null || true; \
   test -f ${DOC}/admin/.meta-capi.secret.php && echo SECRET_OK || echo SECRET_MISSING; \
   test -f ${DOC}/admin/config.php && echo CONFIG_OK || echo CONFIG_MISSING; \
   test -f ${DOC}/admin/social-local.php && echo SOCIAL_LOCAL_OK || echo SOCIAL_LOCAL_MISSING; \
   for d in strategy data catalogue images uploads invoice q realestate; do \
     test -d ${DOC}/\$d && echo PRESERVED_\$d || echo MISSING_\$d; \
   done; \
   php -r \"require '${DOC}/admin/seo-sync.php'; \\\$r=da_sync_seo_artifacts('${DOC}/content', '${DOC}'); echo 'SEO_URLS='.\\\$r['urlCount'].PHP_EOL;\" 2>/dev/null || echo 'SEO sync skipped'; \
   ls -la ${DOC} | head -35; \
   echo SAFE_LIVE_DEPLOY_OK"

echo "Live site: https://displayavenue.com/"
echo "CMS admin:  https://displayavenue.com/admin/"
echo "Backup:     ~/${BACKUP}"
