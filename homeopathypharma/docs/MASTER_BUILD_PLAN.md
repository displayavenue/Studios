# Homeopathy Pharma — Master Build Plan (inspection)

> Status: **Phase 1 in progress / completed locally** — Laravel app scaffolded.  
> Hostinger: shared CloudLinux (PHP 8.3 + MySQL; no Node runtime).  
> Production files will **not** be overwritten until you explicitly approve a deploy.

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

## Hosting check (SSH probe — 2026-10-22)

| Check | Result |
|-------|--------|
| Host | `in-mum-web1188.main-hosting.eu` (CloudLinux shared web hosting) |
| Account | `u452926742` |
| Site path | `domains/homeopathypharma.com/public_html` |
| PHP | **8.3.35** CLI + Composer **2.9** |
| PHP extensions | mysqli, pdo_mysql, pdo_sqlite, gd, curl, mbstring, openssl, zip, fileinfo |
| MySQL/MariaDB | Client **11.8** present; `pdo_mysql=yes`; DB credentials **not** in `~/.my.cnf` (create/use DB in hPanel) |
| Node in SSH PATH | **Not available** (`node` / `npm` missing) |
| alt-nodejs packages | Present on server (`alt-nodejs18`…`24`) but not activated for this shell — do **not** rely on Node for the primary app |
| Current live site | Static Next export + PHP `/backend` CMS (last deploy ~ Oct 7) |

### Chosen architecture (from check)

**Laravel 11 (PHP 8.3) + MySQL/MariaDB on Hostinger shared hosting**, Blade (or Inertia later), file storage on disk, Redis optional later if available.

Reasons: matches Hostinger capabilities, Composer available, MySQL supported, zero extra hosting cost, real admin/auth/orders possible. The existing NestJS + Postgres + Redis monorepo **cannot** be the production runtime on this plan.

## Phased plan (from master prompt)

| Phase | Scope | Acceptance (high level) |
|-------|--------|-------------------------|
| **1** | Foundation: design tokens, layout shell, DB access, migrations, seed (demo-labelled), docs | Homepage shell matches palette; no invented business claims; settings-driven phone/address |
| **2** | Catalogue + admin media/products/categories/homepage/team | CRUD from DB; all images via media library |
| **3** | Auth, cart, checkout, payment adapter, inventory | Server-verified prices; no fake paid status |
| **4** | Doctors + appointments | No invented practitioners; slot conflict prevention |
| **5** | Health library, policies, shipping/notifications adapters | Draft content stays private — **done in repo** |
| **6** | Tests, security review, Hostinger deploy docs, smoke tests | Matches real hosting — next |

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
