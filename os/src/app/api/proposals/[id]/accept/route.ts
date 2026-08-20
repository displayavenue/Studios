import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { enqueueJob } from "@/lib/jobs";
import { triggerWorkflow } from "@/lib/workflows/engine";
import { createProposalOrder } from "@/lib/payments/razorpay";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  acceptedByName: z.string().optional(),
  acceptedByEmail: z.string().email().optional(),
  createPayment: z.boolean().optional().default(true),
});

/** Client-facing accept — enqueues payment order when amount > 0. */
export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = schema.parse(await req.json().catch(() => ({})));
    const proposal = await prisma.proposal.findUnique({ where: { id } });
    if (!proposal) return jsonError("Proposal not found", 404);
    if (proposal.status === "accepted") {
      return jsonError("Proposal already accepted", 409);
    }

    const updated = await prisma.proposal.update({
      where: { id },
      data: {
        status: "accepted",
        content: {
          ...((proposal.content && typeof proposal.content === "object"
            ? proposal.content
            : {}) as object),
          acceptance: {
            acceptedAt: new Date().toISOString(),
            acceptedByName: body.acceptedByName || null,
            acceptedByEmail: body.acceptedByEmail || null,
          },
        },
      },
    });

    await triggerWorkflow({
      event: "proposal.accepted",
      organizationId: updated.organizationId,
      entityType: "proposal",
      entityId: updated.id,
    });

    let paymentOrder = null;
    if (body.createPayment && updated.totalInr > 0) {
      paymentOrder = await createProposalOrder({
        organizationId: updated.organizationId,
        proposalId: updated.id,
        amountInr: updated.totalInr,
        metadata: {
          acceptedByName: body.acceptedByName,
          acceptedByEmail: body.acceptedByEmail,
        },
      });
      await enqueueJob({
        type: "payment.reminder",
        organizationId: updated.organizationId,
        payload: {
          proposalId: updated.id,
          paymentId: paymentOrder.paymentId,
          amountInr: updated.totalInr,
        },
        runAfter: new Date(Date.now() + 60 * 60_000),
      });
    }

    await writeAudit({
      action: "proposal.accept",
      organizationId: updated.organizationId,
      entity: "proposal",
      entityId: updated.id,
      after: { status: "accepted", paymentId: paymentOrder?.paymentId || null },
    });

    return jsonOk({ proposal: updated, payment: paymentOrder });
  } catch (err) {
    return handleApiError(err);
  }
}
