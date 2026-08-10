import { z } from "zod";
import { requireOrgAccess } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { generateMonthlyReportPdf } from "@/lib/pdf/generateMonthlyReport";
import { writeAudit } from "@/lib/audit";

const schema = z.object({
  organizationId: z.string().min(1),
  periodStart: z.string().datetime().optional(),
  periodEnd: z.string().datetime().optional(),
  year: z.number().int().optional(),
  month: z.number().int().min(1).max(12).optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const { session } = await requireOrgAccess(body.organizationId, "report:write", req);

    let periodStart: Date;
    let periodEnd: Date;

    if (body.periodStart && body.periodEnd) {
      periodStart = new Date(body.periodStart);
      periodEnd = new Date(body.periodEnd);
    } else {
      const now = new Date();
      const year = body.year ?? now.getFullYear();
      const month = (body.month ?? now.getMonth() + 1) - 1;
      periodStart = new Date(year, month, 1);
      periodEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
    }

    const result = await generateMonthlyReportPdf({
      organizationId: body.organizationId,
      periodStart,
      periodEnd,
    });

    await writeAudit({
      action: "report.generate",
      userId: session.userId,
      organizationId: body.organizationId,
      entity: "report",
      entityId: result.report.id,
      after: { type: "monthly", periodStart, periodEnd },
    });

    return jsonOk({
      report: result.report,
      filePath: result.filePath,
      clientHealth: result.clientHealth,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
