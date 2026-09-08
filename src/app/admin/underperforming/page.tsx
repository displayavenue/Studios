import { prisma } from "@/lib/prisma";
import { formatINR, toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function UnderperformingPage() {
  const items = await prisma.product.findMany({
    where: {
      OR: [
        { testStatus: "UNDERPERFORMING" },
        { testStatus: "UNPROFITABLE" },
        { tier: "TIER_4_LOW_PRIORITY" },
        { status: "PRICE_REVIEW" },
      ],
    },
    include: { analytics: true, supplier: true },
    take: 50,
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-white">Underperforming Products</h1>
      <p className="mt-2 text-sm text-[#8fa396]">High CAC, negative contribution, low conversion, high returns/RTO, supplier issues.</p>
      <div className="mt-6 space-y-3">
        {items.map((p) => (
          <div key={p.id} className="admin-panel flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <div>
              <div className="font-medium text-white">{p.title}</div>
              <div className="text-xs text-[#6f7f74]">
                {p.testStatus} · contrib {formatINR(toNumber(p.contributionBeforeAds))} · stock {p.stockQuantity} · {p.supplier?.name}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {["Pause Ads", "Change Creative", "Change Price", "Change Supplier", "Retest", "Unpublish"].map((a) => (
                <span key={a} className="rounded border border-white/10 px-2 py-1">{a}</span>
              ))}
            </div>
          </div>
        ))}
        {!items.length && <p className="text-sm text-[#8fa396]">No underperforming products flagged yet.</p>}
      </div>
    </div>
  );
}
