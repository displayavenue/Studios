# @homeopathypharma/config

Central configuration for HomeopathyPharma.com: validated environment variables, shared constants, and app URL helpers.

## Assumptions

- `parseEnv()` reads `process.env` and throws a `ZodError` on invalid or missing required values in production.
- In `APP_ENV=local`, optional third-party credentials may be empty strings; feature flags default from `.env.example`.
- Role and permission string literals are the canonical catalog consumed by `@homeopathypharma/auth`.
- URLs are normalized (no trailing slash) for consistent canonical generation in `@homeopathypharma/seo`.

## Usage

```ts
import { parseEnv, appUrls, ROLES, PERMISSIONS } from "@homeopathypharma/config";

const env = parseEnv();
const urls = appUrls(env);
```
