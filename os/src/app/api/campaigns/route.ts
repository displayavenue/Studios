import { z } from "zod";
import { Prisma } from "@prisma/client";
import { requireOrgAccess, requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { accessibleOrgIds } from "@/lib/org";
import { writeAudit } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const session = await requirePermission("campaign:read", req);
    const url = new URL(req.url);
    const organizationId = url.searchParams.get("organizationId");
    const orgScope = await accessibleOrgIds(session);

    if (!organizationId) {
      const where =
        orgScope === "all"
          ? {}
          : { organizationId: { in: orgScope.length ? orgScope : ["__none__"] } };
      const campaigns = await prisma.campaign.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      return jsonOk({ campaigns });
    }

    await requireOrgAccess(organizationId, "campaign:read", req);
    const campaigns = await prisma.campaign.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return jsonOk({ campaigns });
  } catch (err) {
    return handleApiError(err);
  }
}

const createSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(2),
  objective: z.string().optional(),
  platform: z.string().optional().default("meta"),
  dailyBudgetInr: z.number().nonnegative().optional(),
  status: z.string().optional().default("draft"),
  adAccountId: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = createSchema.parse(await req.json());
    const { session } = await requireOrgAccess(body.organizationId, "campaign:write", req);

    const campaign = await prisma.campaign.create({
      data: {
        organizationId: body.organizationId,
        name: body.name,
        objective: body.objective,
        platform: body.platform || "meta",
        dailyBudgetInr: body.dailyBudgetInr,
        status: body.status || "draft",
        adAccountId: body.adAccountId,
        meta: (body.meta || { metrics: [] }) as Prisma.InputJsonValue,
      },
    });

    await writeAudit({
      action: "campaign.create",
      userId: session.userId,
      organizationId: body.organizationId,
      entity: "campaign",
      entityId: campaign.id,
      after: { name: campaign.name, status: campaign.status },
    });

    return jsonOk(campaign);
  } catch (err) {
    return handleApiError(err);
  }
}
