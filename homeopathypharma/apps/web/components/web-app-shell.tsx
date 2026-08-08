"use client";

import type { ReactNode } from "react";
import { StorefrontShell } from "@homeopathypharma/ui";

interface WebAppShellProps {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

export function WebAppShell({ header, footer, children }: WebAppShellProps) {
  return (
    <StorefrontShell header={header} footer={footer}>
      {children}
    </StorefrontShell>
  );
}
