# HOMEOPATHY PHARMA

Professional homeopathy product store + practitioner discovery platform.

**Stack (Hostinger-compatible):** Laravel (PHP 8.3) · MySQL/MariaDB (production) · SQLite (local) · Blade

> Production on Hostinger is **not** overwritten automatically. Deploy only after explicit approval.

## Phase status

- [x] Phase 1 — Foundation (design tokens, settings, homepage shell, docs)
- [ ] Phase 2 — Catalogue & admin
- [ ] Phase 3 — Accounts & ecommerce
- [ ] Phase 4 — Doctors & appointments
- [ ] Phase 5 — Content & operations
- [ ] Phase 6 — Testing & launch

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

Seed data includes **only** verified business settings (brand, tagline, phone, address) and homepage section shells. No invented products, doctors, founders, or emails.

## Business defaults (editable via `site_settings`)

- Phone: +91 8169 122333
- Address: No. 44, D Wing, Shree Sharanam CHS, Kanakia, Near Fire Station, Unique Garden, Mira Road East, Mumbai – 401107, Maharashtra, India.
- Tagline: Natural wellness. Expert guidance.

## Hostinger

See [docs/HOSTINGER.md](docs/HOSTINGER.md).

## Documentation

- [docs/MASTER_BUILD_PLAN.md](docs/MASTER_BUILD_PLAN.md)
- [docs/SETUP.md](docs/SETUP.md)
- [docs/HOSTINGER.md](docs/HOSTINGER.md)
