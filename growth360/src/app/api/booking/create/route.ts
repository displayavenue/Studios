import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

const bodySchema = z.object({
  assessmentId: z.string().min(1),
  paymentId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().min(10),
  preferredAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const payment = await prisma.payment.findUnique({ where: { id: body.paymentId } });
    if (!payment || payment.status !== "paid") {
      return jsonError("Payment required before booking", 402);
    }

    const assessment = await prisma.assessment.findFirst({
      where: { OR: [{ id: body.assessmentId }, { publicId: body.assessmentId }] },
    });
    if (!assessment) return jsonError("Assessment not found", 404);

    const booking = await prisma.booking.create({
      data: {
        assessmentId: assessment.id,
        paymentId: payment.id,
        name: body.name,
        email: body.email,
        whatsapp: body.whatsapp,
        preferredAt: body.preferredAt ? new Date(body.preferredAt) : null,
        notes: body.notes,
        status: "scheduled",
      },
    });

    await prisma.lead.updateMany({
      where: { assessmentId: assessment.id },
      data: { status: "call_booked" },
    });

    return jsonOk({
      bookingId: booking.id,
      status: booking.status,
      message: "Strategy call reserved. DisplayAvenue sales team will confirm shortly.",
    });
  } catch (err) {
    return handleApiError(err);
  }
}
