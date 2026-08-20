import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const report =
      (await prisma.report.findUnique({
        where: { id },
        include: { sections: true, assessment: { include: { analysis: true } } },
      })) ||
      (await prisma.report.findFirst({
        where: { assessment: { publicId: id } },
        include: { sections: true, assessment: { include: { analysis: true } } },
      }));
    if (!report) return jsonError("Report not found", 404);
    if (!report.assessment.unlocked) {
      return jsonError("Full report locked", 402);
    }
    return jsonOk(report);
  } catch (err) {
    return handleApiError(err);
  }
}
