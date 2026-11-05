import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

type Params = { params: Promise<{ publicId: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { publicId } = await params;
    const assessment = await prisma.assessment.findUnique({
      where: { publicId },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            industry: true,
            location: true,
            leadScore: true,
            leadGrade: true,
            pipelineStatus: true,
          },
        },
      },
    });
    if (!assessment) return jsonError("Assessment not found", 404);

    const competitors =
      assessment.selectedCompetitorIds.length > 0
        ? await prisma.competitor.findMany({
            where: { id: { in: assessment.selectedCompetitorIds } },
            include: { scores: true, industry: true, location: true },
          })
        : [];

    const free = {
      publicId: assessment.publicId,
      status: assessment.status,
      unlocked: assessment.unlocked,
      growthScore: assessment.growthScore,
      biggestOpportunity: assessment.biggestOpportunity,
      recommendedChannels: assessment.recommendedChannels,
      completedAt: assessment.completedAt,
      lead: assessment.lead
        ? {
            name: assessment.lead.name,
            company: assessment.lead.company,
            industry: assessment.lead.industry,
            location: assessment.lead.location,
          }
        : null,
      teaser: {
        competitorCount: competitors.length,
        hasPricing: Boolean(assessment.pricingResult),
        hasRoi: Boolean(assessment.roiResult),
        hasPlan: Boolean(assessment.plan90Day),
      },
    };

    if (!assessment.unlocked) {
      return jsonOk({ tier: "free" as const, ...free });
    }

    return jsonOk({
      tier: "full" as const,
      ...free,
      scoreBreakdown: assessment.scoreBreakdown,
      pricingResult: assessment.pricingResult,
      roiResult: assessment.roiResult,
      plan90Day: assessment.plan90Day,
      analysis: assessment.analysis,
      competitors: competitors.map((c) => ({
        id: c.id,
        name: c.name,
        website: c.website,
        city: c.city || c.location?.name || null,
        industry: c.industry?.name || null,
        scores: c.scores,
      })),
      lead: assessment.lead,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
