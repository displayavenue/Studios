# @homeopathypharma/worker

BullMQ worker process for async jobs across commerce and healthcare domains.

## Queues

| Queue | Purpose |
|-------|---------|
| `payments` | Payment capture, refund reconciliation |
| `orders` | Order fulfillment pipeline |
| `inventory` | Stock reservation & sync |
| `shipments` | Shiprocket label & tracking updates |
| `consultations` | Booking reminders, no-show handling |
| `notifications` | Email, SMS, push delivery |
| `search-index` | Product/content index rebuild |
| `sitemaps` | Sitemap generation |
| `feeds` | Product feed exports |
| `audits` | Async audit log writes |
| `referrals` | Referral reward processing |

## Job processing

- **Retries**: 3 attempts with exponential backoff (1s base)
- **Idempotency**: Processors check idempotency key before handling (Redis in production)
- **Dead-letter**: Failed jobs after max retries remain in BullMQ failed set for manual replay

## Development

```bash
pnpm install
pnpm --filter @homeopathypharma/worker dev
```

Requires Redis (`REDIS_URL`, default `redis://localhost:6379`).
