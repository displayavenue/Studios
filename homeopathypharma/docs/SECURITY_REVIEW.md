# Security review (Phase 6)

Scoped to the Laravel rebuild under `homeopathypharma/`. Not a formal penetration test.

## Controls in place

| Area | Control |
|------|---------|
| Auth | Session auth; admin gated by `is_admin` + `EnsureAdmin` middleware |
| CSRF | Enabled on all web POSTs except signed payment webhooks |
| Payments | Server-side totals; admin cannot mark paid; webhook signature required; test gateway blocked in `production` |
| Content | Articles/policies require `published` for public routes |
| Doctors | Public list requires `verified` + `published` |
| Rate limits | Admin login 5/min; account login 10/min; register 5/min; contact 10/min; checkout/book throttled |
| Headers | `SecurityHeaders` middleware (frame, nosniff, referrer, CSP, HSTS when HTTPS/production) |
| Secrets | `.env` / hPanel only; default admin seed refused in production |
| Proxies | Trust proxies enabled for Hostinger TLS termination |
| Preflight | `php artisan hp:preflight` checks debug, DB, writable storage, default creds |

## Residual risks / follow-ups

- CSP allows `'unsafe-inline'` scripts/styles for Blade simplicity — tighten when adding a build pipeline.
- Mail/SMS/Shiprocket/video are adapters that **log or stub** until configured — UI must not claim delivery.
- Shared hosting file permissions and hPanel users are outside app code — verify on deploy.
- No WAF / bot protection beyond Laravel throttle — consider Hostinger/Cloudflare later.
- Media uploads rely on admin auth; keep MIME validation reviewed as catalogue grows.

## Explicit non-goals for this phase

- No production overwrite
- No invented business contact channels
- No enabling live Razorpay without credentials + approval
