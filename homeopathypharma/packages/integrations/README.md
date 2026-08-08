# @homeopathypharma/integrations

**Server-side only.** These interfaces and stubs must never be imported in browser bundles — credentials and webhook secrets live on the API/worker services.

## Providers

| Provider | Status |
|----------|--------|
| Razorpay | Interface + stub — wire with official SDK in `@homeopathypharma/api` |
| Shiprocket | Interface + stub |
| Google (ID token, Merchant Center) | Interface + stub |
| S3-compatible storage | Interface + stub |
| Email / SMS / WhatsApp | Interface + stub |

Payment and shipment state machines define allowed transitions for order fulfillment workflows.
