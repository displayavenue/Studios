import { z } from "zod";
import { Prisma } from "@prisma/client";
import { requireOrgAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { metaAdsAdapter } from "@/lib/platforms/metaAdapter";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) return jsonError("Campaign not found", 404);
    await requireOrgAccess(campaign.organizationId, "campaign:read", req);
    return jsonOk(campaign);
  } catch (err) {
    return handleApiError(err);
  }
}

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  objective: z.string().optional().nullable(),
  dailyBudgetInr: z.number().nonnegative().optional().nullable(),
  status: z.string().optional(),
  action: z.enum(["pause", "resume"]).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
  syncMeta: z.boolean().optional().default(false),
});

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing) return jsonError("Campaign not found", 404);
    const { session } = await requireOrgAccess(existing.organizationId, "campaign:write", req);
    const body = patchSchema.parse(await req.json());

    let status = body.status;
    if (body.action === "pause") status = "paused";
    if (body.action === "resume") status = "active";

    const metaRemote: { attempted: boolean; ok: boolean; error?: string } = {
      attempted: false,
      ok: false,
    };

    if (body.syncMeta && existing.externalId && (body.action === "pause" || body.action === "resume")) {
      metaRemote.attempted = true;
      const integration = await prisma.platformIntegration.findUnique({
        where: {
          organizationId_platform: {
            organizationId: existing.organizationId,
            platform: "meta",
          },
        },
      });
      if (integration?.status === "connected" && metaAdsAdapter.isConfigured()) {
        try {
          if (body.action === "pause") await metaAdsAdapter.pauseCampaign!(existing.externalId);
          else await metaAdsAdapter.resumeCampaign!(existing.externalId);
          metaRemote.ok = true;
        } catch (e) {
          metaRemote.error = e instanceof Error ? e.message : "Meta API error";
        }
      } else {
        metaRemote.error = "Meta approval / credentials required";
      }
    }

    const prevMeta =
      existing.meta && typeof existing.meta === "object"
        ? (existing.meta as Record<string, unknown>)
        : {};

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        name: body.name,
        objective: body.objective === undefined ? undefined : body.objective,
        dailyBudgetInr: body.dailyBudgetInr === undefined ? undefined : body.dailyBudgetInr,
        status,
        meta: body.meta
          ? ({ ...prevMeta, ...body.meta } as Prisma.InputJsonValue)
          : undefined,
      },
    });

    await writeAudit({
      action: body.action ? `campaign.${body.action}` : "campaign.update",
      userId: session.userId,
      organizationId: updated.organizationId,
      entity: "campaign",
      entityId: updated.id,
      before: { status: existing.status },
      after: { status: updated.status, metaRemote },
    });

    return jsonOk({ campaign: updated, metaRemote });
  } catch (err) {
    return handleApiError(err);
  }
}
