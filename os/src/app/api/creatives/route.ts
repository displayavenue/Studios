import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission, requireOrgAccess } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    await requirePermission("creative:read", req);
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("organizationId");
    const where = orgId ? { organizationId: orgId } : {};
    if (orgId) await requireOrgAccess(orgId, "creative:read", req);
    const creatives = await prisma.creative.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
    return jsonOk(creatives);
  } catch (err) {
    return handleApiError(err);
  }
}

const createSchema = z.object({
  organizationId: z.string(),
  campaignId: z.string().optional(),
  name: z.string().min(2),
  type: z.enum(["image", "video", "carousel"]).optional(),
  assetUrl: z.string().optional(),
  headline: z.string().optional(),
  primaryText: z.string().optional(),
  cta: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = createSchema.parse(await req.json());
    const { session } = await requireOrgAccess(body.organizationId, "creative:write", req);
    const creative = await prisma.creative.create({
      data: {
        organizationId: body.organizationId,
        campaignId: body.campaignId,
        name: body.name,
        type: body.type || "image",
        assetUrl: body.assetUrl,
        headline: body.headline,
        primaryText: body.primaryText,
        cta: body.cta,
        status: "draft",
      },
    });
    await writeAudit({
      action: "creative.create",
      userId: session.userId,
      organizationId: body.organizationId,
      entity: "creative",
      entityId: creative.id,
    });
    return jsonOk(creative);
  } catch (err) {
    return handleApiError(err);
  }
}
