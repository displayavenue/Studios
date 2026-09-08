import Link from "next/link";
import { getTodayDashboard } from "@/services/profit/service";
import { formatINR } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const snap = await getTodayDashboard();
  const [productCount, publishedCount, openOrders, health] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.order.count({
      where: { status: { notIn: ["DELIVERED", "CANCELLED", "REFUNDED"] } },
    }),
    prisma.storeHealthCheck.findMany({ orderBy: { component: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-white">How are we doing today?</h1>
        <p className="mt-2 text-sm text-[#8fa396]">{snap.dataNote}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Today's Revenue"
          value={formatINR(snap.revenue)}
          sub={`Target ${formatINR(snap.revenueTarget)} · ${snap.revenueProgress}%`}
        />
        <Metric
          label="Net Contribution"
          value={formatINR(snap.netContribution)}
          sub={`Min ${formatINR(snap.contributionTarget)} · ${snap.contributionStatus}`}
          tone={
            snap.contributionStatus === "GREEN"
              ? "green"
              : snap.contributionStatus === "YELLOW"
                ? "yellow"
                : "red"
          }
        />
        <Metric label="Orders" value={String(snap.orders)} sub={`AOV ${formatINR(snap.aov)}`} />
        <Metric
          label="Ad Spend"
          value={formatINR(snap.adSpend)}
          sub={`CAC ${snap.cac != null ? formatINR(snap.cac) : "—"} · ROAS ${snap.roas != null ? snap.roas.toFixed(2) : "—"}`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="admin-panel p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8fa396]">
            Target pacing
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Row label="Revenue remaining" value={formatINR(snap.revenueRemaining)} />
            <Row label="Contribution remaining" value={formatINR(snap.contributionRemaining)} />
            <Row
              label="Orders required (est.)"
              value={snap.requiredOrders != null ? String(snap.requiredOrders) : "INSUFFICIENT DATA"}
            />
            <Row
              label="Conversion"
              value={
                snap.conversionRate != null ? `${snap.conversionRate.toFixed(2)}%` : "INSUFFICIENT DATA"
              }
            />
            <Row label="Visitors" value={String(snap.visitors)} />
            <Row label="Refunds / RTO" value={`${formatINR(snap.refunds)} / ${snap.rto}`} />
          </dl>
          <p className="mt-4 text-xs text-[#6f7f74]">
            Pacing uses actual data only. Targets (₹1L revenue / ₹10k contribution) are objectives — not guarantees.
          </p>
        </div>

        <div className="admin-panel p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8fa396]">
            Catalog pulse
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Row label="Total products" value={String(productCount)} />
            <Row label="Published" value={String(publishedCount)} />
            <Row label="Open orders" value={String(openOrders)} />
            <Row label="Architecture" value="5,000+ ready" />
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <QuickLink href="/admin/product-import">Import</QuickLink>
            <QuickLink href="/admin/product-discovery">Discover</QuickLink>
            <QuickLink href="/admin/winners">Winners</QuickLink>
            <QuickLink href="/admin/simulator">Simulator</QuickLink>
            <QuickLink href="/admin/ai">VELORA AI</QuickLink>
          </div>
        </div>
      </div>

      {snap.revenue > 0 && snap.netContribution < snap.contributionTarget * 0.5 && (
        <div className="admin-panel border-amber-500/30 p-5">
          <h2 className="text-amber-300">HIGH REVENUE / LOW CONTRIBUTION</h2>
          <p className="mt-2 text-sm text-[#c5d0c8]">
            Consider: reduce CAC, increase AOV, promote higher-contribution products, pause inefficient ads,
            review pricing.
          </p>
        </div>
      )}

      <div className="admin-panel p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8fa396]">
            Store health
          </h2>
          <Link href="/admin/store-health" className="text-xs text-emerald-400">
            Full report
          </Link>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {health.map((h) => (
            <div key={h.id} className="rounded-md border border-white/5 px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span>{h.component}</span>
                <StatusPill status={h.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "green" | "yellow" | "red";
}) {
  const color =
    tone === "green" ? "text-emerald-400" : tone === "yellow" ? "text-amber-300" : tone === "red" ? "text-rose-300" : "text-white";
  return (
    <div className="admin-panel p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-[#8fa396]">{label}</p>
      <p className={`mt-2 font-display text-3xl ${color}`}>{value}</p>
      <p className="mt-2 text-xs text-[#6f7f74]">{sub}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[#6f7f74]">{label}</dt>
      <dd className="text-white">{value}</dd>
    </div>
  );
}

function QuickLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-md border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">
      {children}
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "HEALTHY"
      ? "text-emerald-400"
      : status === "WARNING"
        ? "text-amber-300"
        : "text-rose-300";
  return <span className={`text-xs ${cls}`}>{status}</span>;
}
