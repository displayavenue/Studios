import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireOrgAccess } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  note: z.string().optional(),
});

export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = schema.parse(await req.json().catch(() => ({})));
    const creative = await prisma.creative.findUnique({ where: { id } });
    if (!creative) return jsonError("Creative not found", 404);
    const { session } = await requireOrgAccess(creative.organizationId, "creative:write", req);

    const updated = await prisma.creative.update({
      where: { id },
      data: { status: "client_review", meta: { ...(creative.meta as object || {}), note: body.note } },
    });

    await prisma.approval.create({
      data: {
        organizationId: creative.organizationId,
        type: "creative",
        title: `Approve creative: ${creative.name}`,
        status: "pending",
        payload: { creativeId: creative.id, version: creative.version },
      },
    });

    await writeAudit({
      action: "creative.submit_review",
      userId: session.userId,
      organizationId: creative.organizationId,
      entity: "creative",
      entityId: id,
    });

    return jsonOk(updated);
  } catch (err) {
    return handleApiError(err);
  }
}
