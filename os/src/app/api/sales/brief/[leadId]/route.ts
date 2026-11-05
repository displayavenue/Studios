import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { accessibleOrgIds } from "@/lib/org";
import { profileFromAnswers } from "@/lib/engines/scoreEngine";
import { calculateLeadScore } from "@/lib/engines/leadScoreEngine";
import { runAiStructured } from "@/lib/ai/aiService";

type Params = { params: Promise<{ leadId: string }> };

const narrativeSchema = z.object({
  briefing: z.string(),
  talkingPoints: z.array(z.string()),
  risks: z.array(z.string()),
  recommendedAsk: z.string(),
});

export async function GET(req: Request, { params }: Params) {
  try {
    const { leadId } = await params;
    const session = await requirePermission("lead:read", req);

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        organization: { select: { id: true, name: true, slug: true } },
        assignee: { select: { id: true, name: true, email: true } },
        assessments: { orderBy: { createdAt: "desc" }, take: 1 },
        deals: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });
    if (!lead) return jsonError("Lead not found", 404);

    const orgScope = await accessibleOrgIds(session);
    if (orgScope !== "all" && !orgScope.includes(lead.organizationId)) {
      return jsonError("No access to this lead", 403);
    }

    const assessment = lead.assessments[0] || null;
    const profile = assessment ? profileFromAnswers(assessment.answers) : {};
    const leadScore = calculateLeadScore({
      budget: lead.budget,
      growthScore: lead.growthScore ?? assessment?.growthScore,
      industry: lead.industry,
      location: lead.location,
      website: lead.website,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      pipelineStatus: lead.pipelineStatus,
      utmSource: lead.utmSource,
      utmCampaign: lead.utmCampaign,
    });

    const facts = {
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        industry: lead.industry,
        location: lead.location,
        budget: lead.budget,
        website: lead.website,
        pipelineStatus: lead.pipelineStatus,
        source: lead.source,
        utms: {
          source: lead.utmSource,
          medium: lead.utmMedium,
          campaign: lead.utmCampaign,
        },
        leadScore: lead.leadScore ?? leadScore.score,
        leadGrade: lead.leadGrade ?? leadScore.grade,
        growthScore: lead.growthScore ?? assessment?.growthScore ?? null,
      },
      assessment: assessment
        ? {
            publicId: assessment.publicId,
            status: assessment.status,
            growthScore: assessment.growthScore,
            biggestOpportunity: assessment.biggestOpportunity,
            recommendedChannels: assessment.recommendedChannels,
            unlocked: assessment.unlocked,
            pricingResult: assessment.pricingResult,
            roiResult: assessment.roiResult,
          }
        : null,
      profile,
      deals: lead.deals,
      scoreBreakdown: leadScore.breakdown,
    };

    const url = new URL(req.url);
    const withAi = url.searchParams.get("ai") !== "0";

    let narrative = null;
    let aiSource: string | null = null;
    if (withAi) {
      const ai = await runAiStructured<z.infer<typeof narrativeSchema>>({
        organizationId: lead.organizationId,
        assessmentId: assessment?.id,
        feature: "cold_call",
        userPayload: {
          purpose: "sales_brief",
          facts,
        },
        schemaDescription:
          '{ "briefing": string, "talkingPoints": string[], "risks": string[], "recommendedAsk": string }',
        validate: (d) => narrativeSchema.parse(d),
      });
      narrative = ai.data;
      aiSource = ai.source;
    }

    const fallbackNarrative = {
      briefing: `${lead.name}${lead.company ? ` (${lead.company})` : ""} is ${lead.pipelineStatus} with lead grade ${facts.lead.leadGrade}. Growth score ${facts.lead.growthScore ?? "n/a"}.`,
      talkingPoints: [
        assessment?.biggestOpportunity || "Clarify primary growth goal",
        `Budget signal: ${lead.budget != null ? `₹${lead.budget}` : "not provided"}`,
        `Channels: ${(assessment?.recommendedChannels || []).join(", ") || "pending assessment"}`,
      ],
      risks: [
        !lead.email ? "Missing email" : null,
        !lead.phone ? "Missing phone" : null,
        lead.budget != null && lead.budget < 15000 ? "Budget may be below managed-service floor" : null,
      ].filter(Boolean) as string[],
      recommendedAsk: "Book the ₹99 Growth Strategy Call and review Growth360 priorities",
    };

    return jsonOk({
      ...facts,
      narrative: narrative || fallbackNarrative,
      aiSource: narrative ? aiSource : "rules",
    });
  } catch (err) {
    return handleApiError(err);
  }
}
