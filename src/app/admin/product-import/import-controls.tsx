"use client";
import { useState, useTransition } from "react";

export function ImportControls({ suppliers }: { suppliers: Array<{ id: string; name: string }> }) {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "");
  const [pending, start] = useTransition();
  const [result, setResult] = useState<Record<string, number> | null>(null);

  const run = (limit: number) =>
    start(async () => {
      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId, limit, skipDuplicates: true }),
      });
      const data = await res.json();
      setResult(data.progress || data);
      if (res.ok) window.location.reload();
    });

  return (
    <div className="admin-panel space-y-4 p-5">
      <label className="block text-sm">
        Supplier
        <select
          className="mt-1 h-10 w-full max-w-md rounded-md border border-white/10 bg-black/20 px-3"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        >
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-2">
        {[100, 500, 1000, 5000].map((n) => (
          <button
            key={n}
            disabled={pending || !supplierId}
            onClick={() => run(n)}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm hover:bg-emerald-600 disabled:opacity-50"
          >
            Import {n === 5000 ? "5,000+" : n}
          </button>
        ))}
      </div>
      {result && (
        <pre className="overflow-auto rounded bg-black/30 p-3 text-xs text-[#c5d0c8]">{JSON.stringify(result, null, 2)}</pre>
      )}
      <p className="text-xs text-[#6f7f74]">
        Progress tracked: Imported · Skipped · Duplicate · Failed · Pending · Approved · Published
      </p>
    </div>
  );
}
