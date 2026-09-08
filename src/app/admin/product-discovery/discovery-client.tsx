"use client";
import { useState, useTransition } from "react";
import { formatINR } from "@/lib/utils";

type Opp = {
  supplierProductId: string;
  title: string;
  costPrice: number;
  shippingCost: number;
  landedCost: number;
  sellingPrice: number;
  contribution: number;
  margin: number;
  inventory: number;
  score: number;
  recommendation: string;
};

export function DiscoveryClient({ suppliers }: { suppliers: Array<{ id: string; name: string; type: string }> }) {
  const [items, setItems] = useState<Opp[]>([]);
  const [pending, start] = useTransition();

  return (
    <div className="mt-6 space-y-4">
      <button
        disabled={pending}
        className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-medium"
        onClick={() =>
          start(async () => {
            const res = await fetch("/api/products/discover", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ supplierId: suppliers[0]?.id }) });
            const data = await res.json();
            setItems(data.opportunities || []);
          })
        }
      >
        {pending ? "Analyzing…" : "Find Product Opportunities"}
      </button>
      <div className="overflow-x-auto admin-panel">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-[#8fa396]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Landed</th>
              <th className="px-4 py-3">Sell</th>
              <th className="px-4 py-3">Contribution</th>
              <th className="px-4 py-3">Margin</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Rec</th>
            </tr>
          </thead>
          <tbody>
            {items.map((o) => (
              <tr key={o.supplierProductId} className="border-t border-white/5">
                <td className="px-4 py-3 text-white">{o.title}</td>
                <td className="px-4 py-3">{formatINR(o.costPrice)}</td>
                <td className="px-4 py-3">{formatINR(o.landedCost)}</td>
                <td className="px-4 py-3">{formatINR(o.sellingPrice)}</td>
                <td className="px-4 py-3">{formatINR(o.contribution)}</td>
                <td className="px-4 py-3">{o.margin}%</td>
                <td className="px-4 py-3">{o.inventory}</td>
                <td className="px-4 py-3">{o.score}</td>
                <td className="px-4 py-3 text-xs">{o.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
