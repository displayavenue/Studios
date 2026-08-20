import type { Permission, Role } from "@homeopathypharma/config";

export class AuthorizationError extends Error {
  readonly code = "FORBIDDEN" as const;

  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export interface AuthorizationContext {
  /** Primary role from server session — never from client headers or body. */
  role: Role;
  /** Effective permissions resolved server-side (role defaults + grants − revocations). */
  permissions: ReadonlySet<string>;
}

/**
 * Check whether the session has a specific permission.
 * Client-side usage is for UI gating only — API must always re-check.
 */
export function hasPermission(
  ctx: AuthorizationContext,
  permission: Permission | string,
): boolean {
  return ctx.permissions.has(permission);
}

/**
 * Check whether the session has any of the given permissions.
 */
export function hasAnyPermission(
  ctx: AuthorizationContext,
  permissions: readonly (Permission | string)[],
): boolean {
  return permissions.some((p) => hasPermission(ctx, p));
}

/**
 * Check whether the session has all of the given permissions.
 */
export function hasAllPermissions(
  ctx: AuthorizationContext,
  permissions: readonly (Permission | string)[],
): boolean {
  return permissions.every((p) => hasPermission(ctx, p));
}

/**
 * Assert the session has a specific role.
 * Throws AuthorizationError if the role does not match.
 */
export function requireRole(ctx: AuthorizationContext, ...allowed: Role[]): void {
  if (!allowed.includes(ctx.role)) {
    throw new AuthorizationError(
      `Required role: ${allowed.join(" or ")}; got ${ctx.role}`,
    );
  }
}

/**
 * Assert the session has a specific permission.
 * Throws AuthorizationError if permission is missing.
 */
export function requirePermission(
  ctx: AuthorizationContext,
  permission: Permission | string,
): void {
  if (!hasPermission(ctx, permission)) {
    throw new AuthorizationError(`Missing permission: ${permission}`);
  }
}

/**
 * Build an AuthorizationContext from server-resolved session data.
 * Do NOT pass client-supplied role arrays into this helper.
 */
export function createAuthContext(
  role: Role,
  permissions: Iterable<string>,
): AuthorizationContext {
  return {
    role,
    permissions: new Set(permissions),
  };
}
