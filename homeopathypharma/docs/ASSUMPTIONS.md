# Assumptions

Decisions made **without explicit stakeholder confirmation**. Revisit when requirements change or new markets launch.

## Market & business

| Assumption | Detail |
|------------|--------|
| **India-first** | Primary market is India; currency INR; locale `en-IN` default |
| **Homeopathy focus** | Product catalog is homeopathic medicines and related wellness SKUs — not general pharmacy unless licensed |
| **B2C primary** | Direct consumer sales; B2B/clinic bulk orders deferred |
| **Doctor marketplace** | Verified doctors offer paid/free consultations; platform takes commission (rate TBD) |

## Technology stack

| Assumption | Detail |
|------------|--------|
| **Node 22+** | Engines field in root `package.json` |
| **pnpm 9 + Turborepo** | Workspace manager and task orchestration |
| **TypeScript everywhere** | Apps, services, packages share `tsconfig.base.json` |
| **NestJS modular monolith** | Single API deploy unit with domain modules — not microservices initially |
| **Next.js App Router** | Storefront, doctor, admin frontends |
| **Prisma + PostgreSQL 16** | ORM and primary database |
| **Redis 7** | Sessions, BullMQ, idempotency, rate limits |
| **OpenSearch 2** | Search and browse facets at scale |
| **S3-compatible storage** | MinIO locally; AWS S3 (or compatible) in production |
| **Vitest** | Unit/integration tests in packages |
| **Playwright** | E2E tests in `tests/e2e` |

## Authentication & sessions

| Assumption | Detail |
|------------|--------|
| **Session cookies in Redis** | Not JWT-in-localStorage; `HttpOnly` cookie named via `SESSION_COOKIE_NAME` |
| **Google OAuth** | Primary social login; backend verifies ID token with `google-auth-library` |
| **OTP fallback** | Email and phone OTP for users without Google |
| **Admin MFA** | Enabled by default (`ADMIN_REQUIRE_MFA=true`) |

## Payments & logistics

| Assumption | Detail |
|------------|--------|
| **Razorpay** | Payment gateway for INR; webhooks for reconciliation |
| **Shiprocket** | Primary shipping aggregator for domestic India |
| **No COD initially** | Prepaid only until fraud controls for COD defined |
| **Manual refunds** | High-value or disputed refunds may require admin action |

## Architecture

| Assumption | Detail |
|------------|--------|
| **Backend source of truth** | All pricing, inventory, auth, and state transitions in API |
| **BullMQ workers** | Async jobs separated from API process |
| **Idempotency keys** | Required on checkout, payment verify, and shipment create |
| **Soft delete** | `deletedAt` on most user-facing entities |
| **Immutable snapshots** | Orders and ledgers append-only after creation |

## SEO & content

| Assumption | Detail |
|------------|--------|
| **100k+ URL target** | Sitemap segmentation built in from Phase 2 |
| **Medical review gate** | Health content requires approver before publish |
| **No AI-only pages** | Editorial workflow required for indexable content |
| **Separate app origins** | Admin (3002) and doctor (3001) not mixed with storefront (3000) |

## Security

| Assumption | Detail |
|------------|--------|
| **Webhook signatures mandatory** | Razorpay and Shiprocket — reject unsigned |
| **Private medical docs** | Never on public CDN |
| **Rate limiting** | Default 120 req/min per IP (`RATE_LIMIT_*`) — tune per route |

## Repository layout

| Assumption | Detail |
|------------|--------|
| **Nested monorepo** | Lives in `homeopathypharma/` subdirectory alongside unrelated DisplayAvenue project |
| **No parent repo edits** | CI and docs scoped to `homeopathypharma/` only |
| **GitHub Actions** | Workflow at `homeopathypharma/.github/workflows/ci.yml`; if repo root is parent project, copy or path-filter to this directory |

## Environment defaults (local)

From `.env.example`:

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| Doctor | http://localhost:3001 |
| Admin | http://localhost:3002 |
| API | http://localhost:4000 |
| Postgres | localhost:5432 |
| Redis | localhost:6379 |
| OpenSearch | http://localhost:9200 |
| MinIO API | http://localhost:9000 |
| MinIO Console | http://localhost:9001 |

## Explicit non-assumptions (TBD with stakeholders)

- Exact referral commission percentages
- International shipping and multi-currency
- Prescription-required SKU handling
- WhatsApp notification provider (`FEATURE_WHATSAPP=false` until chosen)
- Production cloud vendor (AWS vs GCP vs other)

## Related documents

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ROADMAP.md](./ROADMAP.md)
