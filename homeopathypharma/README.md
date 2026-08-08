> **Repository note:** This monorepo lives in the `homeopathypharma/` directory alongside an unrelated **DisplayAvenue** project at the workspace root. All HomeopathyPharma work stays inside this folder — do not modify DisplayAvenue root files.

# HomeopathyPharma.com

Premium healthcare and ecommerce platform for homeopathic products, verified doctor consultations, and medically reviewed educational content. India-first (INR, Razorpay, Shiprocket) with architecture ready for 100k+ product URLs.

## Quick start

**Prerequisites:** Node 22+, pnpm 9+, Docker

```bash
cd homeopathypharma
./scripts/dev-bootstrap.sh
```

Or step by step:

```bash
cp .env.example .env          # edit secrets as needed
pnpm docker:up                # Postgres, Redis, OpenSearch, MinIO
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed                  # RBAC + taxonomy shells only (no fake production data)
pnpm dev                      # all apps + API + worker
```

### Local URLs

| Service | URL |
|---------|-----|
| Storefront | http://localhost:3000 |
| Doctor portal | http://localhost:3001 |
| Admin console | http://localhost:3002 |
| API (`/v1`) | http://localhost:4000 |
| MinIO console | http://localhost:9001 |
| Prisma Studio | `pnpm db:studio` |

## Monorepo structure

```
homeopathypharma/
├── apps/
│   ├── web/              # Next.js storefront + health content
│   ├── doctor/           # Doctor portal
│   └── admin/            # Operations console
├── services/
│   ├── api/              # NestJS API — backend source of truth
│   └── worker/           # BullMQ async jobs
├── packages/
│   ├── auth/             # Sessions, RBAC, Google token verification
│   ├── config/           # Shared configuration
│   ├── database/         # Prisma schema & migrations
│   ├── integrations/     # Razorpay, Shiprocket, S3, state machines
│   ├── seo/              # Sitemaps, JSON-LD, robots
│   ├── ui/               # Shared React components
│   └── validation/       # Zod API schemas
├── docs/                 # Architecture, security, compliance
├── infrastructure/       # Docker, nginx, k8s, terraform notes
├── tests/                # e2e, unit, integration, contract
└── scripts/              # Dev bootstrap
```

**Stack:** pnpm workspaces · Turborepo · TypeScript · PostgreSQL · Redis · OpenSearch · S3

## Common commands

```bash
pnpm dev:web          # storefront only
pnpm dev:api          # API only
pnpm dev:worker       # worker only
pnpm lint             # ESLint across packages
pnpm typecheck        # TypeScript
pnpm test             # unit tests (Vitest)
pnpm test:e2e         # Playwright (when configured)
pnpm build            # production build all packages
pnpm ci               # lint + typecheck + test + build
pnpm docker:logs      # infrastructure logs
pnpm docker:down      # stop containers
```

## Documentation

| Document | Description |
|----------|-------------|
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design, scaling, ADRs |
| [docs/DATA_MODEL.md](./docs/DATA_MODEL.md) | Domain model & integrity rules |
| [docs/WORKFLOWS.md](./docs/WORKFLOWS.md) | Auth, checkout, shipping, booking flows |
| [docs/SECURITY_THREAT_MODEL.md](./docs/SECURITY_THREAT_MODEL.md) | OWASP controls & threat closure |
| [docs/SEO.md](./docs/SEO.md) | URLs, sitemaps, schema.org policy |
| [docs/COMPLIANCE.md](./docs/COMPLIANCE.md) | Regulatory placeholders & disclaimers |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Phases 1–6 delivery plan |
| [docs/ASSUMPTIONS.md](./docs/ASSUMPTIONS.md) | Default decisions |

## Positioning

HomeopathyPharma combines **regulated-commerce discipline** (immutable order snapshots, inventory batch tracking, payment webhook verification) with **healthcare trust** (doctor credential verification, medical content review, verified-purchase reviews only). We do not publish unsupported medical claims; health content follows editorial and medical review workflows described in the docs.

## CI

GitHub Actions workflow: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) — lint, typecheck, test, build on Node 22.

If the git repository root is the parent workspace (DisplayAvenue), copy or symlink this workflow to the root `.github/workflows/` and keep `working-directory: homeopathypharma`.

## License

Proprietary — All rights reserved.
