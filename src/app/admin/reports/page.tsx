import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { email: true } },
      product: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-[var(--jk-ivory)]">Reports</h1>
      <div className="admin-panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[var(--jk-ivory)]/60">
              <th className="p-3">Report</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-white/5">
                <td className="p-3">{r.product.name}</td>
                <td className="p-3">{r.user.email}</td>
                <td className="p-3">{r.jobStatus}</td>
                <td className="p-3">{r.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!reports.length && (
          <p className="p-6 text-sm text-[var(--jk-ivory)]/50">No reports yet.</p>
        )}
      </div>
    </div>
  );
}
