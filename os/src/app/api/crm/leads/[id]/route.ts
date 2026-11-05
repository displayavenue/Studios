import { z } from "zod";
import { LeadPipelineStatus } from "@prisma/client";
import { requirePermission, requireOrgAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { accessibleOrgIds } from "@/lib/org";
import { calculateLeadScore } from "@/lib/engines/leadScoreEngine";
import { triggerWorkflow } from "@/lib/workflows/engine";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await requirePermission("lead:read", req);
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, name: true, slug: true } },
        assignee: { select: { id: true, name: true, email: true } },
        assessments: {
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            publicId: true,
            status: true,
            growthScore: true,
            unlocked: true,
            completedAt: true,
          },
        },
        deals: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
    if (!lead) return jsonError("Lead not found", 404);

    const orgScope = await accessibleOrgIds(session);
    if (orgScope !== "all" && !orgScope.includes(lead.organizationId)) {
      return jsonError("No access to this lead", 403);
    }

    return jsonOk(lead);
  } catch (err) {
    return handleApiError(err);
  }
}

const patchSchema = z.object({
  pipelineStatus: z.nativeEnum(LeadPipelineStatus).optional(),
  notes: z.string().optional(),
  assigneeId: z.string().nullable().optional(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  budget: z.number().optional().nullable(),
});

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) return jsonError("Lead not found", 404);

    const { session } = await requireOrgAccess(existing.organizationId, "lead:write", req);
    const body = patchSchema.parse(await req.json());

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        pipelineStatus: body.pipelineStatus,
        notes: body.notes,
        assigneeId: body.assigneeId === undefined ? undefined : body.assigneeId,
        name: body.name,
        email: body.email === undefined ? undefined : body.email,
        phone: body.phone === undefined ? undefined : body.phone,
        company: body.company === undefined ? undefined : body.company,
        budget: body.budget === undefined ? undefined : body.budget,
      },
    });

    const score = calculateLeadScore({
      budget: updated.budget,
      growthScore: updated.growthScore,
      industry: updated.industry,
      location: updated.location,
      website: updated.website,
      email: updated.email,
      phone: updated.phone,
      company: updated.company,
      source: updated.source,
      pipelineStatus: updated.pipelineStatus,
      utmSource: updated.utmSource,
      utmCampaign: updated.utmCampaign,
    });

    const withScore = await prisma.lead.update({
      where: { id },
      data: { leadScore: score.score, leadGrade: score.grade },
    });

    if (
      body.pipelineStatus === "QUALIFIED" &&
      existing.pipelineStatus !== "QUALIFIED"
    ) {
      await triggerWorkflow({
        event: "lead.qualified",
        organizationId: updated.organizationId,
        entityType: "lead",
        entityId: updated.id,
        assigneeId: updated.assigneeId,
      });
    }

    await writeAudit({
      action: "lead.update",
      userId: session.userId,
      organizationId: updated.organizationId,
      entity: "lead",
      entityId: updated.id,
      before: {
        pipelineStatus: existing.pipelineStatus,
        assigneeId: existing.assigneeId,
        notes: existing.notes,
      },
      after: {
        pipelineStatus: withScore.pipelineStatus,
        assigneeId: withScore.assigneeId,
        notes: withScore.notes,
        leadScore: withScore.leadScore,
      },
    });

    return jsonOk(withScore);
  } catch (err) {
    return handleApiError(err);
  }
}
