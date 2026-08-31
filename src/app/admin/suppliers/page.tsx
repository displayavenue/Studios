import { prisma } from "@/lib/prisma";
import { ConnectSupplierActions } from "./actions-client";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { priority: "asc" } });
  return (
    <div>
      <h1 className="font-display text-3xl text-white">Suppliers</h1>
      <p className="mt-2 text-sm text-[#8fa396]">
        Multi-supplier abstraction — never hard-coded to a single vendor. Connect API, CSV, or custom providers.
      </p>
      <div className="mt-6 overflow-x-auto admin-panel">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-[#8fa396]">
            <tr>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Reliability</th>
              <th className="px-4 py-3">Shipping</th>
              <th className="px-4 py-3">Last sync</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-t border-white/5">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{s.name}</div>
                  <div className="text-xs text-[#6f7f74]">{s.providerType}</div>
                </td>
                <td className="px-4 py-3">{s.status}</td>
                <td className="px-4 py-3">{s.productCount}</td>
                <td className="px-4 py-3">{s.reliabilityScore.toFixed(0)}</td>
                <td className="px-4 py-3">{s.shippingScore.toFixed(0)}{s.avgShippingDays ? ` · ${s.avgShippingDays}d` : ""}</td>
                <td className="px-4 py-3 text-xs">{s.lastSyncAt ? s.lastSyncAt.toISOString().slice(0, 16) : "—"}</td>
                <td className="px-4 py-3"><ConnectSupplierActions supplierId={s.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
