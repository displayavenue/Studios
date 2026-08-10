# DisplayAvenue OS — Architecture & Implementation Plan

**Product:** DisplayAvenue OS  
**Promise:** Acquire → Qualify → Sell → Collect → Onboard → Execute → Monitor → Report → Retain → Upsell  
**Primary subdomain:** `os.displayavenue.com`  
**Related:** `growth360.displayavenue.com` (or `/growth360` route inside OS) · `displayavenue.com` (marketing)

---

## Phase 0 — Repository inspection (completed)

### What exists

| Surface | Stack | Role |
|---------|-------|------|
| Root `src/` | Vite + React 19 + PHP JSON CMS | DisplayAvenue Studios marketing |
| `growth360/` | Next.js 15 + Prisma + Postgres + OpenAI + Razorpay + PDFKit | Growth360 lead product (single-tenant) |
| `agency/` (other branches) | Vite + PHP CMS | displayavenue.com agency site |

### Reuse (do not rewrite)

- Growth360 rule engines (score, pricing, ROI, strategy, competitors)
- AI service pattern (server-only, structured JSON, cache, cost tracking)
- Razorpay create/verify pattern
- PDFKit report pipeline
- Admin JWT + bcrypt auth kernel
- Zod + `{ ok, data }` API convention

### Gaps for OS

- No Organization / multi-tenancy
- No RBAC permissions matrix
- No client portal auth
- No Meta Marketing API
- No background jobs / webhooks reliability
- No invoices / MRR / client health
- Hostinger static deploy cannot host Node+Postgres OS

### Decision

Build **`os/`** as a new Next.js App Router multi-tenant platform.  
Keep **`growth360/`** intact and port its engines into OS modules (do not delete).  
Do **not** replace Studios/Agency static sites — they remain marketing frontends.

---

## Target architecture

```
Browser
  ├─ os.displayavenue.com          → DisplayAvenue OS (Next.js)
  │    /                           → Public landing (DA acquisition)
  │    /growth360/*                → Growth360 module
  │    /login                      → Auth
  │    /app/*                      → Internal (staff)
  │    /portal/*                   → Client portal (tenant-scoped)
  │    /api/*                      → API (auth + org isolation)
  └─ displayavenue.com             → Marketing (existing)

PostgreSQL (Prisma)
  - organization_id on every tenant-owned row
  - Membership + Role + Permission checks server-side

Jobs (DB-backed queue V1 → Redis/BullMQ later)
  - Meta sync, AI, PDF, reminders, health scores

Integrations
  - OpenAI (server)
  - Razorpay (orders + webhooks)
  - Meta Ads Adapter (OAuth + Marketing API)
  - Email + WhatsApp Business API (official)
```

### Multi-tenancy model

- `Organization` = client workspace (or DisplayAvenue internal org)
- `Membership` links `User` ↔ `Organization` with `Role`
- Every query for tenant data uses `requireOrgAccess(orgId, permission)`
- Super-admin can cross orgs; clients never can
- Never trust frontend org filters

### Roles (V1)

`SUPER_ADMIN` `ADMIN` `SALES` `ACCOUNT_MANAGER` `PERFORMANCE_MARKETER` `CREATIVE` `FINANCE` `CLIENT_OWNER` `CLIENT_USER` `VIEWER`

### Subdomain / DNS

| Host | App |
|------|-----|
| `os.displayavenue.com` | DisplayAvenue OS (this app) |
| `growth360.displayavenue.com` | Optional alias → OS Growth360 routes |
| `displayavenue.com` | Agency marketing |

Production requires Node host (VPS/Railway/Render/Fly) + managed Postgres — not Hostinger shared PHP.

---

## Phase plan

| Phase | Scope | Status |
|-------|-------|--------|
| **1** | Architecture, DB multi-tenancy, auth, RBAC, audit, jobs skeleton, Command Center shell (real empty metrics) | **IN PROGRESS** |
| **2** | Landing, Growth360 port, lead capture, CRM pipeline | Pending |
| **3** | Lead scoring, growth score rules, competitors, AI analysis | Pending |
| **4** | Email/WhatsApp workflows, ₹99 Razorpay + webhook, calendar, sales | Pending |
| **5** | Proposal, payment, onboarding, client portal | Pending |
| **6** | Meta OAuth + adapter + campaign builder + creatives | Pending |
| **7** | Monitoring, lead sync, health, alerts | Pending |
| **8** | AI performance + optimization approvals | Pending |
| **9** | Reporting, PDF, invoices, fee engine, reminders | Pending |
| **10** | Client health, retention, upsell, referral | Pending |
| **11** | CEO exception center, profitability | Pending |
| **12** | Security hardening, tests, observability | Pending |
| **13** | Google Ads adapter (later) | Deferred |

---

## Phase 1 deliverables

1. `os/` Next.js app
2. Prisma schema: Organization, User, Membership, RolePermission, Session, AuditLog, Job, Setting + stubs for Lead/Campaign/Payment
3. Auth: register/login (staff), JWT httpOnly cookies, password hashing
4. Tenant middleware helpers
5. Seed: DisplayAvenue org + SUPER_ADMIN
6. `/app` Command Center reading **real** DB aggregates (zeros until data exists — not fake KPIs)
7. Env template for subdomain + secrets
8. Typecheck, lint, test, build

---

## Non-goals for Phase 1

- Fake Meta/campaign charts
- Fabricated competitors or ROAS
- Full CRM UI
- Meta OAuth (documented stubs only)
