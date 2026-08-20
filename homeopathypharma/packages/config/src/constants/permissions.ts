/**
 * Permission catalog — evaluated server-side against session claims from the database.
 * Format: `<domain>.<action>` with optional sub-actions.
 */
export const PERMISSIONS = {
  // Catalog & products
  CATALOG_READ: "catalog.read",
  CATALOG_WRITE: "catalog.write",
  CATALOG_PUBLISH: "catalog.publish",
  CATALOG_DELETE: "catalog.delete",

  // Doctors & verification
  DOCTOR_READ: "doctor.read",
  DOCTOR_VERIFY: "doctor.verify",
  DOCTOR_SUSPEND: "doctor.suspend",
  DOCTOR_PROFILE_WRITE: "doctor.profile.write",

  // Content & editorial
  CONTENT_READ: "content.read",
  CONTENT_WRITE: "content.write",
  CONTENT_PUBLISH: "content.publish",
  CONTENT_REVIEW: "content.review",

  // Orders & commerce
  ORDER_READ: "order.read",
  ORDER_WRITE: "order.write",
  ORDER_REFUND: "order.refund",
  ORDER_CANCEL: "order.cancel",

  // Finance & payouts
  PAYOUT_READ: "payout.read",
  PAYOUT_APPROVE: "payout.approve",
  PAYOUT_REJECT: "payout.reject",
  INVOICE_READ: "invoice.read",

  // Users & support
  USER_READ: "user.read",
  USER_WRITE: "user.write",
  USER_IMPERSONATE: "user.impersonate",
  SUPPORT_TICKET_MANAGE: "support.ticket.manage",

  // Audit & admin
  AUDIT_READ: "audit.read",
  SETTINGS_WRITE: "settings.write",
  ADMIN_ACCESS: "admin.access",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_VALUES = Object.values(PERMISSIONS) as [Permission, ...Permission[]];
