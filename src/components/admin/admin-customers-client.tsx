"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  email: string;
  phone: string | null;
  name: string;
  role: string;
  isActive: boolean;
  balanceInr: number;
  orders: number;
  reports: number;
};

export function AdminCustomersClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [note, setNote] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/customers");
    const data = await res.json();
    if (res.ok) setRows(data.customers || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function credit(id: string) {
    const amount = Number(prompt("Credit wallet amount (INR)", "100") || 0);
    if (!amount || amount <= 0) return;
    const res = await fetch("/api/admin/customers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, creditInr: amount }),
    });
    setNote(res.ok ? `Credited ₹${amount}` : "Failed");
    await load();
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch("/api/admin/customers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    await load();
  }

  return (
    <div className="space-y-4">
      {note && <p className="text-xs text-emerald-400">{note}</p>}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-[var(--jk-ivory)]/50">
            <tr>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Wallet</th>
              <th className="px-3 py-2">Orders</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="px-3 py-2">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-[var(--jk-ivory)]/45">
                    {r.email}
                    {r.phone ? ` · +91 ${r.phone}` : ""} · {r.role}
                    {!r.isActive ? " · inactive" : ""}
                  </p>
                </td>
                <td className="px-3 py-2">₹{r.balanceInr}</td>
                <td className="px-3 py-2 text-xs">
                  {r.orders} orders · {r.reports} reports
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      className="rounded border border-white/15 px-2 py-1 text-[10px]"
                      onClick={() => credit(r.id)}
                    >
                      Credit wallet
                    </button>
                    <button
                      type="button"
                      className="rounded border border-white/15 px-2 py-1 text-[10px]"
                      onClick={() => toggleActive(r.id, r.isActive)}
                    >
                      {r.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
