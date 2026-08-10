import { requireOrgAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import type { StoredCampaignMetric } from "@/lib/platforms/metaAdapter";

type Params = { params: Promise<{ id: string }> };

/**
 * Returns stored metrics only. Never fabricates ROAS/spend/leads.
 * Empty array is a valid response when Meta is not connected / no sync yet.
 */
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) return jsonError("Campaign not found", 404);
    await requireOrgAccess(campaign.organizationId, "campaign:read", req);

    const meta =
      campaign.meta && typeof campaign.meta === "object"
        ? (campaign.meta as Record<string, unknown>)
        : {};

    const metrics: StoredCampaignMetric[] = Array.isArray(meta.metrics)
      ? (meta.metrics as StoredCampaignMetric[])
      : [];

    return jsonOk({
      campaignId: campaign.id,
      platform: campaign.platform,
      metrics,
      source: "database",
      note:
        metrics.length === 0
          ? "No stored metrics yet. Connect Meta and sync before metrics appear — values are never fabricated."
          : undefined,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
