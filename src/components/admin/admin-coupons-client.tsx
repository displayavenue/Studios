"use client";

import { useEffect, useState } from "react";

type Coupon = {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  usageCount: number;
  isActive: boolean;
};

export function AdminCouponsClient() {
  const [rows, setRows] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [value, setValue] = useState(10);
  const [note, setNote] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    if (res.ok) setRows(data.coupons || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, discountType: "percent", discountValue: value }),
    });
    const data = await res.json();
    if (res.ok) {
      setNote(`Created ${data.code}`);
      setCode("");
      await load();
    } else setNote(data.error || "Failed");
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="admin-panel flex flex-wrap items-end gap-2 p-4">
        <label className="text-xs">
          Code
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="mt-1 block h-9 rounded border border-white/15 bg-transparent px-2"
          />
        </label>
        <label className="text-xs">
          % off
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="mt-1 block h-9 w-20 rounded border border-white/15 bg-transparent px-2"
          />
        </label>
        <button type="button" onClick={create} className="h-9 rounded border border-[var(--jk-gold)] px-3 text-xs text-[var(--jk-gold)]">
          Create coupon
        </button>
        {note && <span className="text-xs text-emerald-400">{note}</span>}
      </div>
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-[var(--jk-ivory)]/50">
            <tr>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Discount</th>
              <th className="px-3 py-2">Uses</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">{r.code}</td>
                <td className="px-3 py-2 text-xs">
                  {r.discountValue}
                  {r.discountType === "percent" ? "%" : "₹"}
                </td>
                <td className="px-3 py-2 text-xs">{r.usageCount}</td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="rounded border border-white/15 px-2 py-1 text-[10px]"
                    onClick={() => toggle(r.id, r.isActive)}
                  >
                    {r.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
