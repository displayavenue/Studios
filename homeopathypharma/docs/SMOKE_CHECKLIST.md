# Launch smoke checklist

Run after a Hostinger (or staging) deploy. Mark each item only when verified.

## Public site

- [ ] `/` shows **HOMEOPATHY PHARMA**, tagline, phone **+91 8169 122333**, Mira Road address
- [ ] No invented products, doctors, founders, testimonials, or business emails
- [ ] `/shop` loads (empty state OK if catalogue not filled)
- [ ] `/doctors` loads without unpublished / unverified practitioners
- [ ] `/health-library` shows only **published** articles
- [ ] Draft policy URL returns **404** until published in admin
- [ ] `/contact` submits and shows a message that does **not** claim email was sent unless a mail provider is configured
- [ ] `/robots.txt` disallows `/admin` and references `/sitemap.xml`
- [ ] `/sitemap.xml` is valid XML and omits `/admin`
- [ ] `/up` health endpoint returns 200

## Security

- [ ] `APP_DEBUG=false` on production
- [ ] `https://` forced; HTTP redirects to HTTPS
- [ ] Response includes `X-Frame-Options`, `X-Content-Type-Options`, CSP headers
- [ ] Guest visiting `/admin` redirects to `/admin/login`
- [ ] Non-admin logged-in user gets **403** on `/admin`
- [ ] Admin login rate-limited (repeated wrong passwords eventually blocked)
- [ ] Payment webhook with bad signature returns **400**
- [ ] Test payment confirm (`/checkout/confirm-test`) returns **403** in production

## Admin

- [ ] Login with production `ADMIN_EMAIL` / password works
- [ ] Sidebar: Products, Orders, Doctors, Health Library, Policies, Reports, Audit log, Settings
- [ ] Create a draft article — confirm it is **not** on `/health-library`
- [ ] Publish the article — confirm it appears publicly
- [ ] Policy pages remain draft until legal review

## Commerce (when catalogue + Razorpay ready)

- [ ] Add to cart → checkout uses **server** prices
- [ ] Unpaid order stays `payment_status=pending`
- [ ] Only verified Razorpay webhook/signature marks paid
- [ ] Admin cannot flip payment to paid from the order form

## Doctors (when practitioners approved)

- [ ] Unverified doctors hidden from directory
- [ ] Double-booking the same slot is rejected

## Ops

- [ ] `php artisan hp:preflight --strict` exits 0 on the server
- [ ] `storage/logs` writable; no world-readable `.env`
- [ ] Backup of DB + files taken and stored off-server
