"use client";

import type { ReactNode } from "react";
import { AdminShell } from "@homeopathypharma/ui";

interface AdminAppShellProps {
  header: ReactNode;
  nav: ReactNode;
  children: ReactNode;
}

export function AdminAppShell({ header, nav, children }: AdminAppShellProps) {
  return (
    <AdminShell header={header} nav={nav}>
      {children}
    </AdminShell>
  );
}
