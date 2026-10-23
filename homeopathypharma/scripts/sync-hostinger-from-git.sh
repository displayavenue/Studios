#!/usr/bin/env bash
# Pull sparse git mirror on Hostinger, then rsync into live laravel/ (keeps .env).
#
# Usage:
#   export SSH_PASS='…'
#   ./scripts/sync-hostinger-from-git.sh              # dry-run (default)
#   ./scripts/sync-hostinger-from-git.sh --apply       # write files + clear view cache
#   ./scripts/sync-hostinger-from-git.sh --apply cursor/some-branch-846f
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=/dev/null
source "$ROOT/scripts/_hostinger-ssh.sh"

APPLY=0
BRANCH=""
for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    -*)
      echo "Unknown flag: $arg" >&2
      echo "Usage: $0 [--apply] [branch]" >&2
      exit 1
      ;;
    *) BRANCH="$arg" ;;
  esac
done

MIRROR="${SSH_GIT_MIRROR:-domains/homeopathypharma.com/Studios}"
LARAVEL="${SSH_REMOTE_APP:-domains/homeopathypharma.com/laravel}"
PUBLIC_HTML="${SSH_REMOTE_PUBLIC:-domains/homeopathypharma.com/public_html}"
BRANCH="${BRANCH:-cursor/homeopathy-pharma-master-rebuild-846f}"

if [[ "$APPLY" -eq 0 ]]; then
  echo "==> DRY-RUN (pass --apply to write). Branch: $BRANCH"
else
  echo "==> APPLY mode. Branch: $BRANCH"
fi

# Remote script: expand BRANCH/APPLY/paths from local; keep remote \$ escapes.
hp_ssh bash -s <<REMOTE
set -euo pipefail
MIRROR=~/$MIRROR
LARAVEL=~/$LARAVEL
PUBLIC=~/$PUBLIC_HTML
BRANCH='$BRANCH'
APPLY='$APPLY'

if [[ ! -d "\$MIRROR/.git" ]]; then
  echo "No git mirror at \$MIRROR — run ./scripts/init-hostinger-git.sh first." >&2
  exit 1
fi
if [[ ! -d "\$LARAVEL" ]]; then
  echo "Live app missing: \$LARAVEL" >&2
  exit 1
fi

cd "\$MIRROR"
git fetch --depth 1 origin "\$BRANCH"
git checkout -B "\$BRANCH" "FETCH_HEAD"
git sparse-checkout set homeopathypharma
SRC="\$MIRROR/homeopathypharma"
echo "HEAD=\$(git rev-parse --short HEAD) branch=\$(git branch --show-current)"

RSYNC_EXCLUDES=(
  --exclude='.env'
  --exclude='.env.*'
  --exclude='vendor/'
  --exclude='node_modules/'
  --exclude='database/*.sqlite'
  --exclude='storage/logs/'
  --exclude='storage/framework/cache/'
  --exclude='storage/framework/sessions/'
  --exclude='storage/framework/views/'
  --exclude='storage/app/public/'
  --exclude='bootstrap/cache/*.php'
  --exclude='tests/'
  --exclude='.phpunit.result.cache'
  --exclude='.git/'
)

if [[ "\$APPLY" -eq 0 ]]; then
  rsync -a --delete "\${RSYNC_EXCLUDES[@]}" --dry-run --itemize-changes "\$SRC/" "\$LARAVEL/" | head -80
  echo "(dry-run truncated; re-run with --apply to sync)"
  exit 0
fi

rsync -a --delete "\${RSYNC_EXCLUDES[@]}" "\$SRC/" "\$LARAVEL/"

if [[ -d "\$LARAVEL/public" && -d "\$PUBLIC" ]]; then
  rsync -a --exclude='.htaccess' "\$LARAVEL/public/" "\$PUBLIC/" || true
fi

cd "\$LARAVEL"
php artisan view:clear
php artisan view:cache
php artisan route:clear 2>/dev/null || true
php artisan config:clear 2>/dev/null || true
echo "Synced + caches cleared."
REMOTE
