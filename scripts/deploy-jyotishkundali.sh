#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PASS="${SSH_PASS:?Set SSH_PASS}"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
DOC="${SSH_DOC:-domains/jyotishkundali.com/public_html}"
SSH_OPTS=(-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no)

python3 scripts/build-jyotishkundali-static.py

# Clear previous VELORA/static content (preserve unrelated folders if any)
sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "mkdir -p $DOC && find $DOC -mindepth 1 -maxdepth 1 ! -name varnikya ! -name api ! -name images -exec rm -rf {} +"

sshpass -p "$PASS" scp "${SSH_OPTS[@]}" -P "$PORT" -r deploy/jyotishkundali-static/. "$HOST:$DOC/"

sshpass -p "$PASS" ssh "${SSH_OPTS[@]}" -p "$PORT" "$HOST" \
  "grep -q JyotishKundali $DOC/index.html && ! grep -q VELORA $DOC/index.html && echo LIVE_OK_JYOTISH"

echo "https://jyotishkundali.com"
