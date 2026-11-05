import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { completeAssessmentAnalysis } from "@/lib/engines/analysisOrchestrator";

const bodySchema = z.object({
  assessmentId: z.string().min(1),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactWhatsapp: z.string().min(10),
  company: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const assessment = await prisma.assessment.findUnique({
      where: { id: body.assessmentId },
    });
    if (!assessment) return jsonError("Assessment not found", 404);

    await prisma.assessment.update({
      where: { id: body.assessmentId },
      data: {
        contactName: body.contactName,
        contactEmail: body.contactEmail,
        contactWhatsapp: body.contactWhatsapp,
        company: body.company || assessment.company,
        status: "analyzing",
      },
    });

    const result = await completeAssessmentAnalysis(body.assessmentId);
    return jsonOk({
      publicId: result.publicId,
      assessmentId: result.assessmentId,
      growthScore: result.growthScore,
      aiStatusMessage: result.aiStatusMessage,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
