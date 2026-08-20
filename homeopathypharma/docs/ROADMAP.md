# Product roadmap

Phased delivery plan for HomeopathyPharma.com. Phases are **sequential capabilities**, not calendar commitments — each phase exits when its exit criteria are met in staging.

## Launch order (priority stack)

The following order reflects production launch dependencies — later phases must not block earlier revenue paths.

### 1) Identity, catalog, doctor verification, checkout, shipping, admin

**Goal:** Secure commerce core with operational console.

| Deliverable | Status |
|-------------|--------|
| Google + OTP auth (backend ID token verify) | Stub — routes + verifier skeleton |
| MFA policy for admin/doctor roles | Closed-in-design (`requiresMfa`) |
| CSRF protection for cookie auth | Closed-in-design (`CsrfGuard`) |
| RBAC + SUPER_ADMIN role | Done |
| Prisma catalog schema + migrations | Done |
| Doctor verification workflow | Schema done; admin queue stub |
| Checkout + server-side pricing | Stub |
| Razorpay integration + webhook HMAC | Stub — `assertWebhookSignatureOrThrow` |
| Inventory reservation before payment | Schema done; API stub |
| Shiprocket shipping + webhooks | Stub |
| Admin console scaffold | Done |

**Exit criteria:** Staging user can authenticate; verified doctor visible; test order paid (Razorpay test mode); label created (Shiprocket sandbox); inventory reserved then decremented; admin audit log populated.

### 2) Products, bundles, appointments

**Goal:** Full catalog surface and consultation revenue.

| Deliverable | Status |
|-------------|--------|
| ProductGroup / variant PDP | In progress |
| Ingredient catalog + ProductCategoryMap | Schema done |
| Bundle composition | Schema done |
| OpenSearch indexing | Stub |
| Appointment booking + payment linkage | Stub |
| Doctor availability API | Stub |
| Customer coupons (`CustomerCoupon`) | Schema done |

**Exit criteria:** Published product group with variants purchasable; bundle checkout works; paid appointment creates `DoctorAppointment` row.

### 3) Health content, body, conditions, pets, SEO

**Goal:** Organic discovery and trusted educational content.

| Deliverable | Status |
|-------------|--------|
| Condition / organ / body-system pages | Scaffold |
| Pet content sections | Scaffold |
| Medical review workflow | Schema done |
| Segmented sitemaps (100k+ ready) | Documented |
| JSON-LD (`MedicalWebPage`, `lastReviewed`) | Package done |
| Merchant Center feed export | Feature flag |
| Referral program (`DoctorReferralRule`) | Schema done |

**Exit criteria:** Medically reviewed content publishable; sitemap index validates in Search Console staging; feed matches PDP for sample SKUs.

### 4) AI discovery on clean entity graph

**Goal:** AI-assisted search and recommendations on governed entities only.

| Deliverable | Status |
|-------------|--------|
| Entity graph (`EntityContentMap`, ingredients, conditions) | Schema done |
| AI discovery API (feature-flagged) | Planned |
| Guardrails — no thin generated pages | Closed-in-design (SEO policy) |
| Semantic search over OpenSearch | Planned |

**Exit criteria:** AI responses cite only published, reviewed entities; no auto-generated indexable URLs; discovery disabled by default in production until content graph populated.

---

## Foundation (cross-cutting, Phase 1 enablers)

| Deliverable | Status |
|-------------|--------|
| pnpm + Turborepo monorepo | Done |
| Docker compose (Postgres, Redis, OpenSearch, MinIO) | Done |
| NestJS API skeleton + `/v1` routes | Done |
| Redis session store | In progress |
| CI pipeline | Done |
| Dev bootstrap script | Done |

## Hardening (ongoing from Phase 1 → production)

| Deliverable | Status |
|-------------|--------|
| Threat model + loophole checklist | Documented |
| Rate limiting (Redis) | Stub |
| Observability (OTel, Sentry) | Hooks |
| k8s / terraform deploy paths | Documented |
| Load testing (search, checkout) | Planned |
| Legal policy publication | Placeholders |
| Penetration test remediation | Planned |

**Exit criteria:** CI green; e2e critical flows pass; counsel sign-off on policies; production runbook; on-call rotation defined.

## Cross-phase workstreams

| Workstream | Phases |
|------------|--------|
| Documentation (`docs/`) | All |
| Testing pyramid (`tests/`) | All |
| Compliance review | 1–4 |
| Performance & scaling | 2–4 |

## Related documents

- [SITE_MAP.md](./SITE_MAP.md)
- [ADMIN_ARCHITECTURE.md](./ADMIN_ARCHITECTURE.md)
- [LOOPHOLES.md](./LOOPHOLES.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ASSUMPTIONS.md](./ASSUMPTIONS.md)
- [COMPLIANCE.md](./COMPLIANCE.md)
