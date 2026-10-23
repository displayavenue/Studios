# @homeopathypharma/validation

Zod schemas defining request/response contracts shared between the NestJS API, web storefront, doctor portal, and admin apps.

## Assumptions

- Schemas validate shape only — no business rules (inventory, pricing, eligibility) are encoded here.
- Phone numbers use E.164 where provided; OTP flows assume server-side rate limiting.
- Pagination defaults match API conventions (`page` 1-based, `limit` max 100).
- Sort fields are allowlisted per resource to prevent SQL injection via sort params.

## Usage

```ts
import { googleIdTokenLoginSchema, productFilterQuerySchema } from "@homeopathypharma/validation";
```
