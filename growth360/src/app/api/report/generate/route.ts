import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { generateReportPdf } from "@/lib/pdf/generateReport";

const bodySchema = z.object({
  assessmentId: z.string().min(1),
  unlock: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const assessment = await prisma.assessment.findFirst({
      where: {
        OR: [{ id: body.assessmentId }, { publicId: body.assessmentId }],
      },
    });
    if (!assessment) return jsonError("Assessment not found", 404);

    if (body.unlock) {
      await prisma.assessment.update({
        where: { id: assessment.id },
        data: { unlocked: true },
      });
    }

    const { report, filePath } = await generateReportPdf(assessment.id);
    return jsonOk({
      reportId: report.id,
      assessmentId: assessment.id,
      publicId: assessment.publicId,
      pdfReady: Boolean(filePath),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
