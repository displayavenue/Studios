#!/usr/bin/env bash
# Deploy agency/dist/ to Hostinger via FTP (lftp) for displayavenue.com
# Required env: HOSTINGER_FTP_HOST, HOSTINGER_FTP_USERNAME, HOSTINGER_FTP_PASSWORD
# Optional: HOSTINGER_FTP_REMOTE_PATH (default: public_html)
# Use a SEPARATE Hostinger site / FTP account from displayavenuestudios.com

set -euo pipefail

HOST="${HOSTINGER_FTP_HOST:?Missing HOSTINGER_FTP_HOST}"
USER="${HOSTINGER_FTP_USERNAME:?Missing HOSTINGER_FTP_USERNAME}"
PASS="${HOSTINGER_FTP_PASSWORD:?Missing HOSTINGER_FTP_PASSWORD}"
REMOTE="${HOSTINGER_FTP_REMOTE_PATH:-public_html}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Building DisplayAvenue agency production bundle..."
npm run build

if ! command -v lftp >/dev/null 2>&1; then
  echo "Installing lftp..."
  sudo apt-get update -qq && sudo apt-get install -y -qq lftp
fi

echo "Uploading dist/ → ${HOST}/${REMOTE} ..."
lftp -u "$USER","$PASS" "$HOST" <<EOF
set ftp:ssl-allow no
set ssl:verify-certificate no
mirror -R --delete --verbose --exclude-glob .git* dist/ $REMOTE/
bye
EOF

echo "Deployed. Visit https://displayavenue.com"
