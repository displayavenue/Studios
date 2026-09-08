import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      _count: { select: { orders: true, reports: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-[var(--jk-ivory)]">Customers</h1>
      <div className="admin-panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[var(--jk-ivory)]/60">
              <th className="p-3">Email</th>
              <th className="p-3">Name</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Reports</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-white/5">
                <td className="p-3">{c.email}</td>
                <td className="p-3">{[c.firstName, c.lastName].filter(Boolean).join(" ") || "—"}</td>
                <td className="p-3">{c._count.orders}</td>
                <td className="p-3">{c._count.reports}</td>
                <td className="p-3">{c.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
