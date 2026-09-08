import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { email: true } },
      product: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-[var(--jk-ivory)]">Subscriptions</h1>
      <div className="admin-panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[var(--jk-ivory)]/60">
              <th className="p-3">Customer</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Renews</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.id} className="border-b border-white/5">
                <td className="p-3">{s.user.email}</td>
                <td className="p-3">{s.product.name}</td>
                <td className="p-3">{s.status}</td>
                <td className="p-3">{formatINR(Number(s.amount))}</td>
                <td className="p-3">{s.renewsAt?.toLocaleDateString() ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!subscriptions.length && (
          <p className="p-6 text-sm text-[var(--jk-ivory)]/50">No active subscriptions yet.</p>
        )}
      </div>
    </div>
  );
}
