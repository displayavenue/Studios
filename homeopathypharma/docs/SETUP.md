# Setup

## Requirements

- PHP 8.3+ with extensions: mbstring, openssl, pdo, tokenizer, xml, ctype, json, bcmath, fileinfo, sqlite3 or mysqli
- Composer 2
- SQLite (local) or MySQL/MariaDB (Hostinger)

## Install (local)

```bash
cd homeopathypharma
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Open http://127.0.0.1:8000

Default local admin (change before production):

- `/admin/login`
- `ADMIN_EMAIL=admin@localhost.invalid`
- `ADMIN_PASSWORD=ChangeMeNow!123`

## Useful commands

```bash
php artisan test
php artisan hp:preflight          # launch readiness (no remote deploy)
php artisan hp:preflight --strict # treat warnings as failures
```

## Phase coverage

| Phase | Status |
|-------|--------|
| 1 Foundation | Done |
| 2 Catalogue + admin | Done |
| 3 Cart / checkout / payments | Done |
| 4 Doctors / appointments | Done |
| 5 Health library / policies / ops | Done |
| 6 Security review / Hostinger docs / smoke | Done in repo — **live deploy still requires approval** |

## Hostinger

See [HOSTINGER.md](HOSTINGER.md) and [SMOKE_CHECKLIST.md](SMOKE_CHECKLIST.md). Do not overwrite production without explicit approval.
