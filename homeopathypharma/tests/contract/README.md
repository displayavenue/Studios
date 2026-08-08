# Contract tests

API contract tests ensure **HTTP response shapes and status codes** remain stable for web, doctor, and admin clients. They catch breaking changes before deploy.

## Goals

1. Document the public `/v1` API surface
2. Fail CI when response schema or status code changes unintentionally
3. Complement unit tests — validate full request/response cycle against running API or Prism mock

## Recommended tooling

| Tool | Use |
|------|-----|
| **OpenAPI 3.1 spec** | Generated from NestJS decorators (future `@nestjs/swagger` export) |
| **Schemathesis** or **Dredd** | Property-based / example-driven contract runs |
| **Zod** | Mirror schemas in `@homeopathypharma/validation` — single source with OpenAPI |

## Planned layout

```
tests/contract/
├── README.md
├── openapi/
│   └── homeopathypharma-v1.yaml    # exported spec (generated)
├── snapshots/
│   └── checkout-create.json        # golden response fixtures
└── scripts/
    └── verify-contract.ts          # diff spec vs live /v1/openapi.json
```

## Modules to cover first

| Module | Endpoints | Priority |
|--------|-----------|----------|
| `auth` | `POST /auth/google`, `POST /auth/otp/*` | P0 |
| `catalog` | `GET /catalog/products`, `GET /catalog/products/:slug` | P0 |
| `cart` | `GET/POST /cart` | P0 |
| `checkout` | `POST /checkout` | P0 |
| `payments` | `POST /payments/verify` | P0 |
| `orders` | `GET /customers/orders/:id` | P1 |
| `doctors` | `GET /doctors/:slug` (public) | P1 |
| `consultations` | `POST /appointments` | P1 |
| `admin` | Mutations require auth fixtures | P2 |

## Contract rules

1. **Error envelope** — consistent `{ code, message, correlationId }` on 4xx/5xx
2. **Pagination** — `{ items, page, pageSize, total }` on list endpoints
3. **Money** — amounts as integer paise + `currency: "INR"` fields
4. **Timestamps** — ISO 8601 UTC strings
5. **Idempotency** — replay of same `Idempotency-Key` returns same status + body

## Consumer-driven checks

Frontends should not rely on undeclared fields. Contract tests fail if:

- Required field removed or renamed
- Enum value removed without deprecation period
- Success status code changed (e.g. 200 → 201)

## CI integration (future)

```yaml
- name: Contract tests
  run: pnpm --filter @homeopathypharma/contract test
  env:
    API_URL: http://localhost:4000
```

Start API with test DB before contract step, or use recorded mocks for PR speed.

## Related

- [../integration/README.md](../integration/README.md)
- [../../services/api/README.md](../../services/api/README.md)
- [../../packages/validation/README.md](../../packages/validation/README.md)
