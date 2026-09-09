import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [customerCount, orderCount, productCount, reportCount, subscriptionCount, revenueAgg] =
    await Promise.all([
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.report.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "REPORT_READY", "REPORT_GENERATING"] } },
        _sum: { total: true },
      }),
    ]);

  const revenue = Number(revenueAgg._sum.total ?? 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[var(--jk-ivory)]">Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--jk-ivory)]/60">
          JyotishKundali platform overview — KPI placeholders update with live data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Customers" value={String(customerCount)} />
        <Metric label="Orders" value={String(orderCount)} />
        <Metric label="Reports" value={String(reportCount)} />
        <Metric label="Active subscriptions" value={String(subscriptionCount)} />
        <Metric label="Revenue (paid)" value={formatINR(revenue)} />
      </div>

      <div className="admin-panel p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--jk-ivory)]/60">
          Quick links
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <QuickLink href="/admin/orders">Orders</QuickLink>
          <QuickLink href="/admin/reports">Reports queue</QuickLink>
          <QuickLink href="/admin/products">Products</QuickLink>
          <QuickLink href="/admin/experts">Experts</QuickLink>
          <QuickLink href="/admin/subscriptions">Subscriptions</QuickLink>
          <QuickLink href="/admin/customers">Customers</QuickLink>
        </div>
        <p className="mt-4 text-xs text-[var(--jk-ivory)]/40">
          {productCount} active products in catalog · Reports at ₹499 · Membership at ₹2,999/year
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-panel p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--jk-ivory)]/60">{label}</p>
      <p className="mt-2 font-display text-3xl text-[var(--jk-gold)]">{value}</p>
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
