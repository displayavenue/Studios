import { z } from "zod";
import { requireOrgAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  decision: z.enum(["approve", "reject"]),
  note: z.string().optional(),
});

export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = schema.parse(await req.json());
    const approval = await prisma.approval.findUnique({ where: { id } });
    if (!approval) return jsonError("Approval not found", 404);
    if (approval.status !== "pending") {
      return jsonError("Approval already decided", 409);
    }

    const { session } = await requireOrgAccess(approval.organizationId, "approval:decide", req);

    const status = body.decision === "approve" ? "approved" : "rejected";
    const updated = await prisma.approval.update({
      where: { id },
      data: {
        status,
        decidedById: session.userId,
        decidedAt: new Date(),
        payload: {
          ...((approval.payload && typeof approval.payload === "object"
            ? approval.payload
            : {}) as object),
          decisionNote: body.note || null,
        },
      },
    });

    await writeAudit({
      action: `approval.${body.decision}`,
      userId: session.userId,
      organizationId: updated.organizationId,
      entity: "approval",
      entityId: updated.id,
      after: { status },
    });

    return jsonOk(updated);
  } catch (err) {
    return handleApiError(err);
  }
}
