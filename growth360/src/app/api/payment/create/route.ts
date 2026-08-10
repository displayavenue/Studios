import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { createStrategyCallOrder } from "@/lib/razorpay";

const bodySchema = z.object({
  assessmentId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const assessment = await prisma.assessment.findFirst({
      where: { OR: [{ id: body.assessmentId }, { publicId: body.assessmentId }] },
    });
    if (!assessment) return jsonError("Assessment not found", 404);

    const order = await createStrategyCallOrder({
      assessmentId: assessment.id,
      name: body.name,
      email: body.email,
      whatsapp: body.whatsapp,
    });

    return jsonOk(order);
  } catch (err) {
    return handleApiError(err);
  }
}
