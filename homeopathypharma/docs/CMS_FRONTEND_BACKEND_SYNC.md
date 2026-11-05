# Frontend ↔ Backend content sync

Whenever a **storefront section** gains new copy, CTAs, images, or labels:

1. Add/update the section in `app/Support/HomepageSectionCatalog.php` (key, defaults, admin fields).
2. Wire the Blade view to `$sections->get('key')` / `->data()` — never hardcode customer-facing copy.
3. Deploy and run `php artisan homepage:sync-sections` so the new key appears in **Admin → Homepage sections**.
4. For full pages (About, Consult, Contact, Founders intro), edit **Admin → Content pages** (`content_pages` table).

## What lives where

| Content | Admin location |
|--------|----------------|
| Homepage section titles, subtitles, CTAs, form labels, concern list, mission quote | Homepage sections |
| Brand / phone / address / announcement | Site Settings |
| Products, categories, brands, doctors, team, testimonials, articles | Their own admin menus (+ “show on homepage”) |
| About / Consult / Contact / Founders intro body | Content pages |
| Policies / FAQ | Policies |
| Health Explorer organs/products | Health Explorer |

## Command

```bash
php artisan homepage:sync-sections
# optional: --force-payload to reset payloads to catalog defaults
php artisan db:seed --class=ContentPageSeeder
```

## After every content change

Use **Admin → Clear cache & cookies** (or call the purge service) so views, settings cache, visitor sessions, and CSS/JS tokens refresh.