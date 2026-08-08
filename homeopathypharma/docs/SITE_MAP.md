# Site map

Full URL inventory for HomeopathyPharma.com across public storefront, authenticated surfaces, doctor portal, and admin console. Routes marked **Private** must ship `noindex` and never appear in sitemaps.

## Public — storefront (`apps/web`, port 3000)

| Path | Description | Index |
|------|-------------|-------|
| `/` | Home — featured products, health entry points | Yes |
| `/search` | Site search (query param) | No |
| `/products/{slug}` | Product detail (PDP) — variant/SKU from API | Yes (published) |
| `/categories/{slug}` | Category listing | Yes (published) |
| `/cart` | Shopping cart | No |
| `/checkout` | Checkout flow | No |
| `/account` | Account hub (redirects to login if anonymous) | No |
| `/account/orders` | Order history | No |
| `/account/orders/{id}` | Order detail | No |
| `/account/addresses` | Saved addresses | No |
| `/account/wallet` | Wallet balance & ledger | No |
| `/account/referrals` | Customer referral status | No |
| `/account/notifications` | Notification preferences | No |
| `/account/settings` | Profile & security settings | No |

## Public — doctors & consultations

| Path | Description | Index |
|------|-------------|-------|
| `/doctors` | Doctor directory (verified only) | Yes |
| `/doctors/{slug}` | Doctor public profile | Yes (approved) |
| `/consult` | Consultation landing | Yes |
| `/consult/book/{doctorSlug}` | Book appointment (auth required mid-flow) | No |

## Public — health knowledge graph

| Path | Description | Index |
|------|-------------|-------|
| `/health` | Health hub | Yes |
| `/health/conditions/{slug}` | Condition guide (medically reviewed) | Yes (published) |
| `/health/body-systems/{slug}` | Body system overview | Yes (published) |
| `/health/organs/{slug}` | Organ-specific content | Yes (published) |
| `/articles/{slug}` | Editorial / knowledge articles | Yes (published) |

## Public — pets

| Path | Description | Index |
|------|-------------|-------|
| `/pets` | Pet health hub | Yes |
| `/pets/{species}` | Species hub (dogs, cats, …) | Yes (published) |
| `/pets/conditions/{slug}` | Pet condition guides | Yes (published) |

## Public — legal & trust

| Path | Description | Index |
|------|-------------|-------|
| `/legal/privacy` | Privacy policy | Yes (low priority) |
| `/legal/terms` | Terms of service | Yes (low priority) |
| `/legal/disclaimer` | Medical / product disclaimer | Yes (low priority) |
| `/legal/shipping-returns` | Shipping & returns policy | Yes (low priority) |
| `/legal/cookies` | Cookie policy | Yes (low priority) |
| `/about` | About the platform | Yes |
| `/contact` | Contact & support entry | Yes |
| `/trust` | Trust & safety overview | Yes |

## Auth flows (API-backed, web modals or dedicated pages)

| Path / API | Description | Index |
|------------|-------------|-------|
| `/login` | Login hub (Google + OTP) | No |
| `POST /v1/auth/google` | Backend Google ID token verify | N/A |
| `POST /v1/auth/otp/request` | Request OTP | N/A |
| `POST /v1/auth/otp/verify` | Verify OTP + session | N/A |
| `POST /v1/auth/logout` | End session | N/A |
| `GET /v1/auth/sessions` | List active sessions | N/A |
| `DELETE /v1/auth/sessions/{id}` | Revoke session | N/A |

## Doctor portal (`apps/doctor`, port 3001) — **Private**

| Path | Description |
|------|-------------|
| `/login` | Doctor login (MFA required after first login) |
| `/dashboard` | Overview — appointments, earnings summary |
| `/availability` | Schedule & slot management |
| `/consultations` | Upcoming & past consultations |
| `/patients` | Patient list (scoped to own practice) |
| `/documents` | Credential uploads (private storage) |
| `/reviews` | Doctor review responses |
| `/referrals` | Referral codes & performance |
| `/earnings` | Payout ledger & statements |

## Admin console (`apps/admin`, port 3002) — **Private**

| Path | Description |
|------|-------------|
| `/login` | Admin login (MFA mandatory) |
| `/dashboard` | Operations overview |
| `/catalog` | Product & variant management |
| `/inventory` | Batches, reservations, movements |
| `/orders` | Order fulfillment |
| `/shipments` | Shiprocket labels & tracking |
| `/coupons` | Coupon & campaign management |
| `/users` | User & role administration |
| `/seo` | Sitemap, metadata, redirects |
| `/audit-logs` | Immutable audit trail |
| `/queues/doctor-verification` | Doctor credential review |
| `/queues/product-publish` | Catalog publish approval |
| `/queues/content-review` | Medical / editorial review |
| `/queues/review-moderation` | Product & doctor review moderation |
| `/queues/refunds` | Refund approval queue |
| `/queues/payouts` | Doctor payout approval |

## API & system

| Path | Description |
|------|-------------|
| `GET /v1/health` | Liveness / readiness |
| `POST /v1/webhooks/razorpay` | Payment webhooks (signature required) |
| `POST /v1/webhooks/shiprocket` | Shipment webhooks (signature required) |
| `/sitemap.xml` | Sitemap index |
| `/sitemap-{segment}-{n}.xml` | Segmented sitemaps |
| `/robots.txt` | Crawl rules |

## Related documents

- [SEO.md](./SEO.md) — indexing rules and sitemap segmentation
- [ADMIN_ARCHITECTURE.md](./ADMIN_ARCHITECTURE.md) — admin domain boundaries
- [SECURITY_THREAT_MODEL.md](./SECURITY_THREAT_MODEL.md) — private route protection
