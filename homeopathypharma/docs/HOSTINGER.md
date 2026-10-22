# Hostinger deployment notes

> **Do not overwrite production** until the business owner explicitly approves a deploy.  
> This document is the runbook. The agent will not push live files without that approval.

## Confirmed environment (SSH probe — 2026-10-22)

| Item | Value |
|------|--------|
| Host | `in-mum-web1188.main-hosting.eu` (CloudLinux shared) |
| Account | `u452926742` |
| Document root | `domains/homeopathypharma.com/public_html` |
| PHP | 8.3 + Composer 2.9 |
| Database | MySQL/MariaDB via hPanel (`pdo_mysql`) |
| Node | Not required (static CSS in `public/css`) |

## Recommended filesystem layout

```
domains/homeopathypharma.com/
  laravel/                 # full Laravel app (private)
    app/ bootstrap/ config/ database/ resources/ routes/ storage/ vendor/ ...
    public/                # only this directory is web-exposed
  public_html/             # domain document root → contents of laravel/public
```

**Preferred:** In hPanel, point the domain document root to `laravel/public`.

**Fallback (no document-root change):** Copy/sync `laravel/public/*` into `public_html` and edit `public_html/index.php` so paths resolve one level up to `../laravel`:

```php
require __DIR__.'/../laravel/vendor/autoload.php';
$app = require_once __DIR__.'/../laravel/bootstrap/app.php';
```

Never expose `.env`, `vendor/` sources beyond Composer needs, or `storage/logs` as downloadable URLs.

## Pre-deploy checklist (local)

1. `cd homeopathypharma && composer install --no-dev -o`
2. `php artisan test` — must pass
3. `php artisan hp:preflight` — fix errors; review warnings
4. Confirm `.env` production values are prepared (see below) — **never commit secrets**
5. Take a backup of live `public_html` + current MySQL dump before any overwrite

## Production `.env` (Hostinger)

```env
APP_NAME="HOMEOPATHY PHARMA"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://homeopathypharma.com
APP_KEY=base64:...   # generate on server: php artisan key:generate

DB_CONNECTION=mysql
DB_HOST=localhost     # or host shown in hPanel
DB_PORT=3306
DB_DATABASE=...       # from hPanel MySQL
DB_USERNAME=...
DB_PASSWORD=...

SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
QUEUE_CONNECTION=database
CACHE_STORE=database
FILESYSTEM_DISK=public
LOG_CHANNEL=stack
LOG_LEVEL=error

MAIL_MAILER=log       # until a real mail provider is configured
ADMIN_EMAIL=...       # real mailbox you control — not @localhost.invalid
ADMIN_PASSWORD=...    # strong unique password

# Optional — leave empty until live payments are approved
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

Without Razorpay keys, **production checkout refuses** to fall back to test payments.

## Deploy steps (after explicit approval)

1. Create MySQL database + user in hPanel; note credentials.
2. Upload/rsync the Laravel app to `domains/homeopathypharma.com/laravel/` (exclude `.env`, `node_modules`, tests if desired).
3. Create `.env` on the server from the template above.
4. SSH:

```bash
cd ~/domains/homeopathypharma.com/laravel
composer install --no-dev -o
php artisan key:generate --force   # only if APP_KEY empty
php artisan migrate --force
php artisan db:seed --class=SiteSettingsSeeder
php artisan db:seed --class=HomepageSectionSeeder
# Policy drafts (optional): php artisan db:seed --class=PolicyPageSeeder
# Admin user (requires non-default ADMIN_* in .env):
php artisan db:seed --class=AdminUserSeeder
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan hp:preflight --strict
```

5. Point document root to `laravel/public` (or apply the `public_html` fallback).
6. Enable HTTPS in hPanel / Force HTTPS.
7. Set `storage/` and `bootstrap/cache/` to writable (typically `775` owned by the account user).
8. Run the [smoke checklist](SMOKE_CHECKLIST.md).

## Rollback

1. Restore the previous `public_html` / document-root backup.
2. Restore the MySQL dump taken before migrate.
3. Clear any new `laravel/` release folder if kept side-by-side (`laravel-prev/`).

## What this agent will not do automatically

- Overwrite live `public_html`
- Create hPanel MySQL databases
- Commit production secrets
- Enable Razorpay/Shiprocket without your credentials and approval

## Costs

- Uses the existing Hostinger plan and domain (no new purchase by this agent).
- Razorpay / Shiprocket / SMS / email providers may charge when you enable them.
