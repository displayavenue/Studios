# Product roadmap

Phased delivery plan for HomeopathyPharma.com aligned with the product brief. Phases are **sequential capabilities**, not calendar commitments — each phase exits when its exit criteria are met in staging.

## Phase 1 — Monorepo, database, auth

**Goal:** Development foundation and secure identity.

| Deliverable | Status |
|-------------|--------|
| pnpm + Turborepo monorepo | Done |
| Prisma schema + migrations | Done |
| Docker compose (Postgres, Redis, OpenSearch, MinIO) | Done |
| NestJS API skeleton + `/v1` routes | Done |
| Google + OTP auth stubs | In progress |
| Redis session store | In progress |
| RBAC packages | Done |
| CI pipeline | Done |
| Dev bootstrap script | Done |

**Exit criteria:** User can register/login in staging; session persists; migrations run in CI; health checks green.

## Phase 2 — Storefront & catalog

**Goal:** Browse and search homeopathic products.

| Deliverable | Status |
|-------------|--------|
| Next.js web app shell | Done (scaffold) |
| Product/category pages | In progress |
| OpenSearch indexing pipeline | Stub |
| Cart API | Stub |
| Public SEO (robots, sitemap stub) | In progress |
| `@homeopathypharma/seo` package | Done |

**Exit criteria:** Published products searchable and purchasable path started; segmented sitemap for catalog; PDP renders server-fetched prices.

## Phase 3 — Doctor portal

**Goal:** Verified doctors manage profiles and consultations.

| Deliverable | Status |
|-------------|--------|
| Doctor Next.js app | Scaffold |
| Verification submission flow | Stub |
| Admin verification queue | Stub |
| Consultation availability API | Stub |
| Appointment booking ( unpaid path ) | Stub |

**Exit criteria:** End-to-end verification in staging; approved doctor visible on public profile URL; booking creates `Appointment` row.

## Phase 4 — Admin, payments, shipping

**Goal:** Operate commerce at scale.

| Deliverable | Status |
|-------------|--------|
| Admin console | Scaffold |
| Product publish workflow | Stub |
| Checkout + Razorpay | Stub |
| Webhook reconciliation | Stub |
| Shiprocket integration | Stub |
| Inventory batches + reservations | Schema done |
| Order fulfillment UI | Planned |

**Exit criteria:** Test order paid via Razorpay test mode; label created in Shiprocket sandbox; inventory decrements correctly; admin audit log populated.

## Phase 5 — SEO & knowledge base

**Goal:** Organic discovery and trusted health content.

| Deliverable | Status |
|-------------|--------|
| Condition / organ / pet content pages | Scaffold |
| Medical review workflow | Schema done |
| Sitemap segmentation (100k+ ready) | Documented |
| JSON-LD on PDP and articles | Package done |
| Merchant Center feed export | Feature flag |
| Referral program | Stub |

**Exit criteria:** Medically reviewed content publishable; sitemap index validates in Search Console staging; feed matches PDP for sample SKUs.

## Phase 6 — Hardening & production

**Goal:** Security, compliance, and operational readiness.

| Deliverable | Status |
|-------------|--------|
| Threat model closure tests | Documented |
| Rate limiting (Redis) | Stub |
| MFA for admin | Config flag |
| Observability (OTel, Sentry) | Hooks |
| k8s / terraform deploy paths | Documented |
| Load testing (search, checkout) | Planned |
| Legal policy publication | Placeholders |
| Penetration test remediation | Planned |

**Exit criteria:** CI green; e2e critical flows pass; counsel sign-off on policies; production runbook; on-call rotation defined.

## Cross-phase workstreams

| Workstream | Phases |
|------------|--------|
| Documentation (`docs/`) | 1–6 |
| Testing pyramid (`tests/`) | 1–6 |
| Compliance review | 4–6 |
| Performance & scaling | 2, 5, 6 |

## Related documents

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ASSUMPTIONS.md](./ASSUMPTIONS.md)
- [COMPLIANCE.md](./COMPLIANCE.md)
