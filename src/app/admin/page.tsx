import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { getAnalyticsSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [customerCount, orderCount, productCount, reportCount, expertOnline, revenueAgg, analytics] =
    await Promise.all([
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.report.count(),
      prisma.expert.count({ where: { isOnline: true, isActive: true } }),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "REPORT_READY", "REPORT_GENERATING"] } },
        _sum: { total: true },
      }),
      getAnalyticsSummary(7),
    ]);

  const revenue = Number(revenueAgg._sum.total ?? 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[var(--jk-ivory)]">Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--jk-ivory)]/60">
          JyotishKundali ops overview — manage experts, products, orders, coupons, and analytics from the sidebar.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Customers" value={String(customerCount)} />
        <Metric label="Report orders" value={String(orderCount)} />
        <Metric label="Experts online" value={String(expertOnline)} />
        <Metric label="Revenue (paid)" value={formatINR(revenue)} />
        <Metric label="7d events" value={String(analytics.totals.events)} />
        <Metric label="7d mall ₹" value={formatINR(analytics.totals.mallRevenue)} />
        <Metric label="Active products" value={String(productCount)} />
        <Metric label="Reports" value={String(reportCount)} />
      </div>

      <div className="admin-panel p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--jk-ivory)]/60">
          Manage
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <QuickLink href="/admin/analytics">Analytics</QuickLink>
          <QuickLink href="/admin/experts">Experts</QuickLink>
          <QuickLink href="/admin/products">Products</QuickLink>
          <QuickLink href="/admin/orders">Orders</QuickLink>
          <QuickLink href="/admin/mall-orders">Mall & wallet</QuickLink>
          <QuickLink href="/admin/coupons">Coupons</QuickLink>
          <QuickLink href="/admin/content">Content</QuickLink>
          <QuickLink href="/admin/customers">Customers</QuickLink>
          <QuickLink href="/admin/settings">Settings</QuickLink>
        </div>
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
