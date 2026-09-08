import { prisma } from "@/lib/prisma";
import { formatINR, toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { items: true, payments: true, shipments: true },
  });
  return (
    <div>
      <h1 className="font-display text-3xl text-white">Orders</h1>
      <div className="mt-6 overflow-x-auto admin-panel">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-[#8fa396]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Net contrib</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">AWB</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-white/5">
                <td className="px-4 py-3 text-white">{o.orderNumber}</td>
                <td className="px-4 py-3">{o.status}</td>
                <td className="px-4 py-3">{formatINR(toNumber(o.total))}</td>
                <td className="px-4 py-3">{o.netContribution != null ? formatINR(toNumber(o.netContribution)) : "—"}</td>
                <td className="px-4 py-3">{o.paymentMethod || "—"}</td>
                <td className="px-4 py-3">{o.shipments[0]?.awb || "—"}</td>
                <td className="px-4 py-3 text-xs">{o.createdAt.toISOString().slice(0, 16)}</td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan={7} className="px-4 py-6 text-[#8fa396]">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
