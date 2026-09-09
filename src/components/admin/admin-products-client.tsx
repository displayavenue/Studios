"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  isActive: boolean;
  category: string;
};

export function AdminProductsClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [note, setNote] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    if (res.ok) setRows(data.products || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function patch(id: string, body: Record<string, unknown>) {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    if (res.ok) {
      setNote("Saved");
      await load();
    }
  }

  return (
    <div className="space-y-4">
      {note && <p className="text-xs text-emerald-400">{note}</p>}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-[var(--jk-ivory)]/50">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">₹</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="px-3 py-2">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-[var(--jk-ivory)]/45">
                    {r.slug} · {r.category}
                  </p>
                </td>
                <td className="px-3 py-2">{r.price}</td>
                <td className="px-3 py-2 text-xs">
                  {r.status} · {r.isActive ? "active" : "hidden"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      className="rounded border border-white/15 px-2 py-1 text-[10px]"
                      onClick={() => patch(r.id, { isActive: !r.isActive })}
                    >
                      {r.isActive ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      className="rounded border border-white/15 px-2 py-1 text-[10px]"
                      onClick={() =>
                        patch(r.id, { status: r.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" })
                      }
                    >
                      {r.status === "PUBLISHED" ? "Unpublish" : "Publish"}
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
