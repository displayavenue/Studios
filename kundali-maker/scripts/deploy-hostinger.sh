#!/usr/bin/env bash
# Deploy kundali-maker to Hostinger over SSH for jyotishkundali.com
#
# Default (production domain):
#   SSH_PASS='…' ./scripts/deploy-hostinger.sh
#
# Interim subdirectory (legacy):
#   VITE_BASE=/kundali-maker/ SSH_DOC=domains/displayavenuestudios.com/public_html/kundali-maker ./scripts/deploy-hostinger.sh
#
# Required: SSH_PASS
# Optional: SSH_HOST, SSH_PORT, SSH_DOC, VITE_BASE

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
DOC="${SSH_DOC:-domains/jyotishkundali.com/public_html}"
BASE="${VITE_BASE:-/}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)

# Normalize base (must end with / for Vite, except bare "/")
if [[ "$BASE" != "/" && "$BASE" != */ ]]; then
  BASE="${BASE}/"
fi

echo "Building with base=${BASE} …"
VITE_BASE="$BASE" npx vite build --base "$BASE"

REWRITE_BASE="$BASE"
cat > dist/.htaccess <<EOF
DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase ${REWRITE_BASE}

  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
EOF

echo "Uploading to $HOST:$DOC …"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p $DOC && find $DOC -mindepth 1 -maxdepth 1 -exec rm -rf {} +"

sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r dist/. "$HOST:$DOC/"

sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "chmod 755 $DOC; chmod 644 $DOC/index.html $DOC/.htaccess 2>/dev/null; test -f $DOC/index.html && echo DEPLOY_OK"

echo "Deployed to $DOC"
echo "Live when DNS/SSL connected: https://jyotishkundali.com/"
