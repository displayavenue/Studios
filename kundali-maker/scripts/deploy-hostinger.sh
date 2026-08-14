#!/usr/bin/env bash
# Deploy kundali-maker to Hostinger over SSH.
#
# Interim (subdirectory on existing site):
#   ./scripts/deploy-hostinger.sh
#
# Own domain later (set these):
#   VITE_BASE=/ SSH_DOC=domains/YOURDOMAIN.com/public_html ./scripts/deploy-hostinger.sh
#
# Required: SSH_PASS
# Optional: SSH_HOST, SSH_PORT, SSH_DOC, VITE_BASE

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
# Default: stage under studios until a dedicated domain is connected
DOC="${SSH_DOC:-domains/displayavenuestudios.com/public_html/kundali-maker}"
BASE="${VITE_BASE:-/kundali-maker/}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)

# Normalize base (must end with / for Vite, except bare "/")
if [[ "$BASE" != "/" && "$BASE" != */ ]]; then
  BASE="${BASE}/"
fi

echo "Building with base=${BASE} …"
VITE_BASE="$BASE" npx vite build --base "$BASE"

# Ensure SPA rewrite base matches deploy path
REWRITE_BASE="$BASE"
if [[ "$REWRITE_BASE" != "/" && "$REWRITE_BASE" == */ ]]; then
  REWRITE_BASE="${REWRITE_BASE%/}"
  REWRITE_BASE="${REWRITE_BASE}/"
fi
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

if [[ "$DOC" == *displayavenuestudios.com*kundali-maker* ]]; then
  echo "Live (interim): https://displayavenuestudios.com/kundali-maker/"
else
  echo "Deployed to $DOC"
  echo "When DNS points at Hostinger, open https://YOUR-DOMAIN/"
fi
