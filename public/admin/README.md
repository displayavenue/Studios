# DisplayAvenue Studios CMS

## Admin login

Open: **https://displayavenuestudios.com/admin/**

Default password (change immediately):

```
DisplayAdmin@2026
```

Edit it in: `/admin/config.php` → `admin_password`

## What you can edit

- **Homepage** — hero headline, image, CTAs, and every section title/copy
- Company name, phone, WhatsApp, email, address, badges, logos
- All services (text + image URLs)
- Packages & prices
- Portfolio projects & gallery images
- FAQs, blog posts, testimonials, team, industries, locations
- Process steps & “Why choose us”
- **Settings & Tracking** — GTM, Google Analytics, Google Ads, Meta Pixel, custom ad/AI scripts

## Marketing & tracking codes

In **Settings & Tracking** you can manage:

- Google Tag Manager ID (`GTM-…`)
- Google Analytics ID (`G-…`)
- Google Ads conversion tag (`AW-…`)
- Meta (Facebook) Pixel ID
- Google Search Console verification code
- **Additional head scripts** — paste full `<script>` tags from any ad platform (Google Ads, LinkedIn, Microsoft, AI ad tools, etc.)
- **Additional body snippets** — noscript fallbacks or pixel HTML

Save changes — tags load on the live site without rebuilding the website.

## Automatic SEO

Every **Save changes** in the CMS rebuilds:

- `/sitemap.xml` (also served live via `sitemap.php`)
- `/llms.txt` for AI assistants

The React site loads `/content/*.json` on every visit, so homepage copy, services, prices, FAQs and schema update automatically after save + browser refresh.

In **Settings**, use **Rebuild SEO now** to force a sync without editing content.

## Service videos

In **Services**, each service has an optional **YouTube video URL**.  
Paste a full YouTube link (watch / youtu.be / shorts). If set, the service page shows an embedded video section. Leave blank to hide it.

## Hostinger setup

1. Upload the latest site zip into `public_html` (include `admin/` and `content/`)
2. In File Manager, set **`content`** folder permissions to **755** or **775** (must be writable)
3. Visit `/admin/` and log in
4. Change the password in `admin/config.php`

## Notes

- Image fields use image **URLs** (Unsplash or your own hosted images)
- Keep backups of `/content` before big edits
- Do not delete `admin/api.php` or the JSON files in `/content`
