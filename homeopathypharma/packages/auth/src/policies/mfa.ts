import { ROLES, type Role } from "../rbac/roles.js";

/**
 * Roles that MUST enroll in MFA (TOTP/WebAuthn) before accessing privileged surfaces.
 * Doctors and all admin-adjacent roles per platform security spec.
 */
const MFA_REQUIRED_ROLES: ReadonlySet<Role> = new Set([
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.DOCTOR,
  ROLES.FINANCE,
  ROLES.SUPPORT,
  ROLES.CONTENT_EDITOR,
  ROLES.MEDICAL_REVIEWER,
]);

/**
 * Returns true when any assigned role requires mandatory two-factor authentication.
 * Pass server-resolved roles from the database — never trust client-supplied role flags.
 */
export function requiresMfa(roles: readonly Role[] | readonly string[]): boolean {
  return roles.some((role) => MFA_REQUIRED_ROLES.has(role as Role));
}
