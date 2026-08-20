import { LeadPipelineStatus } from "@prisma/client";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { accessibleOrgIds } from "@/lib/org";

export async function GET(req: Request) {
  try {
    const session = await requirePermission("lead:read", req);
    const orgScope = await accessibleOrgIds(session);

    const where =
      orgScope === "all"
        ? {}
        : { organizationId: { in: orgScope.length ? orgScope : ["__none__"] } };

    const grouped = await prisma.lead.groupBy({
      by: ["pipelineStatus"],
      where,
      _count: { _all: true },
    });

    const counts = Object.fromEntries(
      Object.values(LeadPipelineStatus).map((s) => [s, 0]),
    ) as Record<LeadPipelineStatus, number>;

    for (const row of grouped) {
      counts[row.pipelineStatus] = row._count._all;
    }

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    return jsonOk({ counts, total });
  } catch (err) {
    return handleApiError(err);
  }
}
