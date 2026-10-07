# @homeopathypharma/auth

Session and RBAC primitives for HomeopathyPharma.com.

## Security policy

**Never trust client role flags.** Roles and permissions are loaded from the database on the server and attached to the session after authentication. Client-side checks are UX hints only; every protected API route must re-verify via `requireRole` / `hasPermission`.

Google ID token verification is an interface stub — the NestJS API must verify tokens with `google-auth-library` using server-held credentials.

## Usage

```ts
import { hasPermission, requireRole, ROLES } from "@homeopathypharma/auth";
```
