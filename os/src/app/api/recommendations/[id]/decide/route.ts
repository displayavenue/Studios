import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireOrgAccess } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  decision: z.enum(["approve", "reject"]),
});

export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = schema.parse(await req.json());
    const rec = await prisma.aiRecommendation.findUnique({ where: { id } });
    if (!rec) return jsonError("Recommendation not found", 404);
    const { session } = await requireOrgAccess(rec.organizationId, "approval:decide", req);

    const status = body.decision === "approve" ? "approved" : "rejected";
    const updated = await prisma.aiRecommendation.update({
      where: { id },
      data: { status, decidedById: session.userId, decidedAt: new Date() },
    });

    // V1: on approve of budget_change, update local campaign only (Meta apply requires connected adapter)
    if (status === "approved" && rec.type === "budget_change" && rec.campaignId) {
      const proposed = rec.proposedValue as { dailyBudgetInr?: number } | null;
      if (proposed?.dailyBudgetInr != null) {
        await prisma.campaign.update({
          where: { id: rec.campaignId },
          data: { dailyBudgetInr: proposed.dailyBudgetInr },
        });
      }
    }

    await writeAudit({
      action: `recommendation.${status}`,
      userId: session.userId,
      organizationId: rec.organizationId,
      entity: "ai_recommendation",
      entityId: id,
      before: { status: rec.status },
      after: { status },
    });

    return jsonOk(updated);
  } catch (err) {
    return handleApiError(err);
  }
}
