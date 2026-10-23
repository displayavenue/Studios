#!/usr/bin/env bash
# Shared Hostinger SSH helpers. Source from other scripts — do not run directly.
# Requires: SSH_PASS (from hPanel → Advanced → SSH Access). Never commit SSH_PASS.

HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"

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
HP_SSH=(sshpass -e ssh -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no -p "$PORT" "$HOST")
HP_RSYNC_RSH="sshpass -e ssh -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no -p $PORT"

hp_ssh() {
  "${HP_SSH[@]}" "$@"
}
