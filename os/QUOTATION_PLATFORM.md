# DisplayAvenue Quotation + Payment + Subscription Platform

## Architecture decision

Built on **DisplayAvenue OS** (`os/`) — Next.js 15 + Prisma + PostgreSQL (Neon) + Razorpay — hosted at `os.displayavenue.com`.

**Not** built on the Hostinger agency JSON CMS (`agency/`), which remains the marketing site.

## Why

- Agency stack = Vite SPA + PHP JSON files (no durable money ledger / webhooks)
- OS already has auth/RBAC, Razorpay patterns, PDFKit, audit logs, portal mounts
- Live agency deploy preserves `/os` and must not be broken

## Routes

### Staff (`/app`)
- `/app/quotations` — dashboard + list
- `/app/quotations/create` — wizard
- `/app/quotations/[id]` — detail / send / WhatsApp
- `/app/quote-clients`, `/app/quote-services`, `/app/quote-settings`

### Client
- `/q/[quotationNumber]/[secureToken]` — secure public quotation (noindex)
- `/payment/success`, `/payment/failed`

### API
- `/api/quotations`, `/api/quotations/[id]`, `/api/quotations/[id]/send`
- `/api/quotations/public/.../accept|pay`
- `/api/quotations/payments/verify`
- `/api/payments/webhook` (QuotePayment + existing Payment)
- `/api/quote-clients`, `/api/quote-services`, `/api/company-profile`, `/api/quotations/dashboard`

## Company seed

- Legal: Mediashouter
- Brand: DisplayAvenue
- GSTIN: 27ALJPY9454C1ZJ
- Phone: 9222122333
- Address/email left blank for settings configuration
- Default advance 60%, GST 18%, validity 15 days

## Money

Paise integers + CGST/SGST vs IGST by company/client state. Server recalculates Razorpay order amounts (never trusts frontend).

## Demo

Seed creates `DA-2026-00001` for Demo Manufacturing Pvt Ltd with 3 services.
