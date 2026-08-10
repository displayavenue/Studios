import fs from "fs";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError } from "@/lib/api";
import { generateReportPdf } from "@/lib/pdf/generateReport";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    let report =
      (await prisma.report.findUnique({
        where: { id },
        include: { assessment: true },
      })) ||
      (await prisma.report.findFirst({
        where: { assessment: { publicId: id } },
        include: { assessment: true },
      }));

    if (!report) {
      const assessment = await prisma.assessment.findFirst({
        where: { OR: [{ publicId: id }, { id }] },
      });
      if (!assessment) return jsonError("Report not found", 404);
      if (!assessment.unlocked) return jsonError("Full report locked", 402);
      const generated = await generateReportPdf(assessment.id);
      report = await prisma.report.findUnique({
        where: { id: generated.report.id },
        include: { assessment: true },
      });
    }

    if (!report?.assessment.unlocked) return jsonError("Full report locked", 402);
    if (!report.pdfPath || !fs.existsSync(report.pdfPath)) {
      await generateReportPdf(report.assessmentId);
      report = await prisma.report.findUnique({
        where: { id: report.id },
        include: { assessment: true },
      });
    }

    await prisma.report.update({
      where: { id: report!.id },
      data: { downloadCount: { increment: 1 } },
    });

    const buffer = fs.readFileSync(report!.pdfPath!);
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Growth360-${report!.assessment.publicId}.pdf"`,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
