#!/usr/bin/env bash
set -euo pipefail
export NODE_ENV=production

echo "[vercel-build] prisma generate"
npx prisma generate

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "[vercel-build] ERROR: DATABASE_URL is not set for this Vercel environment."
  exit 1
fi

echo "[vercel-build] prisma migrate deploy"
npx prisma migrate deploy

if [[ "${SEED_ON_BUILD:-}" == "true" ]]; then
  echo "[vercel-build] seeding (SEED_ON_BUILD=true)"
  SEED_GROWTH360_CATALOG=true npx tsx prisma/seed.ts
fi

echo "[vercel-build] next build"
npx next build
