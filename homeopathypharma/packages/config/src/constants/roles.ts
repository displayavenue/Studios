/** Canonical role identifiers — server-assigned only; never trust client flags. */
export const ROLES = {
  CUSTOMER: "CUSTOMER",
  DOCTOR: "DOCTOR",
  ADMIN: "ADMIN",
  CONTENT_EDITOR: "CONTENT_EDITOR",
  MEDICAL_REVIEWER: "MEDICAL_REVIEWER",
  SUPPORT: "SUPPORT",
  FINANCE: "FINANCE",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_VALUES = Object.values(ROLES) as [Role, ...Role[]];
