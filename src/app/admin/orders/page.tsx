import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-[var(--jk-ivory)]">Orders</h1>
      <div className="admin-panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[var(--jk-ivory)]/60">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Product</th>
              <th className="p-3">Status</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-white/5">
                <td className="p-3">{o.orderNumber}</td>
                <td className="p-3">{o.user.email}</td>
                <td className="p-3">{o.items.map((i) => i.product.name).join(", ")}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{formatINR(Number(o.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.length && <p className="p-6 text-sm text-[var(--jk-ivory)]/50">No orders yet.</p>}
      </div>
    </div>
  );
}
