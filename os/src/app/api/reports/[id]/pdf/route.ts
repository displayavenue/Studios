import fs from "fs";
import { requireOrgAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError } from "@/lib/api";
import { generateMonthlyReportPdf } from "@/lib/pdf/generateMonthlyReport";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    let report = await prisma.report.findUnique({ where: { id } });
    if (!report) return jsonError("Report not found", 404);
    await requireOrgAccess(report.organizationId, "report:read", req);

    if (!report.pdfPath || !fs.existsSync(report.pdfPath)) {
      if (report.type === "monthly" && report.periodStart && report.periodEnd) {
        const regenerated = await generateMonthlyReportPdf({
          organizationId: report.organizationId,
          periodStart: report.periodStart,
          periodEnd: report.periodEnd,
        });
        report = regenerated.report;
      } else {
        return jsonError("PDF not available for this report", 404);
      }
    }

    const buf = fs.readFileSync(report.pdfPath!);
    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${report.id}.pdf"`,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
