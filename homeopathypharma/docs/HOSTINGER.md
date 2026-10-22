# Hostinger deployment notes

## Confirmed environment (SSH probe)

- Shared CloudLinux hosting: `in-mum-web1188.main-hosting.eu`
- PHP 8.3 + Composer
- MySQL/MariaDB with `pdo_mysql`
- Document root: `domains/homeopathypharma.com/public_html`
- Node is **not** required for this Laravel app (CSS is static in `public/css`)

## Recommended layout on Hostinger

```
domains/homeopathypharma.com/
  laravel/          # app root (outside public_html) OR sibling path
  public_html/      # point to laravel/public contents / symlink
```

Typical shared-hosting approach:

1. Create a MySQL database + user in hPanel.
2. Upload the Laravel project **above** `public_html` (or into a private folder).
3. Point the domain document root to the Laravel `public/` directory, **or** copy `public/` into `public_html` and adjust `index.php` paths.
4. Set `.env` with MySQL credentials (never commit secrets).
5. Run `composer install --no-dev -o` on the server (Composer is available).
6. `php artisan migrate --force`
7. `php artisan db:seed --class=SiteSettingsSeeder` (and homepage seeder) once.
8. `php artisan storage:link`
9. Ensure `storage/` and `bootstrap/cache/` are writable.

## Do not deploy yet

Production overwrite requires **explicit approval** after Phase 1 review.

## Costs

- Uses existing Hostinger plan and domain (no new purchase by this agent).
- MySQL is included with typical Hostinger shared plans.
- Razorpay / Shiprocket / SMS / email providers may charge later when enabled.
