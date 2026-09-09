"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Lightweight pageview tracker for admin analytics. */
export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    const ctrl = new AbortController();
    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "page_view",
        pageUrl: pathname,
        referrer: typeof document !== "undefined" ? document.referrer : undefined,
      }),
      signal: ctrl.signal,
      keepalive: true,
    }).catch(() => undefined);
    return () => ctrl.abort();
  }, [pathname]);

  return null;
}
