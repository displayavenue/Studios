#!/usr/bin/env bash
# Deploy JyotishKundali Next.js app to Vercel (BOM region via vercel.json).
#
# Prerequisites:
#   - VERCEL_TOKEN (create at https://vercel.com/account/tokens)
#   - Optional: VERCEL_ORG_ID, VERCEL_PROJECT_ID (from .vercel/project.json after first link)
#   - Production env vars set in Vercel dashboard (DATABASE_URL, AUTH_SECRET, …)
#
# Usage:
#   bash scripts/deploy-vercel.sh            # production deploy
#   bash scripts/deploy-vercel.sh preview    # preview deploy
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TARGET="${1:-production}"

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required" >&2
  exit 1
fi

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "VERCEL_TOKEN is not set." >&2
  echo "Create a token at https://vercel.com/account/tokens and export it, e.g.:" >&2
  echo "  export VERCEL_TOKEN=…" >&2
  exit 1
fi

ARGS=(--token "$VERCEL_TOKEN" --yes)
if [[ -n "${VERCEL_ORG_ID:-}" ]]; then
  ARGS+=(--scope "$VERCEL_ORG_ID")
fi

echo "Pulling / ensuring project link…"
npx vercel "${ARGS[@]}" link --yes ${VERCEL_PROJECT_ID:+--project "$VERCEL_PROJECT_ID"} || true

echo "Deploying ($TARGET)…"
if [[ "$TARGET" == "preview" ]]; then
  URL="$(npx vercel "${ARGS[@]}" deploy)"
else
  URL="$(npx vercel "${ARGS[@]}" deploy --prod)"
fi

echo "DEPLOY_OK"
echo "$URL"

# Smoke-check the deployment URL if curl is available
if command -v curl >/dev/null 2>&1 && [[ -n "$URL" ]]; then
  sleep 3
  CODE="$(curl -sL -o /tmp/jk-vercel-smoke.html -w '%{http_code}' "$URL" || true)"
  echo "SMOKE_HTTP=$CODE"
  if rg -q "JyotishKundali|Know Yourself" /tmp/jk-vercel-smoke.html 2>/dev/null; then
    echo "SMOKE_OK_JYOTISH"
  else
    echo "SMOKE_WARN: brand string not found (app may still be warming or needs env)" >&2
  fi
fi
