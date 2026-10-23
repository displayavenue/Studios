"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

/** Client gate so CMS pages require a signed admin session cookie. */
export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(pathname === "/login");

  useEffect(() => {
    if (pathname === "/login") {
      setReady(true);
      return;
    }
    let cancelled = false;
    void (async () => {
      const res = await fetch("/api/cms/auth", { credentials: "include" });
      const data = (await res.json()) as { authenticated?: boolean };
      if (cancelled) return;
      if (!data.authenticated) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!ready) {
    return (
      <div style={{ padding: "2rem", color: "var(--hp-color-text-muted)" }}>
        Checking admin session…
      </div>
    );
  }
  return <>{children}</>;
}
