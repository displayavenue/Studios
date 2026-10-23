# Homeopathy Pharma — Master Build Plan

> Status: **Phases 1–6 complete in repo** (Laravel rebuild).  
> Hostinger: shared CloudLinux (PHP 8.3 + MySQL; no Node runtime).  
> Production files will **not** be overwritten until you explicitly approve a deploy.

## What exists today

| Area | Finding |
|------|---------|
| Location | `homeopathypharma/` Laravel app inside DisplayAvenue Studios repo |
| Runtime | Laravel 13 · PHP 8.3 · Blade · SQLite local / MySQL Hostinger |
| Storefront | Public Blade routes: shop, doctors, health library, contact, cart/checkout |
| Admin | `/admin` — catalogue, orders, doctors, articles, policies, reports, audit |
| Payments | Razorpay adapter + test gateway (test blocked in production) |
| Shipping / notify / video | Manual/Shiprocket stub, LogNotifier, NullVideoMeetingProvider |
| Live deploy | Documented in `docs/HOSTINGER.md` — **not executed** without approval |

## Hosting check (SSH probe — 2026-10-22)

| Check | Result |
|-------|--------|
| Host | `in-mum-web1188.main-hosting.eu` (CloudLinux shared web hosting) |
| Site path | `domains/homeopathypharma.com/public_html` |
| PHP | **8.3** CLI + Composer |
| MySQL | `pdo_mysql` — credentials from hPanel |
| Node in PATH | Not required for this app |

## Phased plan

| Phase | Scope | Status |
|-------|--------|--------|
| **1** | Foundation | Done |
| **2** | Catalogue + admin | Done |
| **3** | Auth, cart, checkout, payments | Done |
| **4** | Doctors + appointments | Done |
| **5** | Health library, policies, shipping/notifications | Done |
| **6** | Tests, security review, Hostinger docs, smoke | Done in repo |

## Risks checklist

- [x] Stack matches Hostinger (Laravel + MySQL)
- [ ] Overwriting live `public_html` without backup approval — **still blocked until you say deploy**
- [x] Demo/default admin credentials blocked from production seed
- [x] No invented doctors/founders/products/emails in seeders
- [x] Payments/email/video do not claim live delivery when unconfigured
- [x] No Postgres/Redis requirement for core path

## Defaults already confirmed

- Brand: HOMEOPATHY PHARMA  
- Tagline: Natural wellness. Expert guidance.  
- Phone: **+91 8169 122333**  
- Address: No. 44, D Wing, Shree Sharanam CHS, Kanakia, Near Fire Station, Unique Garden, Mira Road East, Mumbai – 401107, Maharashtra, India.  
- Currency: INR · Locale: en-IN  
- Do not deploy/overwrite production without explicit approval  

## Next action

When you are ready for Hostinger: create hPanel MySQL, say **deploy**, and confirm backup approval. Until then the live site is untouched.
