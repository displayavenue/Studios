#!/usr/bin/env bash
# Deploy kundali-maker to Hostinger over SSH for jyotishkundali.com
#
# Required: SSH_PASS
# Optional: SSH_HOST, SSH_PORT, SSH_DOC, VITE_BASE
# Optional Razorpay: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
#   If unset, existing server api/config.php keys are preserved when present.

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
VITE_BASE="$BASE" npm run build

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

# Prefer env keys; else pull existing live config so we do not wipe Razorpay
KEY_ID="${RAZORPAY_KEY_ID:-}"
KEY_SECRET="${RAZORPAY_KEY_SECRET:-}"
if [[ -z "$KEY_ID" || -z "$KEY_SECRET" ]]; then
  echo "No RAZORPAY_* env — trying to preserve server api/config.php …"
  EXISTING="$(sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
    "test -f $DOC/api/config.php && cat $DOC/api/config.php || true" || true)"
  if [[ -n "$EXISTING" ]]; then
    KEY_ID="$(printf '%s' "$EXISTING" | sed -n "s/.*'key_id' => '\\([^']*\\)'.*/\\1/p" | head -1)"
    KEY_SECRET="$(printf '%s' "$EXISTING" | sed -n "s/.*'key_secret' => '\\([^']*\\)'.*/\\1/p" | head -1)"
  fi
fi

ALLOW_DEMO="true"
if [[ -n "$KEY_ID" && -n "$KEY_SECRET" ]]; then
  ALLOW_DEMO="false"
  echo "Razorpay keys available — writing api/config.php (allow_demo=false; checkout still unused in free preview)"
else
  echo "WARN: No Razorpay keys — allow_demo=true (payment UI still paused in app)"
fi

mkdir -p dist/api
# Keep existing PHP API endpoints from public/api if present
if [[ -d public/api ]]; then
  cp -a public/api/. dist/api/
fi

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

echo "Uploading to $HOST:$DOC (preserving varnikya/ if present)…"
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p $DOC && find $DOC -mindepth 1 -maxdepth 1 ! -name varnikya -exec rm -rf {} +"

sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r dist/. "$HOST:$DOC/"

sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "chmod 755 $DOC $DOC/api; chmod 644 $DOC/index.html $DOC/.htaccess $DOC/api/*.php 2>/dev/null; chmod 600 $DOC/api/config.php 2>/dev/null; test -f $DOC/index.html && echo DEPLOY_OK"

echo "Deployed to $DOC"
echo "Site: https://jyotishkundali.com/"
