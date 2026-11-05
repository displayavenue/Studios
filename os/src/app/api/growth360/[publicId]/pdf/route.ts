import fs from "fs";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError } from "@/lib/api";
import { generateGrowth360ReportPdf } from "@/lib/pdf/generateGrowth360Report";

type Params = { params: Promise<{ publicId: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { publicId } = await params;
    const assessment = await prisma.assessment.findUnique({ where: { publicId } });
    if (!assessment) return jsonError("Assessment not found", 404);
    if (assessment.status !== "completed") {
      return jsonError("Assessment not completed yet", 409);
    }

    const { filePath } = await generateGrowth360ReportPdf(assessment.id);
    const buf = fs.readFileSync(filePath);

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="growth360-${publicId}.pdf"`,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
