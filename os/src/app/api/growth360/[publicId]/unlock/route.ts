import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { requirePermission } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";

type Params = { params: Promise<{ publicId: string }> };

const schema = z.object({
  unlocked: z.boolean().optional().default(true),
  paymentId: z.string().optional(),
});

export async function POST(req: Request, { params }: Params) {
  try {
    const { publicId } = await params;
    const body = schema.parse(await req.json().catch(() => ({})));

    const assessment = await prisma.assessment.findUnique({ where: { publicId } });
    if (!assessment) return jsonError("Assessment not found", 404);

    // Staff may unlock directly; public unlock requires a PAID payment referencing this assessment
    let allowed = false;
    let userId: string | null = null;

    try {
      const session = await requirePermission("lead:write", req);
      allowed = true;
      userId = session.userId;
    } catch {
      if (body.paymentId) {
        const payment = await prisma.payment.findUnique({ where: { id: body.paymentId } });
        if (payment && payment.status === "PAID") {
          const meta =
            payment.metadata && typeof payment.metadata === "object"
              ? (payment.metadata as Record<string, unknown>)
              : {};
          if (meta.assessmentId === assessment.id || meta.publicId === publicId) {
            allowed = true;
          }
        }
      }
    }

    if (!allowed) {
      return jsonError("Unlock requires staff permission or a paid paymentId", 403);
    }

    const updated = await prisma.assessment.update({
      where: { id: assessment.id },
      data: { unlocked: body.unlocked },
    });

    if (userId) {
      await writeAudit({
        action: "assessment.unlock",
        userId,
        organizationId: assessment.organizationId,
        entity: "assessment",
        entityId: assessment.id,
        after: { unlocked: updated.unlocked },
      });
    }

    return jsonOk({
      publicId: updated.publicId,
      unlocked: updated.unlocked,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
