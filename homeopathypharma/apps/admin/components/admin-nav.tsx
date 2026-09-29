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

/** WordPress-style CMS + operations nav. API enforces authorization. */
const navigation: NavGroup[] = [
  {
    title: "Command",
    items: [{ href: "/dashboard", label: "Dashboard" }],
  },
  {
    title: "Content",
    items: [
      { href: "/homepage", label: "Homepage", roles: ["super-admin", "catalog-manager"] },
      { href: "/pages", label: "Pages", roles: ["super-admin", "catalog-manager"] },
      { href: "/media", label: "Media library", roles: ["super-admin", "catalog-manager"] },
      { href: "/menus", label: "Menus", roles: ["super-admin", "catalog-manager"] },
      { href: "/settings", label: "Site settings", roles: ["super-admin", "catalog-manager"] },
    ],
  },
  {
    title: "Catalogue",
    items: [
      { href: "/catalog", label: "Products", roles: ["super-admin", "catalog-manager"] },
      { href: "/brands", label: "Brands", roles: ["super-admin", "catalog-manager"] },
      { href: "/doctors", label: "Doctors", roles: ["super-admin", "medical-reviewer", "catalog-manager"] },
      { href: "/inventory", label: "Inventory", roles: ["super-admin", "catalog-manager"] },
    ],
  },
  {
    title: "Commerce",
    items: [
      { href: "/orders", label: "Orders", roles: ["super-admin", "support"] },
      { href: "/shipments", label: "Shipments", roles: ["super-admin", "support"] },
      { href: "/coupons", label: "Coupons", roles: ["super-admin", "catalog-manager"] },
    ],
  },
  {
    title: "Queues",
    items: [
      { href: "/queues/doctor-verification", label: "Doctor verification", roles: ["super-admin", "medical-reviewer"] },
      { href: "/queues/content-review", label: "Content review", roles: ["super-admin", "medical-reviewer"] },
      { href: "/queues/product-publish", label: "Product publish", roles: ["super-admin", "catalog-manager"] },
      { href: "/queues/review-moderation", label: "Review moderation", roles: ["super-admin", "support"] },
      { href: "/queues/refunds", label: "Refunds", roles: ["super-admin", "support"] },
      { href: "/queues/payouts", label: "Payouts", roles: ["super-admin"] },
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
      <p className="role-note">WordPress-style CMS — edits save to data/cms. Rebuild storefront to publish on Hostinger.</p>
    </nav>
  );
}
