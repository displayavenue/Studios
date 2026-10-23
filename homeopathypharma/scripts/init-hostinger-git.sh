#!/usr/bin/env bash
# One-time: sparse-clone Studios on Hostinger so Claude can git pull + sync.
# Does NOT touch live laravel/.env — only creates a sibling git mirror.
#
# Usage:
#   export SSH_PASS='…'
#   ./scripts/init-hostinger-git.sh
#   ./scripts/init-hostinger-git.sh cursor/homeopathy-pharma-master-rebuild-846f
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=/dev/null
source "$ROOT/scripts/_hostinger-ssh.sh"

BRANCH="${1:-cursor/homeopathy-pharma-master-rebuild-846f}"
REMOTE_BASE="${SSH_REMOTE_BASE:-domains/homeopathypharma.com}"
MIRROR="${SSH_GIT_MIRROR:-domains/homeopathypharma.com/Studios}"
REPO_URL="${SSH_GIT_URL:-https://github.com/displayavenue/Studios.git}"

echo "==> Ensuring Hostinger SSH config for optional deploy key (private-repo fallback)"
hp_ssh bash -s <<'REMOTE'
set -euo pipefail
mkdir -p ~/.ssh
chmod 700 ~/.ssh
if [[ -f ~/.ssh/hp_github_deploy ]]; then
  chmod 600 ~/.ssh/hp_github_deploy
  if [[ ! -f ~/.ssh/config ]] || ! grep -q 'Host github.com' ~/.ssh/config 2>/dev/null; then
    cat >> ~/.ssh/config <<'CFG'

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/hp_github_deploy
  IdentitiesOnly yes
CFG
    chmod 600 ~/.ssh/config
  fi
fi
REMOTE

echo "==> Sparse-cloning $REPO_URL (branch $BRANCH) → ~/$MIRROR"
hp_ssh bash -s <<REMOTE
set -euo pipefail
BASE=~/$REMOTE_BASE
MIRROR=~/$MIRROR
BRANCH='$BRANCH'
REPO_URL='$REPO_URL'
mkdir -p "\$BASE"
if [[ -d "\$MIRROR/.git" ]]; then
  echo "Mirror already exists at \$MIRROR — fetching…"
  cd "\$MIRROR"
  git remote set-url origin "\$REPO_URL" 2>/dev/null || true
  git fetch --depth 1 origin "\$BRANCH"
  git checkout -B "\$BRANCH" "FETCH_HEAD"
  git sparse-checkout set homeopathypharma
else
  rm -rf "\$MIRROR"
  git clone --filter=blob:none --sparse --branch "\$BRANCH" --single-branch "\$REPO_URL" "\$MIRROR"
  cd "\$MIRROR"
  git sparse-checkout set homeopathypharma
fi
echo "---"
git -C "\$MIRROR" rev-parse --short HEAD
git -C "\$MIRROR" branch --show-current
ls "\$MIRROR/homeopathypharma" | head -20
REMOTE

echo "==> Done. Next: ./scripts/sync-hostinger-from-git.sh (dry-run by default)"
