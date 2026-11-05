#!/usr/bin/env bash
# Deploy DisplayAvenue Data to Hostinger:
#  1) data.displayavenue.com document root (subdomain)
#  2) displayavenue.com/data/ (instant path while DNS propagates)
#
# Usage: SSH_PASS='...' ./scripts/deploy.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)

SUB_DOC="domains/data.displayavenue.com/public_html"
PATH_DOC="domains/displayavenue.com/public_html/data"

echo "Preparing remote folders…"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p ${SUB_DOC} ${PATH_DOC}"

echo "Uploading to subdomain root ${SUB_DOC} …"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r \
  "$ROOT/index.html" "$ROOT/.htaccess" "$ROOT/assets" "$ROOT/api" \
  "$HOST:$SUB_DOC/"

# scp -r of multiple items can nest oddly; sync with rsync-like clear + copy
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "rm -rf ${SUB_DOC}/assets ${SUB_DOC}/api; mkdir -p ${SUB_DOC}"

sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" \
  "$ROOT/index.html" "$ROOT/.htaccess" "$HOST:$SUB_DOC/"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r \
  "$ROOT/assets" "$ROOT/api" "$HOST:$SUB_DOC/"

echo "Mirroring to main-site path ${PATH_DOC} …"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "rm -rf ${PATH_DOC}; mkdir -p ${PATH_DOC}"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" \
  "$ROOT/index.html" "$ROOT/.htaccess" "$HOST:$PATH_DOC/"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r \
  "$ROOT/assets" "$ROOT/api" "$HOST:$PATH_DOC/"

# Path deploy needs relative rewrite base for /data/
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "cat > ${PATH_DOC}/.htaccess <<'HT'
DirectoryIndex index.html
Options -Indexes
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /data/
  RewriteRule ^api/ - [L]
  RewriteRule ^assets/ - [L]
  RewriteRule ^index\\.html\$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /data/index.html [L]
</IfModule>
HT
chmod 755 ${SUB_DOC} ${PATH_DOC} ${SUB_DOC}/api ${PATH_DOC}/api ${SUB_DOC}/assets ${PATH_DOC}/assets
chmod 644 ${SUB_DOC}/index.html ${PATH_DOC}/index.html ${SUB_DOC}/.htaccess ${PATH_DOC}/.htaccess
chmod 644 ${SUB_DOC}/api/*.php ${PATH_DOC}/api/*.php
chmod 644 ${SUB_DOC}/assets/* ${PATH_DOC}/assets/*
ls -la ${SUB_DOC}
ls -la ${PATH_DOC}
php -l ${SUB_DOC}/api/extract.php
echo DATA_DEPLOY_OK"

echo "Path URL:      https://displayavenue.com/data/"
echo "Subdomain URL: https://data.displayavenue.com/  (requires hPanel DNS A record)"
