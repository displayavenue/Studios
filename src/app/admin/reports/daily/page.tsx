import { getTodayDashboard } from "@/services/profit/service";
import { formatINR } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export const dynamic = "force-dynamic";

export default async function DailyReportPage() {
  const dash = await getTodayDashboard();
  const from = startOfDay(new Date());
  const to = endOfDay(new Date());
  const best = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { order: { createdAt: { gte: from, lte: to } } },
    _sum: { totalPrice: true },
    orderBy: { _sum: { totalPrice: "desc" } },
    take: 1,
  });
  const bestProduct = best[0]
    ? await prisma.product.findUnique({ where: { id: best[0].productId } })
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">Daily Report</h1>
        <p className="mt-2 text-sm text-[#8fa396]">Actuals only. AI analysis uses available data.</p>
      </div>
      <div className="admin-panel grid gap-3 p-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Revenue", formatINR(dash.revenue)],
          ["Orders", String(dash.orders)],
          ["AOV", formatINR(dash.aov)],
          ["Ad spend", formatINR(dash.adSpend)],
          ["Net contribution", formatINR(dash.netContribution)],
          ["Revenue target", formatINR(dash.revenueTarget)],
          ["Contribution target", formatINR(dash.contributionTarget)],
          ["Refunds", formatINR(dash.refunds)],
          ["RTO count", String(dash.rto)],
          ["Best product", bestProduct?.title || "INSUFFICIENT DATA"],
          ["Best channel", "INSUFFICIENT DATA"],
          ["Worst channel", "INSUFFICIENT DATA"],
        ].map(([k, v]) => (
          <div key={k as string} className="rounded border border-white/5 p-3">
            <div className="text-xs text-[#8fa396]">{k}</div>
            <div className="mt-1 text-white">{v}</div>
          </div>
        ))}
      </div>
      <div className="admin-panel space-y-3 p-5 text-sm">
        <h2 className="text-[#8fa396]">AI Daily Analysis</h2>
        <p><strong>WHAT HAPPENED:</strong> Revenue {formatINR(dash.revenue)} across {dash.orders} orders.</p>
        <p><strong>WHY IT HAPPENED:</strong> {dash.dataNote}</p>
        <p><strong>WHAT TO DO NEXT:</strong> Review winners, underperforming SKUs, and store health. Do not increase ad spend without CAC caps.</p>
      </div>
    </div>
  );
}
