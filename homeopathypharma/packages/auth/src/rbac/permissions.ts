import { PERMISSIONS, type Permission } from "@homeopathypharma/config";

/** Full permission catalog — authoritative list for seeding and admin UI. */
export const PERMISSION_CATALOG = PERMISSIONS;

export type { Permission };

/** Human-readable descriptions for admin permission matrix UI. */
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  [PERMISSIONS.CATALOG_READ]: "View catalog and product drafts",
  [PERMISSIONS.CATALOG_WRITE]: "Create and edit catalog entries",
  [PERMISSIONS.CATALOG_PUBLISH]: "Publish products to the storefront",
  [PERMISSIONS.CATALOG_DELETE]: "Archive or delete catalog entries",
  [PERMISSIONS.DOCTOR_READ]: "View doctor profiles and credentials",
  [PERMISSIONS.DOCTOR_VERIFY]: "Approve or reject doctor verification",
  [PERMISSIONS.DOCTOR_SUSPEND]: "Suspend doctor accounts",
  [PERMISSIONS.DOCTOR_PROFILE_WRITE]: "Edit own doctor profile",
  [PERMISSIONS.CONTENT_READ]: "View editorial content",
  [PERMISSIONS.CONTENT_WRITE]: "Create and edit articles and guides",
  [PERMISSIONS.CONTENT_PUBLISH]: "Publish content to the storefront",
  [PERMISSIONS.CONTENT_REVIEW]: "Medical review of health content",
  [PERMISSIONS.ORDER_READ]: "View customer orders",
  [PERMISSIONS.ORDER_WRITE]: "Modify order status and notes",
  [PERMISSIONS.ORDER_REFUND]: "Issue order refunds",
  [PERMISSIONS.ORDER_CANCEL]: "Cancel orders",
  [PERMISSIONS.PAYOUT_READ]: "View doctor payout records",
  [PERMISSIONS.PAYOUT_APPROVE]: "Approve doctor payouts",
  [PERMISSIONS.PAYOUT_REJECT]: "Reject doctor payout requests",
  [PERMISSIONS.INVOICE_READ]: "View invoices and tax documents",
  [PERMISSIONS.USER_READ]: "View user accounts",
  [PERMISSIONS.USER_WRITE]: "Modify user accounts",
  [PERMISSIONS.USER_IMPERSONATE]: "Impersonate users for support (audited)",
  [PERMISSIONS.SUPPORT_TICKET_MANAGE]: "Manage support tickets",
  [PERMISSIONS.AUDIT_READ]: "Read audit logs",
  [PERMISSIONS.SETTINGS_WRITE]: "Modify platform settings",
  [PERMISSIONS.ADMIN_ACCESS]: "Access admin portal",
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS) as Permission[];
