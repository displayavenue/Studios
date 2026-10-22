# HOMEOPATHY PHARMA

Professional homeopathy product store + practitioner discovery platform.

**Stack (Hostinger-compatible):** Laravel (PHP 8.3) · MySQL/MariaDB (production) · SQLite (local) · Blade

> Production on Hostinger is **not** overwritten automatically. Deploy only after explicit approval.

## Phase status

- [x] Phase 1 — Foundation (design tokens, settings, homepage shell, docs)
- [x] Phase 2 — Catalogue & admin (products, categories, brands, media, team, homepage, settings)
- [x] Phase 3 — Accounts, cart, checkout, Razorpay/test payment adapter, admin orders
- [x] Phase 4 — Doctors, verification gate, availability, conflict-safe booking, video adapter stub
- [x] Phase 5 — Health library, policies, shipping/notification adapters, audit, SEO
- [x] Phase 6 — Security hardening, Hostinger deploy docs, smoke checklist, preflight command

### Admin (local)

- URL: http://127.0.0.1:8000/admin/login
- Default local credentials (override via `.env`): `ADMIN_EMAIL=admin@localhost.invalid` / `ADMIN_PASSWORD=ChangeMeNow!123`
- This is **not** a business email — change before any production deploy.

## Local setup

```bash
cd homeopathypharma
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

Open http://127.0.0.1:8000

```bash
php artisan test
php artisan hp:preflight
```

Seed data includes **only** verified business settings (brand, tagline, phone, address), homepage shells, and draft policy templates. No invented products, doctors, founders, or emails.

## Business defaults (editable via `site_settings`)

- Phone: +91 8169 122333
- Address: No. 44, D Wing, Shree Sharanam CHS, Kanakia, Near Fire Station, Unique Garden, Mira Road East, Mumbai – 401107, Maharashtra, India.
- Tagline: Natural wellness. Expert guidance.

## Hostinger

See [docs/HOSTINGER.md](docs/HOSTINGER.md), [docs/SMOKE_CHECKLIST.md](docs/SMOKE_CHECKLIST.md), and [docs/SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md).

## Documentation

- [docs/MASTER_BUILD_PLAN.md](docs/MASTER_BUILD_PLAN.md)
- [docs/SETUP.md](docs/SETUP.md)
- [docs/HOSTINGER.md](docs/HOSTINGER.md)
- [docs/SMOKE_CHECKLIST.md](docs/SMOKE_CHECKLIST.md)
- [docs/SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md)
