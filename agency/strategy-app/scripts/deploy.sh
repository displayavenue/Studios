#!/usr/bin/env bash
# Deploy DisplayAvenue Strategy to Hostinger:
#  1) strategy.displayavenue.com
#  2) displayavenue.com/strategy/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)

SUB_DOC="domains/strategy.displayavenue.com/public_html"
PATH_DOC="domains/displayavenue.com/public_html/strategy"

echo "Preparing remote folders…"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p ${SUB_DOC} ${PATH_DOC}"

echo "Uploading subdomain…"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "rm -rf ${SUB_DOC}/assets; mkdir -p ${SUB_DOC}"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" \
  "$ROOT/index.html" "$ROOT/.htaccess" "$HOST:$SUB_DOC/"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r \
  "$ROOT/assets" "$HOST:$SUB_DOC/"

echo "Mirroring to /strategy/ …"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "rm -rf ${PATH_DOC}; mkdir -p ${PATH_DOC}"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" \
  "$ROOT/index.html" "$HOST:$PATH_DOC/"
sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r \
  "$ROOT/assets" "$HOST:$PATH_DOC/"

sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "cat > ${PATH_DOC}/.htaccess <<'HT'
DirectoryIndex index.html
Options -Indexes
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /strategy/
  RewriteRule ^assets/ - [L]
  RewriteRule ^index\\.html\$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /strategy/index.html [L]
</IfModule>
HT
chmod 755 ${SUB_DOC} ${PATH_DOC} ${SUB_DOC}/assets ${PATH_DOC}/assets
chmod 644 ${SUB_DOC}/index.html ${PATH_DOC}/index.html ${SUB_DOC}/assets/* ${PATH_DOC}/assets/*
ls -la ${SUB_DOC}
ls -la ${PATH_DOC}
echo STRATEGY_DEPLOY_OK"

echo "Path URL:      https://displayavenue.com/strategy/"
echo "Subdomain URL: https://strategy.displayavenue.com/  (needs hPanel DNS)"
