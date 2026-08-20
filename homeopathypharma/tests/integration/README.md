# Integration tests

Tests that exercise **multiple layers** (API + database + Redis + mocked externals) without a full browser. Recommended runner: **Vitest** with `@nestjs/testing` for API modules.

## Planned layout

```
tests/integration/
├── README.md           # this file
├── setup/
│   ├── global-setup.ts # docker health wait, migrate test DB
│   └── test-env.ts     # DATABASE_URL, REDIS_URL overrides
├── auth/
│   ├── google-verify.spec.ts
│   └── otp-session.spec.ts
├── payments/
│   ├── razorpay-verify.spec.ts
│   └── webhook-signature.spec.ts
├── inventory/
│   └── reservation-concurrency.spec.ts
├── bookings/
│   └── appointment-slot-lock.spec.ts
└── helpers/
    ├── razorpay-mock.ts
    └── shiprocket-mock.ts
```

Implement specs incrementally — directory currently documents scope.

## Environment

Use a dedicated test database (not dev seed data):

```bash
export DATABASE_URL=postgresql://hp:hp_dev_password@localhost:5432/homeopathypharma_test?schema=public
export REDIS_URL=redis://localhost:6379/1
pnpm docker:up
pnpm db:migrate
```

Reset between suites with transactional rollback or `truncate` helper.

## Scenarios (priority)

### Auth

| Test | Assert |
|------|--------|
| Google login with valid mock token | Session created; `User` upserted |
| Google login with wrong `aud` | 401; no session |
| OTP brute force | Locked after `OTP_MAX_ATTEMPTS` |

Use stub verifier in tests; production path must call real `google-auth-library`.

### Payment mocks & webhook signatures

| Test | Assert |
|------|--------|
| Payment verify HMAC | Valid signature → `CAPTURED`; invalid → 400 |
| Razorpay webhook | Valid `X-Razorpay-Signature` idempotent; replay ignored |
| Amount mismatch | Client tampered amount rejected at verify |

Reference: `packages/integrations/src/razorpay.ts`, `services/api/src/modules/webhooks/`.

### Inventory reservation

| Test | Assert |
|------|--------|
| Happy path checkout | `RESERVATION` movement; quantity decremented |
| Payment timeout | `RELEASE` restores stock |
| Concurrent last item | Exactly one order succeeds |

### Booking

| Test | Assert |
|------|--------|
| Double-book same slot | Second request 409 |
| Cancel releases slot | Slot available again |
| Paid booking | Payment + `CONFIRMED` appointment |

## External provider strategy

| Provider | Approach |
|----------|----------|
| Razorpay | Mock HTTP + known HMAC fixtures from docs |
| Shiprocket | Mock AWB create + webhook payloads |
| Google | Inject mock `GoogleIdTokenVerifier` |
| S3 | Local MinIO or moto-compatible mock |
| OpenSearch | Test container or index mock |

Never hit production payment or shipping APIs in CI.

## Running (future)

```bash
pnpm --filter @homeopathypharma/integration test
```

Add package when first spec lands, or run from root with Vitest project config.

## Related

- [../e2e/README.md](../e2e/README.md)
- [../contract/README.md](../contract/README.md)
- [../../docs/SECURITY_THREAT_MODEL.md](../../docs/SECURITY_THREAT_MODEL.md)
