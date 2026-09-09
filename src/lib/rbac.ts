import { Role } from "@/generated/prisma/enums";

export const PERMISSIONS = {
  "admin.access": [Role.SUPER_ADMIN, Role.ADMIN],
  "customers.manage": [Role.SUPER_ADMIN, Role.ADMIN],
  "orders.manage": [Role.SUPER_ADMIN, Role.ADMIN],
  "products.manage": [Role.SUPER_ADMIN, Role.ADMIN],
  "reports.manage": [Role.SUPER_ADMIN, Role.ADMIN, Role.EXPERT],
  "experts.manage": [Role.SUPER_ADMIN, Role.ADMIN],
  "subscriptions.manage": [Role.SUPER_ADMIN, Role.ADMIN],
  "coupons.manage": [Role.SUPER_ADMIN, Role.ADMIN],
  "content.manage": [Role.SUPER_ADMIN, Role.ADMIN],
  "settings.manage": [Role.SUPER_ADMIN, Role.ADMIN],
  "analytics.view": [Role.SUPER_ADMIN, Role.ADMIN],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: Permission): boolean {
  const allowed = PERMISSIONS[permission];
  return (allowed as readonly Role[]).includes(role);
}

export function isAdminRole(role: Role): boolean {
  return role === Role.ADMIN || role === Role.SUPER_ADMIN;
}

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", permission: "admin.access" as Permission },
  { href: "/admin/analytics", label: "Analytics", permission: "analytics.view" as Permission },
  { href: "/admin/customers", label: "Customers", permission: "customers.manage" as Permission },
  { href: "/admin/orders", label: "Orders", permission: "orders.manage" as Permission },
  { href: "/admin/mall-orders", label: "Mall & wallet", permission: "orders.manage" as Permission },
  { href: "/admin/products", label: "Products", permission: "products.manage" as Permission },
  { href: "/admin/experts", label: "Experts", permission: "experts.manage" as Permission },
  { href: "/admin/coupons", label: "Coupons", permission: "coupons.manage" as Permission },
  { href: "/admin/content", label: "Content & banners", permission: "content.manage" as Permission },
  { href: "/admin/reports", label: "Reports", permission: "reports.manage" as Permission },
  { href: "/admin/subscriptions", label: "Subscriptions", permission: "subscriptions.manage" as Permission },
  { href: "/admin/settings", label: "Settings", permission: "settings.manage" as Permission },
] as const;
