# DisplayAvenue Agency CMS

Edit the live agency site content from the browser.

## URL

https://displayavenue.com/admin/

## Login

Use the admin password configured as a **bcrypt hash** in `config.php` (`admin_password_hash`).

To rotate the password on the server:

```bash
php -r "echo password_hash('YOUR_NEW_PASSWORD', PASSWORD_DEFAULT), PHP_EOL;"
```

Replace `admin_password_hash` with the output. Never commit or publish plaintext passwords.

## What you can edit

| Section | Controls |
|--------|----------|
| Header, Footer & Company | Brand, contact, announcement, nav links, stats, socials |
| Homepage | Hero copy and section titles |
| Services | All service detail pages (add/edit/delete) |
| Industries / Packages / Solutions / AI / Tools | Full catalog pages |
| Case Studies / Portfolio / Resources | Detail pages |
| Testimonials & Extras | Home social proof + footer CTA |
| Tracking & Pixels | GTM, GA, Google Ads, Meta Pixel, Search Console, custom head/body scripts |
| Settings | Site name & notes, **Clear site cache** |
| Tracking & Pixels | GTM, GA, Google Ads, Meta Pixel, Search Console, custom head/body scripts |

## Clear cache

Use the top-bar **Clear cache** button (or Settings → Clear site cache now) after a deploy if desktop visitors still see an unstyled/old layout.

This will:

1. Bump `cacheVersion` in `content/settings.json`
2. Rewrite `/index.html` asset URLs with a fresh `?v=` query
3. Refresh SEO artifacts
4. Best-effort flush PHP opcache

Visitors may still need one hard refresh (`Ctrl/Cmd + Shift + R`) if their browser kept a stale HTML tab open.

## Form leads

Website contact + newsletter forms post to `/lead.php`.
Each submission is:

1. Saved privately under `admin/data/leads.json` (not publicly readable)
2. Emailed to `info@displayavenue.com` (configurable via `notify_email` in `config.php`)

Open **Form Leads (Inbox)** in the CMS sidebar to view, mark, and delete submissions.

## Permissions

`content/` must be writable by PHP on Hostinger (`chmod 755` or `775` on the folder).

## Security notes

- `config.php` and `seo-sync.php` are blocked from direct HTTP access
- Admin API is same-origin only, with secure HttpOnly cookies and login rate limiting
- Keep the CMS password private and rotate it if it may have been shared
