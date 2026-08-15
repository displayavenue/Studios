#!/usr/bin/env bash
# Deploy kundali-maker to Hostinger over SSH for jyotishkundali.com
#
# Required: SSH_PASS
# Optional: SSH_HOST, SSH_PORT, SSH_DOC, VITE_BASE
# Optional Razorpay: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
DOC="${SSH_DOC:-domains/jyotishkundali.com/public_html}"
BASE="${VITE_BASE:-/}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)

if [[ "$BASE" != "/" && "$BASE" != */ ]]; then
  BASE="${BASE}/"
fi

echo "Building with base=${BASE} …"
VITE_BASE="$BASE" npx vite build --base "$BASE"

REWRITE_BASE="$BASE"
cat > dist/.htaccess <<EOF
DirectoryIndex index.html index.php

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase ${REWRITE_BASE}

  # Never rewrite API PHP
  RewriteRule ^api/ - [L]

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

# Write Razorpay config into dist (not committed)
KEY_ID="${RAZORPAY_KEY_ID:-}"
KEY_SECRET="${RAZORPAY_KEY_SECRET:-}"
ALLOW_DEMO="false"
if [[ -z "$KEY_ID" || -z "$KEY_SECRET" ]]; then
  ALLOW_DEMO="true"
  echo "WARN: RAZORPAY_KEY_ID/SECRET not set — demo pay allowed until keys are added."
else
  echo "Razorpay keys detected — writing api/config.php (allow_demo=false)"
fi

mkdir -p dist/api
# Escape for PHP single-quoted strings
php_escape() {
  printf "%s" "$1" | sed "s/'/\\\\'/g"
}
KEY_ID_ESC="$(php_escape "$KEY_ID")"
KEY_SECRET_ESC="$(php_escape "$KEY_SECRET")"
cat > dist/api/config.php <<EOF
<?php
return [
  'key_id' => '${KEY_ID_ESC}',
  'key_secret' => '${KEY_SECRET_ESC}',
  'currency' => 'INR',
  'allow_demo' => ${ALLOW_DEMO},
];
EOF

echo "Uploading to $HOST:$DOC …"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p $DOC && find $DOC -mindepth 1 -maxdepth 1 -exec rm -rf {} +"

sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r dist/. "$HOST:$DOC/"

sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "chmod 755 $DOC $DOC/api; chmod 644 $DOC/index.html $DOC/.htaccess $DOC/api/*.php 2>/dev/null; chmod 600 $DOC/api/config.php 2>/dev/null; test -f $DOC/index.html && test -f $DOC/api/razorpay-status.php && echo DEPLOY_OK"

echo "Deployed to $DOC"
echo "Site: https://jyotishkundali.com/"
echo "Razorpay status: https://jyotishkundali.com/api/razorpay-status.php"
