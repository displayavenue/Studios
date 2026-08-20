import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { getDisplayAvenueOrg } from "@/lib/org";
import { triggerWorkflow } from "@/lib/workflows/engine";

const schema = z.object({
  paymentId: z.string().min(1),
  slotStart: z.string().datetime(),
  slotEnd: z.string().datetime().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  organizationId: z.string().optional(),
  leadId: z.string().optional(),
  assessmentId: z.string().optional(),
  notes: z.string().optional(),
  timezone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());

    const payment = await prisma.payment.findUnique({ where: { id: body.paymentId } });
    if (!payment) return jsonError("Payment not found", 404);
    if (payment.status !== "PAID") {
      return jsonError("Booking requires a PAID paymentId", 402);
    }

    const orgId =
      body.organizationId || payment.organizationId || (await getDisplayAvenueOrg()).id;

    const slotStart = new Date(body.slotStart);
    const slotEnd = body.slotEnd
      ? new Date(body.slotEnd)
      : new Date(slotStart.getTime() + 30 * 60_000);

    const conflict = await prisma.booking.findFirst({
      where: {
        organizationId: orgId,
        status: { in: ["scheduled", "confirmed"] },
        slotStart: { lt: slotEnd },
        slotEnd: { gt: slotStart },
      },
    });
    if (conflict) return jsonError("Slot already booked", 409);

    const meta =
      payment.metadata && typeof payment.metadata === "object"
        ? (payment.metadata as Record<string, unknown>)
        : {};

    const booking = await prisma.booking.create({
      data: {
        organizationId: orgId,
        paymentId: payment.id,
        leadId: body.leadId || null,
        assessmentId:
          body.assessmentId ||
          (typeof meta.assessmentId === "string" ? meta.assessmentId : null),
        name: body.name,
        email: body.email,
        phone: body.phone || (typeof meta.whatsapp === "string" ? meta.whatsapp : null),
        slotStart,
        slotEnd,
        timezone: body.timezone || "Asia/Kolkata",
        status: "scheduled",
        notes: body.notes,
        metadata: { paymentPurpose: payment.purpose },
      },
    });

    if (body.leadId) {
      await prisma.lead.update({
        where: { id: body.leadId },
        data: { pipelineStatus: "STRATEGY_CALL" },
      }).catch(() => null);
    }

    await triggerWorkflow({
      event: "booking.created",
      organizationId: orgId,
      entityType: "booking",
      entityId: booking.id,
      payload: { paymentId: payment.id, slotStart: booking.slotStart.toISOString() },
    });

    return jsonOk(booking);
  } catch (err) {
    return handleApiError(err);
  }
}
