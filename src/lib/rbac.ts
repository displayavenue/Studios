import { Role } from "@/generated/prisma/enums";

export const PERMISSIONS = {
  "admin.access": [Role.SUPER_ADMIN, Role.ADMIN, Role.PRODUCT_MANAGER, Role.ORDER_MANAGER, Role.MARKETING_MANAGER, Role.ANALYST],
  "products.manage": [Role.SUPER_ADMIN, Role.ADMIN, Role.PRODUCT_MANAGER],
  "products.import": [Role.SUPER_ADMIN, Role.ADMIN, Role.PRODUCT_MANAGER],
  "products.approve": [Role.SUPER_ADMIN, Role.ADMIN, Role.PRODUCT_MANAGER],
  "orders.manage": [Role.SUPER_ADMIN, Role.ADMIN, Role.ORDER_MANAGER],
  "suppliers.manage": [Role.SUPER_ADMIN, Role.ADMIN, Role.PRODUCT_MANAGER],
  "marketing.manage": [Role.SUPER_ADMIN, Role.ADMIN, Role.MARKETING_MANAGER],
  "analytics.view": [Role.SUPER_ADMIN, Role.ADMIN, Role.ANALYST, Role.MARKETING_MANAGER, Role.PRODUCT_MANAGER],
  "settings.manage": [Role.SUPER_ADMIN, Role.ADMIN],
  "automation.manage": [Role.SUPER_ADMIN, Role.ADMIN],
  "ai.use": [Role.SUPER_ADMIN, Role.ADMIN, Role.PRODUCT_MANAGER, Role.MARKETING_MANAGER],
  "coupons.manage": [Role.SUPER_ADMIN, Role.ADMIN, Role.MARKETING_MANAGER],
  "reviews.moderate": [Role.SUPER_ADMIN, Role.ADMIN, Role.PRODUCT_MANAGER],
  "returns.manage": [Role.SUPER_ADMIN, Role.ADMIN, Role.ORDER_MANAGER],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: Permission): boolean {
  const allowed = PERMISSIONS[permission];
  return (allowed as readonly Role[]).includes(role);
}

export function isAdminRole(role: Role): boolean {
  return role !== Role.CUSTOMER;
}

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", permission: "admin.access" as Permission },
  { href: "/admin/products", label: "Products", permission: "products.manage" as Permission },
  { href: "/admin/product-import", label: "Product Import", permission: "products.import" as Permission },
  { href: "/admin/product-discovery", label: "Product Discovery", permission: "products.manage" as Permission },
  { href: "/admin/winners", label: "Winning Products", permission: "analytics.view" as Permission },
  { href: "/admin/underperforming", label: "Underperforming", permission: "analytics.view" as Permission },
  { href: "/admin/categories", label: "Categories", permission: "products.manage" as Permission },
  { href: "/admin/suppliers", label: "Suppliers", permission: "suppliers.manage" as Permission },
  { href: "/admin/inventory", label: "Inventory", permission: "products.manage" as Permission },
  { href: "/admin/orders", label: "Orders", permission: "orders.manage" as Permission },
  { href: "/admin/customers", label: "Customers", permission: "orders.manage" as Permission },
  { href: "/admin/reviews", label: "Reviews", permission: "reviews.moderate" as Permission },
  { href: "/admin/returns", label: "Returns", permission: "returns.manage" as Permission },
  { href: "/admin/coupons", label: "Coupons", permission: "coupons.manage" as Permission },
  { href: "/admin/marketing", label: "Marketing", permission: "marketing.manage" as Permission },
  { href: "/admin/meta-ads", label: "Meta Ads", permission: "marketing.manage" as Permission },
  { href: "/admin/google-shopping", label: "Google Shopping", permission: "marketing.manage" as Permission },
  { href: "/admin/creatives", label: "Creatives", permission: "marketing.manage" as Permission },
  { href: "/admin/analytics", label: "Analytics", permission: "analytics.view" as Permission },
  { href: "/admin/profit-planner", label: "Profit Planner", permission: "analytics.view" as Permission },
  { href: "/admin/simulator", label: "Simulator", permission: "analytics.view" as Permission },
  { href: "/admin/ai", label: "AI Assistant", permission: "ai.use" as Permission },
  { href: "/admin/automation", label: "Automation", permission: "automation.manage" as Permission },
  { href: "/admin/reports/daily", label: "Reports", permission: "analytics.view" as Permission },
  { href: "/admin/store-health", label: "Store Health", permission: "settings.manage" as Permission },
  { href: "/admin/settings", label: "Settings", permission: "settings.manage" as Permission },
] as const;
