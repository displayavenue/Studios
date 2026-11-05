import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

const schema = z.object({
  assessmentId: z.string().min(1).optional(),
  publicId: z.string().min(1).optional(),
  answers: z.record(z.string(), z.unknown()),
  merge: z.boolean().optional().default(true),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    if (!body.assessmentId && !body.publicId) {
      return jsonError("assessmentId or publicId required", 400);
    }

    const assessment = body.assessmentId
      ? await prisma.assessment.findUnique({ where: { id: body.assessmentId } })
      : await prisma.assessment.findUnique({ where: { publicId: body.publicId! } });

    if (!assessment) return jsonError("Assessment not found", 404);
    if (assessment.status === "completed") {
      return jsonError("Assessment already completed", 409);
    }

    const prev =
      assessment.answers && typeof assessment.answers === "object" && !Array.isArray(assessment.answers)
        ? (assessment.answers as Record<string, unknown>)
        : {};

    const nextAnswers = body.merge ? { ...prev, ...body.answers } : body.answers;

    const updated = await prisma.assessment.update({
      where: { id: assessment.id },
      data: {
        answers: nextAnswers as Prisma.InputJsonValue,
        status: assessment.status === "started" ? "in_progress" : assessment.status,
      },
    });

    return jsonOk({
      id: updated.id,
      publicId: updated.publicId,
      status: updated.status,
      answers: updated.answers,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
