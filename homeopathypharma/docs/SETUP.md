# Setup (Phase 1)

## Requirements

- PHP 8.3+ with extensions: mbstring, openssl, pdo, tokenizer, xml, ctype, json, bcmath, fileinfo, sqlite3 or mysqli
- Composer 2
- SQLite (local) or MySQL/MariaDB (Hostinger)

## Install

```bash
composer install
cp .env.example .env
php artisan key:generate
# SQLite:
touch database/database.sqlite
# or configure MySQL in .env
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

## What Phase 1 includes

- Design tokens matching the master palette
- Header, announcement bar, footer
- Homepage sections driven by `homepage_sections`
- Site settings for brand, phone, address
- Empty-state shop, doctors, health library, founders
- Contact page with validation (email send not claimed)
- Media assets table (upload UI in Phase 2)

## What Phase 1 deliberately excludes

- Fake products, doctors, reviews, founders
- Live payment / shipping / SMS
- Admin dashboard UI (Phase 2)
- Overwriting Hostinger production
