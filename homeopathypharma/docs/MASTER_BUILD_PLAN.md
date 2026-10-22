# Homeopathy Pharma — Master Build Plan (inspection)

> Status: **blocked on Hostinger plan confirmation** before destructive rebuild.  
> Production files on Hostinger will **not** be overwritten until you explicitly approve a deploy.

## What exists today

| Area | Finding |
|------|---------|
| Location | `homeopathypharma/` monorepo inside DisplayAvenue Studios repo |
| Package manager | pnpm 9 + Turborepo |
| Storefront | Next.js 15 App Router (`apps/web`) — currently built as **static export** for Hostinger |
| Admin / doctor | Separate Next apps (`apps/admin`, `apps/doctor`) |
| API | NestJS (`services/api`) + BullMQ worker |
| Database (designed) | Prisma + **PostgreSQL** |
| Assumed infra | Redis, OpenSearch, S3/MinIO, Docker |
| Live deploy path | `scripts/deploy-hostinger.sh` → SSH to Hostinger `public_html` with static HTML + PHP CMS helpers |
| Contact already used | `+91 8169122333` (will standardize to **+91 8169 122333**) |
| Design reference image | **Not found** in the workspace / attachments at inspection time |

## Hosting constraint (critical)

Evidence from deploy scripts and prior live deploys:

- Hostinger serves **static files + PHP** under `domains/homeopathypharma.com/public_html`.
- There is **no running Node.js API, PostgreSQL, Redis, or Docker** on that deploy path.
- The monorepo’s full stack (NestJS + Postgres + Redis) **cannot run as designed on conventional shared Hostinger** without a VPS/Cloud Node plan or an external database/host.

Therefore stack choice **must** wait on your Hostinger plan type.

### Candidate architectures (after you confirm)

| Hostinger plan | Recommended stack | Notes |
|----------------|-------------------|--------|
| **Shared / Web hosting** (PHP + MySQL) | Laravel (or PHP app) + MySQL/MariaDB + Blade/Inertia, or Next static + PHP/MySQL API | Fits current deploy; zero extra infra cost |
| **VPS / Cloud with Node** | Next.js + NestJS (or Next full-stack) + PostgreSQL/MySQL on the VPS | Closest to existing monorepo; needs VPS management |
| **Shared + external free/low-cost DB** | Static/SSR frontend + backend elsewhere | Usually introduces paid or fragile free-tier dependencies — avoid unless you approve |

## Phased plan (from master prompt)

| Phase | Scope | Acceptance (high level) |
|-------|--------|-------------------------|
| **1** | Foundation: design tokens, layout shell, DB access, migrations, seed (demo-labelled), docs | Homepage shell matches palette; no invented business claims; settings-driven phone/address |
| **2** | Catalogue + admin media/products/categories/homepage/team | CRUD from DB; all images via media library |
| **3** | Auth, cart, checkout, payment adapter, inventory | Server-verified prices; no fake paid status |
| **4** | Doctors + appointments | No invented practitioners; slot conflict prevention |
| **5** | Health library, policies, shipping/notifications adapters | Draft content stays private |
| **6** | Tests, security review, Hostinger deploy docs, smoke tests | Matches real hosting |

## Risks checklist

- [ ] Wrong stack for Hostinger → site cannot actually run admin/auth/orders
- [ ] Overwriting live `public_html` without backup approval
- [ ] Demo seed data leaking to production
- [ ] Inventing doctors/founders/products/emails (forbidden)
- [ ] Claiming payments/email/video work before providers are configured
- [ ] Postgres/Redis assumptions on shared hosting
- [ ] Missing design reference image → visual mismatch until provided
- [ ] Destructive “delete all” of monorepo without confirming keep/archive of prior work

## Defaults already confirmed by you

- Brand: HOMEOPATHY PHARMA  
- Tagline: Natural wellness. Expert guidance.  
- Phone: **+91 8169 122333**  
- Address: No. 44, D Wing, Shree Sharanam CHS, Kanakia, Near Fire Station, Unique Garden, Mira Road East, Mumbai – 401107, Maharashtra, India.  
- Currency: INR · Locale: en-IN  
- No invented email/social/doctors/founders/products/testimonials  
- Do not deploy/overwrite production without explicit approval  

## Next action

Answer the Hostinger plan question below. Then Phase 1 starts on a new feature branch (no production overwrite).
