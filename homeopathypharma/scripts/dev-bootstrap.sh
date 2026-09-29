#!/usr/bin/env bash
# HomeopathyPharma local development bootstrap
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> HomeopathyPharma dev bootstrap"
echo "    Root: $ROOT_DIR"

if [[ ! -f .env ]]; then
  echo "==> Copying .env.example -> .env"
  cp .env.example .env
  echo "    Review .env and set secrets (SESSION_SECRET, provider keys) before production use."
else
  echo "==> .env already exists — skipping copy"
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: Docker is required. Install Docker Desktop or Docker Engine."
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "ERROR: pnpm is required (Node 22+). Enable via corepack: corepack enable && corepack prepare pnpm@9.15.4 --activate"
  exit 1
fi

echo "==> Starting infrastructure (Postgres, Redis, OpenSearch, MinIO)"
docker compose -f infrastructure/docker/docker-compose.yml up -d

echo "==> Waiting for Postgres healthcheck..."
until docker compose -f infrastructure/docker/docker-compose.yml exec -T postgres pg_isready -U hp -d homeopathypharma >/dev/null 2>&1; do
  sleep 2
done

echo "==> Installing dependencies"
pnpm install

echo "==> Generating Prisma client"
pnpm db:generate

echo "==> Applying database migrations (dev)"
pnpm db:migrate

echo "==> Seeding database (optional demo data)"
pnpm db:seed || echo "    Seed skipped or failed — check packages/database/prisma/seed.ts"

cat <<'EOF'

Bootstrap complete.

Next steps:
  pnpm dev          # all apps + services (parallel)
  pnpm dev:web      # storefront       http://localhost:3000
  pnpm dev:doctor   # doctor portal    http://localhost:3001
  pnpm dev:admin    # admin console    http://localhost:3002
  pnpm dev:api      # NestJS API       http://localhost:4000
  pnpm dev:worker   # BullMQ worker

Useful commands:
  pnpm db:studio    # Prisma Studio
  pnpm docker:logs  # infrastructure logs
  pnpm docker:down  # stop containers

See README.md and docs/ for architecture and workflows.

EOF
