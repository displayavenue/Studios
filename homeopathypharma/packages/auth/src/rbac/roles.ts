import { ROLES as CONFIG_ROLES, type Role } from "@homeopathypharma/config";

/**
 * Role constants — re-exported from config for convenience.
 * NEVER assign roles based on client-supplied JWT claims without server verification.
 */
export const ROLES = CONFIG_ROLES;
export type { Role };

/** Default permission sets per role — merged with user-specific grants in the database. */
export const ROLE_PERMISSION_DEFAULTS: Record<Role, readonly string[]> = {
  [ROLES.CUSTOMER]: [],
  [ROLES.DOCTOR]: [
    "doctor.profile.write",
    "doctor.read",
    "order.read",
  ],
  [ROLES.ADMIN]: ["admin.access", "audit.read", "settings.write"],
  [ROLES.SUPER_ADMIN]: [
    "admin.access",
    "audit.read",
    "settings.write",
    "catalog.read",
    "catalog.write",
    "catalog.publish",
    "catalog.delete",
    "doctor.read",
    "doctor.verify",
    "doctor.suspend",
    "content.read",
    "content.write",
    "content.publish",
    "content.review",
    "order.read",
    "order.write",
    "order.refund",
    "order.cancel",
    "payout.read",
    "payout.approve",
    "payout.reject",
    "invoice.read",
    "user.read",
    "user.write",
    "user.impersonate",
    "support.ticket.manage",
  ],
  [ROLES.CONTENT_EDITOR]: [
    "content.read",
    "content.write",
    "content.publish",
  ],
  [ROLES.MEDICAL_REVIEWER]: [
    "content.read",
    "content.review",
    "doctor.read",
    "doctor.verify",
  ],
  [ROLES.SUPPORT]: [
    "user.read",
    "order.read",
    "order.write",
    "support.ticket.manage",
  ],
  [ROLES.FINANCE]: [
    "order.read",
    "order.refund",
    "payout.read",
    "payout.approve",
    "payout.reject",
    "invoice.read",
  ],
};
