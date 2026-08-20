# @homeopathypharma/api

NestJS API for HomeopathyPharma.com — the **backend source of truth** for:

| Domain | Backend owns |
|--------|----------------|
| **Auth & sessions** | Login, registration, session lifecycle, password reset |
| **Roles & permissions** | Role assignment, permission checks, admin access control |
| **Prices & inventory** | Product pricing, stock levels, catalog mutations |
| **Payments** | Razorpay order creation, capture, refunds, webhook reconciliation |
| **Booking** | Consultation scheduling, availability, cancellations |
| **Publishing** | CMS pages, blog, SEO metadata, sitemap generation triggers |

Frontends (web, doctor portal, admin) are **consumers** of this API. Do not duplicate business rules client-side.

## Architecture

```
services/api/
  src/
    main.ts                 # Bootstrap, /v1 prefix, global pipes
    app.module.ts           # Root module, global guards & middleware
    common/                 # Cross-cutting concerns
    modules/                # Domain modules (thin controllers → services)
    jobs/                   # BullMQ enqueue stubs
    observability/          # Structured JSON logging
```

### Cross-cutting

- **Validation**: Global `ValidationPipe` (class-validator) + optional Zod adapter (`ZodValidationPipe`)
- **Correlation ID**: `CorrelationIdMiddleware` sets `x-correlation-id` / `x-request-id`
- **Auth**: Session cookie (`session_id`) backed by `SessionStore` interface (Redis stub)
- **Guards**: `AuthGuard`, `RolesGuard`, `PermissionsGuard` (global)
- **Idempotency**: `@Idempotent()` + `Idempotency-Key` header on checkout, payment, shipment routes
- **Rate limiting**: In-memory stub middleware (replace with Redis sliding window)
- **Webhooks**: Razorpay & Shiprocket signature verification hooks

### API prefix

All routes are served under **`/v1`**, e.g. `GET /v1/health`, `POST /v1/auth/login`.

## Development

```bash
pnpm install
pnpm --filter @homeopathypharma/api dev
```

Environment variables (see repo `.env.example`):

- `API_PORT` — default `3001`
- `RAZORPAY_WEBHOOK_SECRET` — webhook HMAC secret
- `SHIPROCKET_WEBHOOK_SECRET` — webhook HMAC secret

## Domain modules

| Module | Route prefix | Notes |
|--------|--------------|-------|
| auth | `/v1/auth` | Public login/register |
| users | `/v1/users` | Admin user management |
| customers | `/v1/customers` | Customer profile & orders |
| doctors | `/v1/doctors` | Doctor portal |
| catalog | `/v1/catalog` | Products, categories, brands |
| search | `/v1/search` | Full-text search |
| cart | `/v1/cart` | Shopping cart |
| checkout | `/v1/checkout` | Idempotent checkout sessions |
| payments | `/v1/payments` | Idempotent payment ops |
| shipments | `/v1/shipments` | Idempotent shipping |
| consultations | `/v1/consultations` | Booking |
| referrals | `/v1/referrals` | Referral program |
| reviews | `/v1/reviews` | Product reviews |
| content | `/v1/content` | CMS |
| seo | `/v1/seo` | Sitemap, robots, metadata |
| notifications | `/v1/notifications` | In-app notifications |
| support | `/v1/support` | Support tickets |
| audit | `/v1/audit` | Audit log |
| admin | `/v1/admin` | Admin dashboard |
| webhooks | `/v1/webhooks` | External provider callbacks |
| health | `/v1/health` | Liveness & readiness |

Handlers are **stubs** (`NotImplementedException`) — architecture and route contracts are in place for incremental implementation.
