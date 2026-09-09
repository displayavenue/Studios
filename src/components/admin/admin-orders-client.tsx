"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  orderNumber: string;
  email: string;
  product?: string;
  itemName?: string;
  total?: number;
  amountInr?: number;
  status: string;
};

export function AdminOrdersClient({ kind }: { kind: "reports" | "mall" }) {
  const [rows, setRows] = useState<Row[]>([]);

  async function load() {
    const res = await fetch(`/api/admin/orders?kind=${kind}`);
    const data = await res.json();
    if (res.ok) setRows(data.orders || []);
  }

  useEffect(() => {
    load();
  }, [kind]);

  async function setStatus(id: string, status: string) {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, kind, status }),
    });
    await load();
  }

  const statuses =
    kind === "mall"
      ? ["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"]
      : ["PENDING", "PAID", "REPORT_GENERATING", "REPORT_READY", "FAILED", "REFUNDED", "CANCELLED"];

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-[var(--jk-ivory)]/50">
          <tr>
            <th className="px-3 py-2">Order</th>
            <th className="px-3 py-2">Item</th>
            <th className="px-3 py-2">₹</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-white/10">
              <td className="px-3 py-2">
                <p className="font-medium">{r.orderNumber}</p>
                <p className="text-xs text-[var(--jk-ivory)]/45">{r.email}</p>
              </td>
              <td className="px-3 py-2 text-xs">{r.product || r.itemName}</td>
              <td className="px-3 py-2">{r.total ?? r.amountInr}</td>
              <td className="px-3 py-2">
                <select
                  className="rounded border border-white/15 bg-transparent px-2 py-1 text-xs"
                  value={r.status}
                  onChange={(e) => setStatus(r.id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} className="bg-[var(--jk-midnight)]">
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={4} className="px-3 py-8 text-center text-sm text-[var(--jk-ivory)]/40">
                No orders yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
