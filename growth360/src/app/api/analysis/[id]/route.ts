import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const assessment =
      (await prisma.assessment.findUnique({
        where: { publicId: id },
        include: { analysis: true, report: true },
      })) ||
      (await prisma.assessment.findUnique({
        where: { id },
        include: { analysis: true, report: true },
      }));

    if (!assessment) return jsonError("Analysis not found", 404);

    const competitors = await prisma.competitor.findMany({
      where: { id: { in: assessment.selectedCompetitorIds } },
      include: { scores: true, industry: true, location: true },
    });

    const free = {
      publicId: assessment.publicId,
      assessmentId: assessment.id,
      company: assessment.company,
      industry: assessment.industry,
      location: assessment.location,
      growthScore: assessment.growthScore,
      scoreBreakdown: assessment.scoreBreakdown,
      biggestOpportunity: assessment.biggestOpportunity,
      recommendedChannels: assessment.recommendedChannels,
      competitors: competitors.map((c) => ({
        id: c.id,
        name: c.name,
        city: c.city || c.location?.name,
        industry: c.industry?.name,
        scores: c.scores,
        source: "database" as const,
      })),
      competitorSummary: assessment.analysis?.competitorSummary,
      roiPreview: assessment.roiResult,
      unlocked: assessment.unlocked,
      aiStatusMessage:
        assessment.analysis?.source === "mixed" || assessment.analysis?.source === "rules"
          ? "Your core Growth360 analysis is ready. Some personalized recommendations will be available shortly."
          : null,
    };

    const full = assessment.unlocked
      ? {
          analysis: assessment.analysis,
          pricing: assessment.pricingResult,
          roi: assessment.roiResult,
          plan90Day: assessment.plan90Day,
          report: assessment.report,
        }
      : null;

    return jsonOk({ free, full });
  } catch (err) {
    return handleApiError(err);
  }
}
