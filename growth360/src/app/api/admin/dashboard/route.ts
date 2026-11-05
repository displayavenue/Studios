import { requireAdmin } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const [
      leads,
      completedAssessments,
      reports,
      pdfDownloads,
      payments,
      bookings,
      qualifiedLeads,
      converted,
      aiSuccess,
      aiFailed,
      aiAgg,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.assessment.count({ where: { status: "completed" } }),
      prisma.report.count(),
      prisma.report.aggregate({ _sum: { downloadCount: true } }),
      prisma.payment.count({ where: { status: "paid", purpose: "strategy_call" } }),
      prisma.booking.count(),
      prisma.lead.count({ where: { status: { in: ["qualified", "call_booked"] } } }),
      prisma.lead.count({ where: { status: "converted" } }),
      prisma.aiGeneration.count({ where: { status: "success" } }),
      prisma.aiGeneration.count({ where: { status: "failed" } }),
      prisma.aiGeneration.aggregate({
        where: { status: "success" },
        _sum: { estimatedCostUsd: true, inputTokens: true, outputTokens: true },
      }),
    ]);

    const aiCost = aiAgg._sum.estimatedCostUsd || 0;
    const aiReports = await prisma.aiGeneration.groupBy({
      by: ["assessmentId"],
      where: { status: "success", assessmentId: { not: null } },
    });

    return jsonOk({
      leads,
      completedAssessments,
      reports,
      pdfDownloads: pdfDownloads._sum.downloadCount || 0,
      payments99: payments,
      callsBooked: bookings,
      qualifiedLeads,
      convertedClients: converted,
      ai: {
        requests: aiSuccess + aiFailed,
        successful: aiSuccess,
        failed: aiFailed,
        tokensUsed: (aiAgg._sum.inputTokens || 0) + (aiAgg._sum.outputTokens || 0),
        estimatedCostUsd: aiCost,
        reportsGenerated: aiReports.length,
        avgCostPerReport: aiReports.length ? aiCost / aiReports.length : 0,
        avgCostPerLead: leads ? aiCost / leads : 0,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
