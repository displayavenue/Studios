# Unit tests

Fast, isolated tests for pure logic and small modules across the monorepo. Most packages already use **Vitest**.

## Where tests live

| Location | Examples |
|----------|----------|
| `packages/auth/src/**/*.test.ts` | RBAC helpers, permission matrices |
| `packages/seo/src/**/*.test.ts` | Sitemap URL builders, JSON-LD shape, robots rules |
| `packages/integrations/src/**/*.test.ts` | State machine transitions, signature helpers |
| `packages/validation/src/**/*.test.ts` | Zod schema edge cases |
| `services/api/src/**/*.test.ts` | Service unit tests with mocked repositories |

Co-locate tests as `*.test.ts` next to source files (existing convention in `@homeopathypharma/seo` and `@homeopathypharma/auth`).

## Running

```bash
# All packages via Turborepo
pnpm test

# Single package
pnpm --filter @homeopathypharma/seo test
pnpm --filter @homeopathypharma/auth test
```

## Guidelines

1. **No network** — mock external IO (Razorpay, Shiprocket, S3, OpenSearch)
2. **Deterministic** — freeze time with Vitest fake timers for OTP/expiry tests
3. **State machines** — assert invalid transitions throw `InvalidStateTransitionError`
4. **RBAC** — table-driven tests for each permission × route combination
5. **SEO** — assert JSON-LD fields match fixture page content (no extra rating fields)

## Coverage targets (guidance)

| Area | Target |
|------|--------|
| State machines & validation | High (>90%) |
| RBAC | High |
| UI components | Medium — focus on accessibility behaviors |
| Generated Prisma code | Skip |

## Related

- [../integration/README.md](../integration/README.md)
- [../contract/README.md](../contract/README.md)
