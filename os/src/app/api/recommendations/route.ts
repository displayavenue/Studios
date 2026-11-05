import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission, requireOrgAccess } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET(req: Request) {
  try {
    await requirePermission("approval:decide", req);
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("organizationId");
    const status = searchParams.get("status") || "pending";
    const where = {
      status,
      ...(orgId ? { organizationId: orgId } : {}),
    };
    const rows = await prisma.aiRecommendation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { campaign: { select: { id: true, name: true, dailyBudgetInr: true } } },
    });
    return jsonOk(rows);
  } catch (err) {
    return handleApiError(err);
  }
}

const createSchema = z.object({
  organizationId: z.string(),
  campaignId: z.string().optional(),
  type: z.string(),
  title: z.string(),
  rationale: z.string(),
  currentValue: z.unknown().optional(),
  proposedValue: z.unknown().optional(),
});

/** Staff/AI pipeline creates recommendations — never auto-applies budget changes. */
export async function POST(req: Request) {
  try {
    const body = createSchema.parse(await req.json());
    await requireOrgAccess(body.organizationId, "campaign:write", req);
    const row = await prisma.aiRecommendation.create({
      data: {
        organizationId: body.organizationId,
        campaignId: body.campaignId,
        type: body.type,
        title: body.title,
        rationale: body.rationale,
        currentValue: body.currentValue as object | undefined,
        proposedValue: body.proposedValue as object | undefined,
        status: "pending",
      },
    });
    await prisma.approval.create({
      data: {
        organizationId: body.organizationId,
        type: "ai_optimization",
        title: body.title,
        status: "pending",
        payload: { recommendationId: row.id },
      },
    });
    return jsonOk(row);
  } catch (err) {
    return handleApiError(err);
  }
}
