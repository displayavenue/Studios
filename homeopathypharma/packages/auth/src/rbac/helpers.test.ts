import { describe, expect, it } from "vitest";
import { ROLES } from "./roles.js";
import {
  createAuthContext,
  hasPermission,
  requirePermission,
  requireRole,
  AuthorizationError,
} from "./helpers.js";
import { PERMISSION_CATALOG as PERMISSIONS } from "./permissions.js";

describe("RBAC helpers", () => {
  const adminCtx = createAuthContext(ROLES.ADMIN, [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.AUDIT_READ,
  ]);

  it("hasPermission returns true for granted permission", () => {
    expect(hasPermission(adminCtx, PERMISSIONS.AUDIT_READ)).toBe(true);
  });

  it("hasPermission returns false for missing permission", () => {
    expect(hasPermission(adminCtx, PERMISSIONS.ORDER_REFUND)).toBe(false);
  });

  it("requireRole passes for matching role", () => {
    expect(() => requireRole(adminCtx, ROLES.ADMIN)).not.toThrow();
  });

  it("requireRole throws for mismatched role", () => {
    const customerCtx = createAuthContext(ROLES.CUSTOMER, []);
    expect(() => requireRole(customerCtx, ROLES.ADMIN)).toThrow(AuthorizationError);
  });

  it("requirePermission throws when missing", () => {
    const customerCtx = createAuthContext(ROLES.CUSTOMER, []);
    expect(() => requirePermission(customerCtx, PERMISSIONS.ORDER_REFUND)).toThrow(
      AuthorizationError,
    );
  });
});
