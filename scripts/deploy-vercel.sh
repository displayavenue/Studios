#!/usr/bin/env bash
# Deploy JyotishKundali Next.js app to Vercel (BOM region via vercel.json).
#
# Modes:
#   bash scripts/deploy-vercel.sh              # production (requires VERCEL_TOKEN)
#   bash scripts/deploy-vercel.sh preview      # preview (requires VERCEL_TOKEN)
#   bash scripts/deploy-vercel.sh temporary    # claimable anonymous deploy (no token)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TARGET="${1:-production}"
BACKUP_DIR="$(mktemp -d /tmp/jk-vercel-env.XXXXXX)"

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required" >&2
  exit 1
fi

AUTH_SECRET_VALUE="${AUTH_SECRET:-$(openssl rand -hex 32)}"
SAFE_DATABASE_URL="${DATABASE_URL:-postgresql://jyotish:jyotish@127.0.0.1:5432/jyotishkundali?schema=public}"

ENV_FILE_CONTENT="$(cat <<EOF
USE_MOCK_PROVIDERS=true
JYOTISH_MODE=production
AUTH_SECRET=${AUTH_SECRET_VALUE}
NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-https://jyotishkundali.com}
NEXT_PUBLIC_SITE_DOMAIN=${NEXT_PUBLIC_SITE_DOMAIN:-jyotishkundali.com}
NEXT_PUBLIC_BRAND_NAME=JyotishKundali
NEXT_PUBLIC_TAGLINE=Know Yourself. Understand Your Path.
DATABASE_URL=${SAFE_DATABASE_URL}
EOF
)"

restore_env() {
  if [[ -f "$BACKUP_DIR/.env" ]]; then
    mv -f "$BACKUP_DIR/.env" .env
  fi
  if [[ -f "$BACKUP_DIR/.gitignore" ]]; then
    mv -f "$BACKUP_DIR/.gitignore" .gitignore
  fi
  rm -f .env.production .env.local-backup
  rm -rf "$BACKUP_DIR"
}

trap restore_env EXIT

# Anonymous/local NFT builds require .env in the upload; .gitignore normally excludes it.
# Keep backups OUTSIDE the repo so they are never uploaded/traced.
if [[ -f .env ]]; then
  cp .env "$BACKUP_DIR/.env"
fi
cp .gitignore "$BACKUP_DIR/.gitignore"
printf '%s\n' "$ENV_FILE_CONTENT" > .env
printf '%s\n' "$ENV_FILE_CONTENT" > .env.production
# Allow .env to be uploaded for this deploy only (restored on exit).
sed -i '/^\.env$/d; /^\.env\.local$/d' .gitignore
rm -f .env.local-backup

ENV_ARGS=(
  -e "USE_MOCK_PROVIDERS=true"
  -e "JYOTISH_MODE=production"
  -e "AUTH_SECRET=${AUTH_SECRET_VALUE}"
  -e "NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-https://jyotishkundali.com}"
  -e "NEXT_PUBLIC_SITE_DOMAIN=${NEXT_PUBLIC_SITE_DOMAIN:-jyotishkundali.com}"
  -e "NEXT_PUBLIC_BRAND_NAME=JyotishKundali"
  -e "NEXT_PUBLIC_TAGLINE=Know Yourself. Understand Your Path."
  -e "DATABASE_URL=${SAFE_DATABASE_URL}"
  -b "USE_MOCK_PROVIDERS=true"
  -b "AUTH_SECRET=${AUTH_SECRET_VALUE}"
  -b "DATABASE_URL=${SAFE_DATABASE_URL}"
)

if [[ "$TARGET" == "temporary" ]]; then
  echo "Creating claimable temporary Vercel deployment (no login)…"
  npx vercel deploy --temporary --yes --force "${ENV_ARGS[@]}" | tee /tmp/jk-vercel-deploy.out
  URL="$(rg -o 'https://[a-zA-Z0-9.-]+\.vercel\.app' /tmp/jk-vercel-deploy.out | tail -n 1 || true)"
  CLAIM_URL="$(rg -o 'https://vercel.com/claim-deployment\?code=[a-zA-Z0-9-]+' /tmp/jk-vercel-deploy.out | tail -n 1 || true)"
  if [[ -n "$CLAIM_URL" ]]; then
    echo "CLAIM_URL=$CLAIM_URL"
  fi
  echo "DEPLOY_OK"
  echo "$URL"
elif [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "VERCEL_TOKEN is not set." >&2
  echo "Create a token at https://vercel.com/account/tokens, or run:" >&2
  echo "  bash scripts/deploy-vercel.sh temporary" >&2
  exit 1
else
  ARGS=(--token "$VERCEL_TOKEN" --yes)
  if [[ -n "${VERCEL_ORG_ID:-}" ]]; then
    ARGS+=(--scope "$VERCEL_ORG_ID")
  fi
  echo "Pulling / ensuring project link…"
  npx vercel "${ARGS[@]}" link --yes ${VERCEL_PROJECT_ID:+--project "$VERCEL_PROJECT_ID"} || true

  echo "Deploying ($TARGET)…"
  if [[ "$TARGET" == "preview" ]]; then
    npx vercel "${ARGS[@]}" deploy --force "${ENV_ARGS[@]}" | tee /tmp/jk-vercel-deploy.out
  else
    npx vercel "${ARGS[@]}" deploy --prod --force "${ENV_ARGS[@]}" | tee /tmp/jk-vercel-deploy.out
  fi
  URL="$(rg -o 'https://[a-zA-Z0-9.-]+\.vercel\.app' /tmp/jk-vercel-deploy.out | tail -n 1 || true)"
  # Also capture claim URL when present (temporary deploys)
  CLAIM_URL="$(rg -o 'https://vercel.com/claim-deployment\?code=[a-zA-Z0-9-]+' /tmp/jk-vercel-deploy.out | tail -n 1 || true)"
  if [[ -n "$CLAIM_URL" ]]; then
    echo "CLAIM_URL=$CLAIM_URL"
  fi
  echo "DEPLOY_OK"
  echo "$URL"
fi

if command -v curl >/dev/null 2>&1 && [[ -n "${URL:-}" ]]; then
  sleep 5
  CODE="$(curl -sL -o /tmp/jk-vercel-smoke.html -w '%{http_code}' "$URL" || true)"
  echo "SMOKE_HTTP=$CODE"
  if rg -q "JyotishKundali|Know Yourself" /tmp/jk-vercel-smoke.html 2>/dev/null; then
    echo "SMOKE_OK_JYOTISH"
  else
    echo "SMOKE_WARN: brand string not found (app may still be warming or needs env)" >&2
  fi
  curl -sL "${URL%/}/api/health" | tee /tmp/jk-vercel-health.json || true
  echo
fi
