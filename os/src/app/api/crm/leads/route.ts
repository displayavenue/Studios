import { LeadPipelineStatus } from "@prisma/client";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { accessibleOrgIds } from "@/lib/org";

export async function GET(req: Request) {
  try {
    const session = await requirePermission("lead:read", req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") as LeadPipelineStatus | null;
    const q = url.searchParams.get("q")?.trim();
    const take = Math.min(Number(url.searchParams.get("take") || 100), 500);

    const orgScope = await accessibleOrgIds(session);
    const where: {
      organizationId?: { in: string[] };
      pipelineStatus?: LeadPipelineStatus;
      OR?: { name?: { contains: string; mode: "insensitive" }; email?: { contains: string; mode: "insensitive" }; company?: { contains: string; mode: "insensitive" } }[];
    } = {};

    if (orgScope !== "all") {
      where.organizationId = { in: orgScope.length ? orgScope : ["__none__"] };
    }
    if (status && Object.values(LeadPipelineStatus).includes(status)) {
      where.pipelineStatus = status;
    }
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: [{ leadScore: "desc" }, { createdAt: "desc" }],
      take,
      include: {
        organization: { select: { id: true, name: true, slug: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    return jsonOk({ leads, count: leads.length });
  } catch (err) {
    return handleApiError(err);
  }
}
