import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { accessibleOrgIds } from "@/lib/org";

/** Real billing aggregates only — zeros are valid. */
export async function GET(req: Request) {
  try {
    const session = await requirePermission("finance:read", req);
    const url = new URL(req.url);
    const organizationId = url.searchParams.get("organizationId");
    const orgScope = await accessibleOrgIds(session);

    let orgFilter: string[] | undefined;
    if (organizationId) {
      if (orgScope !== "all" && !orgScope.includes(organizationId)) {
        return jsonOk(emptySummary());
      }
      orgFilter = [organizationId];
    } else if (orgScope !== "all") {
      orgFilter = orgScope;
      if (!orgFilter.length) return jsonOk(emptySummary());
    }

    const orgWhere = orgFilter ? { organizationId: { in: orgFilter } } : {};

    const [
      paidPayments,
      pendingPayments,
      invoicesByStatus,
      invoiceTotals,
      overdueCount,
    ] = await Promise.all([
      prisma.payment.aggregate({
        where: { ...orgWhere, status: "PAID" },
        _sum: { amountInr: true },
        _count: { _all: true },
      }),
      prisma.payment.aggregate({
        where: { ...orgWhere, status: { in: ["CREATED", "PENDING"] } },
        _sum: { amountInr: true },
        _count: { _all: true },
      }),
      prisma.invoice.groupBy({
        by: ["status"],
        where: orgWhere,
        _count: { _all: true },
        _sum: { amountInr: true, gstInr: true },
      }),
      prisma.invoice.aggregate({
        where: orgWhere,
        _sum: { amountInr: true, gstInr: true },
        _count: { _all: true },
      }),
      prisma.invoice.count({
        where: { ...orgWhere, status: "overdue" },
      }),
    ]);

    const invoices = Object.fromEntries(
      invoicesByStatus.map((row) => [
        row.status,
        {
          count: row._count._all,
          amountInr: row._sum.amountInr || 0,
          gstInr: row._sum.gstInr || 0,
        },
      ]),
    );

    return jsonOk({
      payments: {
        paidInr: paidPayments._sum.amountInr || 0,
        paidCount: paidPayments._count._all,
        pendingInr: pendingPayments._sum.amountInr || 0,
        pendingCount: pendingPayments._count._all,
      },
      invoices: {
        totalCount: invoiceTotals._count._all,
        totalAmountInr: invoiceTotals._sum.amountInr || 0,
        totalGstInr: invoiceTotals._sum.gstInr || 0,
        overdueCount,
        byStatus: invoices,
      },
      dataSource: "database" as const,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

function emptySummary() {
  return {
    payments: { paidInr: 0, paidCount: 0, pendingInr: 0, pendingCount: 0 },
    invoices: {
      totalCount: 0,
      totalAmountInr: 0,
      totalGstInr: 0,
      overdueCount: 0,
      byStatus: {},
    },
    dataSource: "database" as const,
    generatedAt: new Date().toISOString(),
  };
}
