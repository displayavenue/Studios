import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { accessibleOrgIds } from "@/lib/org";

export async function GET(req: Request) {
  try {
    const session = await requirePermission("approval:decide", req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "pending";
    const organizationId = url.searchParams.get("organizationId");
    const orgScope = await accessibleOrgIds(session);

    const where: {
      status?: string;
      organizationId?: string | { in: string[] };
    } = {};
    if (status !== "all") where.status = status;

    if (organizationId) {
      if (orgScope !== "all" && !orgScope.includes(organizationId)) {
        return jsonOk({ approvals: [], count: 0 });
      }
      where.organizationId = organizationId;
    } else if (orgScope !== "all") {
      where.organizationId = { in: orgScope.length ? orgScope : ["__none__"] };
    }

    const approvals = await prisma.approval.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { organization: { select: { id: true, name: true, slug: true } } },
    });

    return jsonOk({ approvals, count: approvals.length });
  } catch (err) {
    return handleApiError(err);
  }
}
