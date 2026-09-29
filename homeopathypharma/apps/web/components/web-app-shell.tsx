"use client";

import type { ReactNode } from "react";
import { StorefrontShell } from "@homeopathypharma/ui";
import { MobileNav } from "@/components/mobile-nav";

interface WebAppShellProps {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  mobileNavItems?: { href: string; label: string }[];
}

export function WebAppShell({ header, footer, children, mobileNavItems }: WebAppShellProps) {
  return (
    <>
      <StorefrontShell header={header} footer={footer}>
        <div className="storefront-main">{children}</div>
      </StorefrontShell>
      <MobileNav items={mobileNavItems} />
    </>
  );
}
