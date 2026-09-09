"use client";

import { useEffect, useState } from "react";

type Summary = {
  days: number;
  totals: Record<string, number>;
  topEvents: Array<{ name: string; count: number }>;
};

export function AdminAnalyticsClient() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load(d = days) {
    setError(null);
    const res = await fetch(`/api/admin/analytics?days=${d}`);
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed");
      return;
    }
    setData(json);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = data?.totals;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[7, 14, 30].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              setDays(d);
              void load(d);
            }}
            className={`rounded-md border px-3 py-1.5 text-xs ${days === d ? "border-[var(--jk-gold)] text-[var(--jk-gold)]" : "border-white/15"}`}
          >
            {d}d
          </button>
        ))}
        <button type="button" onClick={() => load()} className="rounded-md border border-white/15 px-3 py-1.5 text-xs">
          Refresh
        </button>
        {error && <span className="text-xs text-rose-400">{error}</span>}
      </div>

      {t && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Events", t.events],
            ["New users", t.newUsers],
            ["Report orders", t.reportOrders],
            ["Report ₹", t.reportRevenue],
            ["Mall orders", t.mallOrders],
            ["Mall ₹", t.mallRevenue],
            ["Wallet credits", t.walletCredits],
            ["Experts online", t.expertsOnline],
          ].map(([label, value]) => (
            <div key={String(label)} className="admin-panel p-4">
              <p className="text-[10px] uppercase tracking-wider text-[var(--jk-ivory)]/50">{label}</p>
              <p className="mt-1 font-display text-2xl text-[var(--jk-gold)]">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="admin-panel p-4">
        <h2 className="text-sm font-semibold text-[var(--jk-ivory)]">Top events</h2>
        <ul className="mt-3 space-y-1 text-sm text-[var(--jk-ivory)]/75">
          {(data?.topEvents || []).map((e) => (
            <li key={e.name} className="flex justify-between border-b border-white/5 py-1.5">
              <span>{e.name}</span>
              <span className="text-[var(--jk-gold)]">{e.count}</span>
            </li>
          ))}
          {!data?.topEvents?.length && <li className="text-[var(--jk-ivory)]/40">No events yet — browse the storefront to generate page views.</li>}
        </ul>
      </div>
    </div>
  );
}
