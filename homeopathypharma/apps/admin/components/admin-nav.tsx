"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminRole } from "@/lib/api";

interface NavItem {
  href: string;
  label: string;
  roles?: AdminRole[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

/** Role-based menu — visibility is UI-only; API enforces authorization. */
const navigation: NavGroup[] = [
  {
    title: "Command",
    items: [{ href: "/dashboard", label: "Dashboard" }],
  },
  {
    title: "Queues",
    items: [
      { href: "/queues/doctor-verification", label: "Doctor verification", roles: ["super-admin", "medical-reviewer"] },
      { href: "/queues/content-review", label: "Content medical review", roles: ["super-admin", "medical-reviewer"] },
      { href: "/queues/product-publish", label: "Product publish", roles: ["super-admin", "catalog-manager"] },
      { href: "/queues/review-moderation", label: "Review moderation", roles: ["super-admin", "support"] },
      { href: "/queues/refunds", label: "Refunds", roles: ["super-admin", "support"] },
      { href: "/queues/payouts", label: "Payouts", roles: ["super-admin"] },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/homepage", label: "Homepage CMS", roles: ["super-admin", "catalog-manager"] },
      { href: "/catalog", label: "Catalog", roles: ["super-admin", "catalog-manager"] },
      { href: "/doctors", label: "Doctors", roles: ["super-admin", "medical-reviewer", "catalog-manager"] },
      { href: "/inventory", label: "Inventory", roles: ["super-admin", "catalog-manager"] },
      { href: "/orders", label: "Orders", roles: ["super-admin", "support"] },
      { href: "/shipments", label: "Shipments", roles: ["super-admin", "support"] },
      { href: "/coupons", label: "Coupons", roles: ["super-admin", "catalog-manager"] },
    ],
  },
  {
    title: "Platform",
    items: [
      { href: "/seo", label: "SEO & sitemaps", roles: ["super-admin", "catalog-manager"] },
      { href: "/audit-logs", label: "Audit logs", roles: ["super-admin"] },
      { href: "/users", label: "Users & roles", roles: ["super-admin"] },
    ],
  },
];

interface AdminNavProps {
  roles?: AdminRole[];
}

function canSee(roles: AdminRole[] | undefined, userRoles: AdminRole[]): boolean {
  if (!roles?.length) return true;
  return roles.some((r) => userRoles.includes(r));
}

export function AdminNav({ roles = ["super-admin"] }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation">
      {navigation.map((group) => {
        const visibleItems = group.items.filter((item) => canSee(item.roles, roles));
        if (visibleItems.length === 0) return null;

        return (
          <div key={group.title}>
            <div className="nav-group">{group.title}</div>
            <ul>
              {visibleItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={active ? "page" : undefined} className="hp-focus-ring">
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <p className="role-note">Menu filtered for demo roles. API enforces access.</p>
    </nav>
  );
}
