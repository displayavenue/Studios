import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireOrgAccess } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";

const schema = z.object({
  organizationId: z.string(),
});

/**
 * Deterministic upsell suggestions from org profile + campaigns.
 * Never invents performance claims.
 */
export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    await requireOrgAccess(body.organizationId, "deal:write", req);
    const org = await prisma.organization.findUniqueOrThrow({ where: { id: body.organizationId } });
    const campaigns = await prisma.campaign.findMany({
      where: { organizationId: body.organizationId },
      select: { platform: true, status: true },
    });
    const platforms = new Set(campaigns.map((c) => c.platform));
    const opportunities: { service: string; reason: string; suggestedBudgetInr: number }[] = [];

    if (!platforms.has("meta") && !platforms.has("google")) {
      opportunities.push({
        service: "Meta Ads",
        reason: "No connected/paid Meta campaigns on this organization yet.",
        suggestedBudgetInr: 25000,
      });
    }
    if (!platforms.has("google")) {
      opportunities.push({
        service: "Google Ads",
        reason: "Recommendation only in V1 — architecture ready for GoogleAdsAdapter later.",
        suggestedBudgetInr: 25000,
      });
    }
    if (org.industry?.toLowerCase().includes("real")) {
      opportunities.push({
        service: "Landing Pages",
        reason: "Real estate offers typically benefit from dedicated conversion pages.",
        suggestedBudgetInr: 15000,
      });
    }

    return jsonOk({
      organizationId: org.id,
      opportunities,
      note: "Human approval required before sending proposals to clients.",
    });
  } catch (err) {
    return handleApiError(err);
  }
}
