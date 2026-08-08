"use client";

import type { ReactNode } from "react";
import { DoctorShell } from "@homeopathypharma/ui";

interface DoctorAppShellProps {
  header: ReactNode;
  nav: ReactNode;
  children: ReactNode;
}

export function DoctorAppShell({ header, nav, children }: DoctorAppShellProps) {
  return (
    <DoctorShell header={header} nav={nav}>
      {children}
    </DoctorShell>
  );
}
