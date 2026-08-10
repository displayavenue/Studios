import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import {
  calculateGrowthScore,
  biggestOpportunity,
  profileFromAnswers,
  type ScoreBreakdown,
} from "./scoreEngine";
import { recommendChannels, channelFallbackExplanations } from "./strategyEngine";
import {
  matchCompetitors,
  competitiveGaps,
  competitorSnapshotForAnswers,
} from "./competitorEngine";
import { calculatePricing } from "./pricingEngine";
import { calculateRoi } from "./roiEngine";
import { build90DayPlan } from "./planEngine";
import { buildColdCallFallback } from "./coldCallEngine";
import { calculateLeadScore } from "./leadScoreEngine";
import {
  runAiStructured,
  businessAnalysisSchema,
  strategySchema,
  competitorAnalysisSchema,
  coldCallSchema,
  planNarrativeSchema,
} from "../ai/aiService";
import { z } from "zod";

/**
 * Complete Growth360 analysis for an OS Assessment.
 * Deterministic engines own all numbers; AI only narrates.
 */
export async function completeAssessmentAnalysis(assessmentId: string) {
  const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment) throw new Error("Assessment not found");

  const profile = profileFromAnswers(assessment.answers);
  const organizationId = assessment.organizationId || undefined;

  const scoreBreakdown: ScoreBreakdown = calculateGrowthScore(profile);
  const opportunity = biggestOpportunity(scoreBreakdown, profile);
  const channels = await recommendChannels(profile);
  const competitors = await matchCompetitors(profile, 5);
  const gaps = competitiveGaps(scoreBreakdown.total, competitors);
  const pricing = await calculatePricing(profile);
  const roi = await calculateRoi(profile, pricing);
  const plan = await build90DayPlan(profile, channels);
  const coldCallFallback = buildColdCallFallback(profile, competitors);
  const channelFallback = channelFallbackExplanations(channels);

  const businessAi = await runAiStructured<z.infer<typeof businessAnalysisSchema>>({
    organizationId,
    assessmentId,
    feature: "business_analysis",
    userPayload: {
      company: profile.company,
      industry: profile.industry,
      businessType: profile.businessType,
      product: profile.product,
      location: profile.location,
      targetCustomer: profile.targetCustomer,
      averageCustomerValue: profile.avgCustomerValue,
      marketingBudget: profile.marketingBudget,
      currentMarketingChannels: profile.currentChannels,
      growthGoal: profile.growthGoal,
      growthScore: scoreBreakdown.total,
      scoreBreakdown,
      biggestOpportunity: opportunity,
    },
    schemaDescription:
      '{ "executiveSummary": string, "businessOpportunity": string, "keyChallenges": string[], "keyOpportunities": string[], "strategicPriorities": string[] }',
    validate: (d) => businessAnalysisSchema.parse(d),
  });

  const strategyAi = await runAiStructured<z.infer<typeof strategySchema>>({
    organizationId,
    assessmentId,
    feature: "strategy",
    userPayload: {
      selectedChannels: channels,
      industry: profile.industry,
      businessGoals: profile.growthGoal,
      customerProfile: profile.targetCustomer,
      location: profile.location,
      budget: profile.marketingBudget,
      growthScore: scoreBreakdown.total,
    },
    schemaDescription:
      '{ "channels": [{ "channel": string, "explanation": string, "role": string, "priority": string, "guidance": string }] }',
    validate: (d) => strategySchema.parse(d),
  });

  const competitorAi = await runAiStructured<z.infer<typeof competitorAnalysisSchema>>({
    organizationId,
    assessmentId,
    feature: "competitor_analysis",
    userPayload: {
      client: {
        company: profile.company,
        industry: profile.industry,
        location: profile.location,
        growthScore: scoreBreakdown.total,
      },
      competitors,
      gaps,
    },
    schemaDescription:
      '{ "competitiveSummary": string, "competitiveAdvantages": string[], "competitiveWeaknesses": string[], "opportunities": string[], "recommendedActions": string[] }',
    validate: (d) => competitorAnalysisSchema.parse(d),
  });

  const coldAi = await runAiStructured<z.infer<typeof coldCallSchema>>({
    organizationId,
    assessmentId,
    feature: "cold_call",
    userPayload: {
      industry: profile.industry,
      product: profile.product,
      company: profile.company,
      targetDecisionMaker: "Owner / Marketing Head",
      businessObjective: profile.growthGoal,
      competitorContext: competitors.map((c) => ({
        name: c.name,
        overallScore: c.scores.overallScore,
        city: c.city,
      })),
      recommendedService: "DisplayAvenue Growth360 Strategy Call",
    },
    schemaDescription:
      '{ "opening": string, "discoveryQuestions": string[], "qualificationQuestions": string[], "objectionHandling": [{ "objection": string, "response": string }], "meetingBooking": string }',
    validate: (d) => coldCallSchema.parse(d),
  });

  const planAi = await runAiStructured<z.infer<typeof planNarrativeSchema>>({
    organizationId,
    assessmentId,
    feature: "plan_90_day",
    userPayload: {
      company: profile.company,
      industry: profile.industry,
      recommendedChannels: channels,
      plan,
    },
    schemaDescription:
      '{ "overview": string, "phase1Narrative": string, "phase2Narrative": string, "phase3Narrative": string }',
    validate: (d) => planNarrativeSchema.parse(d),
  });

  const aiPartial =
    !businessAi.data ||
    !strategyAi.data ||
    !competitorAi.data ||
    businessAi.source === "fallback" ||
    strategyAi.source === "fallback" ||
    competitorAi.source === "fallback";

  const analysisData = {
    executiveSummary:
      businessAi.data?.executiveSummary ||
      `${profile.company || "Your business"} has a Growth Score of ${scoreBreakdown.total}. ${opportunity}.`,
    businessOpportunity:
      businessAi.data?.businessOpportunity ||
      `There is a clear path to improve demand generation for ${profile.product || "your offer"} in ${profile.location || "your market"}.`,
    keyChallenges: businessAi.data?.keyChallenges || [
      "Inconsistent lead flow",
      "Underused digital channels",
      "Limited competitive visibility",
    ],
    keyOpportunities: businessAi.data?.keyOpportunities || [
      opportunity,
      "Structured paid acquisition",
      "Stronger conversion and follow-up",
    ],
    strategicPriorities: businessAi.data?.strategicPriorities || [
      "Clarify offer and ICP",
      "Activate priority channels",
      "Measure ROI weekly",
    ],
    channelExplanations: strategyAi.data?.channels || channelFallback,
    competitorSummary: competitorAi.data || {
      competitiveSummary: `We identified ${competitors.length} businesses competing for similar customers or market.`,
      competitiveAdvantages: gaps.slice(0, 2),
      competitiveWeaknesses: ["Limited peer data depth in some score dimensions"],
      opportunities: gaps,
      recommendedActions: [
        "Focus spend on highest-intent channels",
        "Improve landing page conversion",
        "Book a strategy review to prioritize execution",
      ],
    },
    coldCallScript: coldAi.data || coldCallFallback,
    planNarrative: planAi.data || {
      overview: `A focused 90-day plan for ${profile.company || "your business"} using only recommended channels.`,
      phase1Narrative: "Build foundations, tracking, and launch priority channels.",
      phase2Narrative: "Scale what works and tighten follow-up.",
      phase3Narrative: "Optimize CPL, conversion, and prepare the next quarter.",
    },
    source: aiPartial ? "mixed" : businessAi.source === "ai" ? "ai" : "rules",
    aiStatusMessage: aiPartial
      ? "Your core Growth360 analysis is ready. Some personalized recommendations will be available shortly."
      : null,
  };

  const prevAnswers =
    assessment.answers && typeof assessment.answers === "object"
      ? (assessment.answers as Record<string, unknown>)
      : {};

  await prisma.assessment.update({
    where: { id: assessmentId },
    data: {
      status: "completed",
      completedAt: new Date(),
      growthScore: scoreBreakdown.total,
      scoreBreakdown: scoreBreakdown as unknown as Prisma.InputJsonValue,
      biggestOpportunity: opportunity,
      recommendedChannels: channels,
      selectedCompetitorIds: competitors.map((c) => c.id),
      pricingResult: pricing as unknown as Prisma.InputJsonValue,
      roiResult: roi as unknown as Prisma.InputJsonValue,
      plan90Day: plan as unknown as Prisma.InputJsonValue,
      analysis: analysisData as unknown as Prisma.InputJsonValue,
      answers: {
        ...prevAnswers,
        competitorSnapshot: competitorSnapshotForAnswers(competitors),
      } as Prisma.InputJsonValue,
    },
  });

  if (assessment.leadId) {
    const lead = await prisma.lead.findUnique({ where: { id: assessment.leadId } });
    if (lead) {
      const leadScore = calculateLeadScore({
        budget: lead.budget ?? profile.marketingBudget,
        growthScore: scoreBreakdown.total,
        industry: lead.industry ?? profile.industry,
        location: lead.location ?? profile.location,
        website: lead.website,
        email: lead.email,
        phone: lead.phone,
        company: lead.company ?? profile.company,
        source: lead.source,
        pipelineStatus: lead.pipelineStatus,
        utmSource: lead.utmSource,
        utmCampaign: lead.utmCampaign,
      });
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          growthScore: scoreBreakdown.total,
          leadScore: leadScore.score,
          leadGrade: leadScore.grade,
          pipelineStatus:
            lead.pipelineStatus === "NEW" || lead.pipelineStatus === "CONTACTED"
              ? "QUALIFIED"
              : lead.pipelineStatus,
        },
      });
    }
  }

  return {
    assessmentId,
    publicId: assessment.publicId,
    growthScore: scoreBreakdown.total,
    scoreBreakdown,
    biggestOpportunity: opportunity,
    recommendedChannels: channels,
    competitors,
    gaps,
    pricing,
    roi,
    plan,
    analysis: analysisData,
    aiStatusMessage: analysisData.aiStatusMessage,
  };
}
