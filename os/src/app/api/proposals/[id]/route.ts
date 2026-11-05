import { z } from "zod";
import { Prisma } from "@prisma/client";
import { requireOrgAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { enqueueJob } from "@/lib/jobs";
import { triggerWorkflow } from "@/lib/workflows/engine";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { organization: { select: { id: true, name: true, slug: true } } },
    });
    if (!proposal) return jsonError("Proposal not found", 404);
    await requireOrgAccess(proposal.organizationId, "deal:read", req);
    return jsonOk(proposal);
  } catch (err) {
    return handleApiError(err);
  }
}

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  totalInr: z.number().nonnegative().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]).optional(),
  action: z.enum(["send", "accept"]).optional(),
});

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await prisma.proposal.findUnique({ where: { id } });
    if (!existing) return jsonError("Proposal not found", 404);
    const { session } = await requireOrgAccess(existing.organizationId, "deal:write", req);
    const body = patchSchema.parse(await req.json());

    let status = body.status;
    if (body.action === "send") status = "sent";
    if (body.action === "accept") status = "accepted";

    const updated = await prisma.proposal.update({
      where: { id },
      data: {
        title: body.title,
        totalInr: body.totalInr,
        content: body.content as Prisma.InputJsonValue | undefined,
        status,
      },
    });

    if (body.action === "accept" || status === "accepted") {
      await triggerWorkflow({
        event: "proposal.accepted",
        organizationId: updated.organizationId,
        entityType: "proposal",
        entityId: updated.id,
      });
      if (updated.totalInr > 0) {
        await enqueueJob({
          type: "payment.reminder",
          organizationId: updated.organizationId,
          payload: { proposalId: updated.id, amountInr: updated.totalInr },
        });
      }
    }

    await writeAudit({
      action: body.action ? `proposal.${body.action}` : "proposal.update",
      userId: session.userId,
      organizationId: updated.organizationId,
      entity: "proposal",
      entityId: updated.id,
      before: { status: existing.status },
      after: { status: updated.status, totalInr: updated.totalInr },
    });

    return jsonOk(updated);
  } catch (err) {
    return handleApiError(err);
  }
}
