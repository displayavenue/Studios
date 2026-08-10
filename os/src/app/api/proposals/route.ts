import { z } from "zod";
import { Prisma } from "@prisma/client";
import { requirePermission, requireOrgAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { accessibleOrgIds } from "@/lib/org";
import { writeAudit } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const session = await requirePermission("deal:read", req);
    const url = new URL(req.url);
    const organizationId = url.searchParams.get("organizationId");
    const orgScope = await accessibleOrgIds(session);

    const where: { organizationId?: string | { in: string[] } } = {};
    if (organizationId) {
      if (orgScope !== "all" && !orgScope.includes(organizationId)) {
        return jsonOk({ proposals: [], count: 0 });
      }
      where.organizationId = organizationId;
    } else if (orgScope !== "all") {
      where.organizationId = { in: orgScope.length ? orgScope : ["__none__"] };
    }

    const proposals = await prisma.proposal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { organization: { select: { id: true, name: true, slug: true } } },
    });
    return jsonOk({ proposals, count: proposals.length });
  } catch (err) {
    return handleApiError(err);
  }
}

const createSchema = z.object({
  organizationId: z.string().min(1),
  title: z.string().min(2),
  totalInr: z.number().nonnegative().default(0),
  content: z.record(z.string(), z.unknown()).optional(),
  status: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = createSchema.parse(await req.json());
    const { session } = await requireOrgAccess(body.organizationId, "deal:write", req);

    const proposal = await prisma.proposal.create({
      data: {
        organizationId: body.organizationId,
        title: body.title,
        totalInr: body.totalInr,
        content: (body.content || {}) as Prisma.InputJsonValue,
        status: body.status || "draft",
      },
    });

    await writeAudit({
      action: "proposal.create",
      userId: session.userId,
      organizationId: body.organizationId,
      entity: "proposal",
      entityId: proposal.id,
      after: { title: proposal.title, totalInr: proposal.totalInr },
    });

    return jsonOk(proposal);
  } catch (err) {
    return handleApiError(err);
  }
}
