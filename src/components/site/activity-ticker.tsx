"use client";

import { useEffect, useState } from "react";
import { ACTIVITY_TICKER } from "@/content/marketplace-astrologers";

export function ActivityTicker() {
  const [lines, setLines] = useState<string[]>([...ACTIVITY_TICKER]);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/content/public", { signal: ctrl.signal })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && Array.isArray(data.ticker) && data.ticker.length) {
          setLines(data.ticker.map(String));
        }
      })
      .catch(() => undefined);
    return () => ctrl.abort();
  }, []);

  const loop = [...lines, ...lines];

  return (
    <div className="overflow-hidden border-t border-[var(--jk-line)] bg-[var(--at-cream)]">
      <div className="at-ticker whitespace-nowrap py-1.5 text-xs text-[var(--jk-muted)]">
        {loop.map((line, i) => (
          <span key={`${line}-${i}`} className="mx-6 inline-block">
            <span className="text-[var(--at-yellow-ink)]">✦</span> {line}
          </span>
        ))}
      </div>
    </div>
  );
}
