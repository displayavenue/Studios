"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  slug: string;
  displayName: string;
  email: string;
  pricePerMin: number;
  isOnline: boolean;
  isActive: boolean;
  isVerified: boolean;
  isSample: boolean;
  badge: string | null;
};

export function AdminExpertsClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function load() {
    setError(null);
    const res = await fetch("/api/admin/experts");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load");
      return;
    }
    setRows(data.experts || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function patch(id: string, body: Record<string, unknown>) {
    setNote(null);
    const res = await fetch("/api/admin/experts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Update failed");
      return;
    }
    setNote("Updated");
    await load();
  }

  async function seed() {
    setNote(null);
    const res = await fetch("/api/admin/experts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "seed-samples" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Seed failed");
      return;
    }
    setNote(`Seeded samples: +${data.created} / updated ${data.updated}`);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={seed} className="rounded-md border border-white/15 px-3 py-1.5 text-xs hover:bg-white/5">
          Seed sample experts
        </button>
        <button type="button" onClick={load} className="rounded-md border border-white/15 px-3 py-1.5 text-xs hover:bg-white/5">
          Refresh
        </button>
        {note && <span className="text-xs text-emerald-400">{note}</span>}
        {error && <span className="text-xs text-rose-400">{error}</span>}
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-[var(--jk-ivory)]/50">
            <tr>
              <th className="px-3 py-2">Expert</th>
              <th className="px-3 py-2">₹/min</th>
              <th className="px-3 py-2">Flags</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="px-3 py-2">
                  <p className="font-medium text-[var(--jk-ivory)]">{r.displayName}</p>
                  <p className="text-xs text-[var(--jk-ivory)]/50">
                    {r.slug} · {r.email} · {r.isSample ? "sample" : "live apply"}
                  </p>
                </td>
                <td className="px-3 py-2">{r.pricePerMin}</td>
                <td className="px-3 py-2 text-xs">
                  {r.isVerified ? "verified" : "pending"} · {r.isOnline ? "online" : "offline"} ·{" "}
                  {r.isActive ? "active" : "hidden"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      className="rounded border border-white/15 px-2 py-1 text-[10px] hover:bg-white/5"
                      onClick={() => patch(r.id, { isVerified: !r.isVerified })}
                    >
                      {r.isVerified ? "Unverify" : "Verify"}
                    </button>
                    <button
                      type="button"
                      className="rounded border border-white/15 px-2 py-1 text-[10px] hover:bg-white/5"
                      onClick={() => patch(r.id, { isOnline: !r.isOnline })}
                    >
                      {r.isOnline ? "Go offline" : "Go online"}
                    </button>
                    <button
                      type="button"
                      className="rounded border border-white/15 px-2 py-1 text-[10px] hover:bg-white/5"
                      onClick={() => patch(r.id, { isActive: !r.isActive })}
                    >
                      {r.isActive ? "Hide" : "Show"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-sm text-[var(--jk-ivory)]/50">
                  No experts yet — seed samples or wait for applications.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
