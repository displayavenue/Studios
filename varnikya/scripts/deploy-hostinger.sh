#!/usr/bin/env bash
# Deploy Varnikya to https://jyotishkundali.com/varnikya/
# Does NOT replace or clear the kundali root at domains/jyotishkundali.com/public_html
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
# Path under the kundali domain — never the domain root itself
DOC="${SSH_DOC:-domains/jyotishkundali.com/public_html/varnikya}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)

echo "Building Varnikya…"
npm run build

cat > dist/.htaccess <<'EOF'
DirectoryIndex index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /varnikya/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
</IfModule>
EOF

echo "Uploading to $HOST:$DOC …"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p $DOC && find $DOC -mindepth 1 -maxdepth 1 -exec rm -rf {} +"

sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r dist/. "$HOST:$DOC/"

sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "chmod 755 $DOC; test -f $DOC/index.html && test -f domains/jyotishkundali.com/public_html/index.html && echo DEPLOY_OK"

echo "Deployed: https://jyotishkundali.com/varnikya/"
echo "Kundali root left intact at https://jyotishkundali.com/"
