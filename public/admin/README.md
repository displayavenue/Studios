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
- All services (text + image URLs + per-service reviews/tips)
- Packages & prices
- Portfolio projects & gallery images
- FAQs, **full blog articles (HTML body)**, testimonials, team, industries, locations
- Process steps & “Why choose us”
- Reviews, Instagram, case studies, careers, client galleries, availability

## Blog editor

In **FAQs, Blog, Team…** → Blog posts you can edit:

- Slug, title, category, date, image, excerpt
- **Body content (HTML)** — full article shown on `/blog/{slug}`
- Status: `published` or `draft` (drafts stay off the public site + sitemap)
- SEO title, SEO description, focus keyword

## Daily auto-blog (SEO)

The CMS publishes one unique wedding/celebration SEO article every day from a 180+ topic bank (cities × services × intents). No external AI API.

1. Open **Settings** → **Daily auto-blog (SEO)**
2. Keep **Auto-publish enabled**
3. In Hostinger → Cron Jobs, add (7:00 AM IST):

```
0 7 * * * curl -fsS "https://displayavenuestudios.com/admin/auto-blog.php?key=da-blog-seo-2026-mumbai"
```

4. Change the key in `/admin/config.php` → `blog_cron_secret` (and update the cron URL)

You can also click **Publish one post now** in Settings to test. Each publish updates `content.json`, `blog-automation.json`, `sitemap.xml` and `llms.txt`.

## Automatic SEO

Every **Save changes** in the CMS rebuilds:

- `/sitemap.xml` (also served live via `sitemap.php`)
- `/llms.txt` for AI assistants

The React site loads `/content/*.json` on every visit, so homepage copy, services, prices, FAQs, blogs and schema update automatically after save + browser refresh.

In **Settings**, use **Rebuild SEO now** to force a sync without editing content.

## Service videos

In **Services**, each service has an optional **YouTube video URL**.  
Paste a full YouTube link (watch / youtu.be / shorts). If set, the service page shows an embedded video section. Leave blank to hide it.

## Hostinger setup

1. Upload the latest site zip into `public_html` (include `admin/` and `content/`)
2. In File Manager, set **`content`** folder permissions to **755** or **775** (must be writable)
3. Visit `/admin/` and log in
4. Change the password in `admin/config.php`
5. Add the daily auto-blog cron (see above)

## Notes

- Image fields use image **URLs** (hosted under `/images/` or your CDN)
- Keep backups of `/content` before big edits
- Do not delete `admin/api.php`, `admin/auto-blog.php`, or the JSON files in `/content`
