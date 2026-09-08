import { prisma } from "@/lib/prisma";
import { formatINR, toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WinnersPage() {
  const winners = await prisma.product.findMany({
    where: { OR: [{ testStatus: "WINNER" }, { testStatus: "PROMISING" }, { tier: "TIER_1_HERO" }] },
    include: { analytics: true, supplier: true },
    orderBy: { contributionBeforeAds: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-white">Winning Products</h1>
      <p className="mt-2 text-sm text-[#8fa396]">
        Ranked by contribution — not revenue alone. Winners require minimum sample sizes. Never fabricate performance.
      </p>
      <div className="mt-6 overflow-x-auto admin-panel">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-[#8fa396]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Revenue</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">CAC</th>
              <th className="px-4 py-3">Contribution</th>
              <th className="px-4 py-3">Net</th>
              <th className="px-4 py-3">Inventory</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((p) => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="px-4 py-3">
                  <div className="text-white">{p.title}</div>
                  <div className="text-xs text-[#6f7f74]">{p.supplier?.name}</div>
                </td>
                <td className="px-4 py-3">{formatINR(toNumber(p.analytics?.revenue ?? 0))}</td>
                <td className="px-4 py-3">{p.analytics?.orders ?? 0}</td>
                <td className="px-4 py-3">{p.analytics?.cac != null ? formatINR(toNumber(p.analytics.cac)) : "—"}</td>
                <td className="px-4 py-3">{formatINR(toNumber(p.contributionBeforeAds))}</td>
                <td className="px-4 py-3">{formatINR(toNumber(p.analytics?.netContribution ?? 0))}</td>
                <td className="px-4 py-3">{p.stockQuantity}</td>
                <td className="px-4 py-3">{p.testStatus}</td>
                <td className="px-4 py-3 text-xs text-emerald-400">SCALE OPPORTUNITY — admin approval required</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!winners.length && (
          <p className="p-6 text-sm text-[#8fa396]">INSUFFICIENT DATA — no winners detected yet from actual performance.</p>
        )}
      </div>
    </div>
  );
}
