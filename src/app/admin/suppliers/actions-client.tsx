"use client";
import { useTransition } from "react";

export function ConnectSupplierActions({ supplierId }: { supplierId: string }) {
  const [pending, start] = useTransition();
  const run = (action: string) =>
    start(async () => {
      await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId, action }),
      });
      window.location.reload();
    });
  return (
    <div className="flex flex-wrap gap-1">
      {["test", "sync_products", "sync_inventory", "sync_prices", "disable"].map((a) => (
        <button
          key={a}
          disabled={pending}
          onClick={() => run(a)}
          className="rounded border border-white/10 px-2 py-1 text-[10px] uppercase hover:bg-white/5"
        >
          {a.replaceAll("_", " ")}
        </button>
      ))}
    </div>
  );
}
