import { GlobalRole } from "@prisma/client";

/** Permission catalog for DisplayAvenue OS */
export const PERMISSIONS = [
  "org:read",
  "org:write",
  "lead:read",
  "lead:write",
  "deal:read",
  "deal:write",
  "campaign:read",
  "campaign:write",
  "campaign:launch",
  "creative:read",
  "creative:write",
  "approval:decide",
  "finance:read",
  "finance:write",
  "report:read",
  "report:write",
  "ai:use",
  "integration:meta",
  "admin:users",
  "admin:settings",
  "ceo:dashboard",
  "portal:read",
  "portal:write",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const ALL = [...PERMISSIONS];

const ROLE_MATRIX: Record<GlobalRole, Permission[]> = {
  SUPER_ADMIN: ALL,
  ADMIN: ALL,
  SALES: [
    "org:read",
    "lead:read",
    "lead:write",
    "deal:read",
    "deal:write",
    "report:read",
    "ai:use",
    "portal:read",
  ],
  ACCOUNT_MANAGER: [
    "org:read",
    "lead:read",
    "campaign:read",
    "creative:read",
    "approval:decide",
    "report:read",
    "report:write",
    "finance:read",
    "ai:use",
    "portal:read",
  ],
  PERFORMANCE_MARKETER: [
    "org:read",
    "campaign:read",
    "campaign:write",
    "campaign:launch",
    "creative:read",
    "approval:decide",
    "report:read",
    "ai:use",
    "integration:meta",
  ],
  CREATIVE: ["org:read", "creative:read", "creative:write", "campaign:read", "portal:read"],
  FINANCE: ["org:read", "finance:read", "finance:write", "report:read"],
  CLIENT_OWNER: [
    "portal:read",
    "portal:write",
    "campaign:read",
    "creative:read",
    "approval:decide",
    "report:read",
    "finance:read",
    "integration:meta",
  ],
  CLIENT_USER: ["portal:read", "campaign:read", "creative:read", "report:read"],
  VIEWER: ["org:read", "portal:read", "report:read"],
};

export function permissionsForRole(role: GlobalRole): Permission[] {
  return ROLE_MATRIX[role] || [];
}

export function roleHasPermission(role: GlobalRole, permission: Permission): boolean {
  return permissionsForRole(role).includes(permission);
}
