#!/usr/bin/env bash
# Interactive (or one-shot) SSH into HOMEOPATHY PHARMA on Hostinger.
# Usage:
#   export SSH_PASS='your-hpanel-ssh-password'
#   ./scripts/ssh-hostinger.sh              # open a shell
#   ./scripts/ssh-hostinger.sh 'php -v'     # run one remote command
set -euo pipefail

HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
REMOTE_APP="${SSH_REMOTE_APP:-domains/homeopathypharma.com/laravel}"

if [[ -z "${SSH_PASS:-}" ]]; then
  echo "Set SSH_PASS to your Hostinger SSH password first:" >&2
  echo "  export SSH_PASS='…'   # from hPanel → Advanced → SSH Access" >&2
  exit 1
fi

if ! command -v sshpass >/dev/null 2>&1; then
  echo "sshpass is required (apt install sshpass / brew install sshpass)." >&2
  exit 1
fi

export SSHPASS="$SSH_PASS"
SSH=(sshpass -e ssh -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no -p "$PORT" "$HOST")

if [[ $# -gt 0 ]]; then
  "${SSH[@]}" "cd ~/$REMOTE_APP && $*"
else
  echo "Connecting to $HOST (port $PORT)…"
  echo "App dir: ~/$REMOTE_APP"
  "${SSH[@]}" -t "cd ~/$REMOTE_APP && exec \$SHELL -l"
fi
