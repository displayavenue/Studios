import { prisma } from "../db";
import {
  calculateGrowthScore,
  biggestOpportunity,
  type AssessmentProfile,
  type ScoreBreakdown,
} from "../engines/scoreEngine";
import { recommendChannels, channelFallbackExplanations } from "../engines/strategyEngine";
import { matchCompetitors, competitiveGaps } from "../engines/competitorEngine";
import { calculatePricing } from "../engines/pricingEngine";
import { calculateRoi } from "../engines/roiEngine";
import { build90DayPlan } from "../engines/planEngine";
import { buildColdCallFallback } from "../engines/coldCallEngine";
import {
  runAiStructured,
  businessAnalysisSchema,
  strategySchema,
  competitorAnalysisSchema,
  coldCallSchema,
  planNarrativeSchema,
} from "../ai/aiService";
import { z } from "zod";

export async function completeAssessmentAnalysis(assessmentId: string) {
  const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment) throw new Error("Assessment not found");

  const profile: AssessmentProfile = {
    company: assessment.company,
    industry: assessment.industry,
    businessType: assessment.businessType,
    product: assessment.product,
    location: assessment.location,
    targetCustomer: assessment.targetCustomer,
    avgCustomerValue: assessment.avgCustomerValue,
    marketingBudget: assessment.marketingBudget,
    currentChannels: assessment.currentChannels,
    growthGoal: assessment.growthGoal,
  };

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

  // AI layer — never mutates deterministic numbers
  const businessAi = await runAiStructured<z.infer<typeof businessAnalysisSchema>>({
    assessmentId,
    useCase: "business_analysis",
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
    assessmentId,
    useCase: "strategy",
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
    assessmentId,
    useCase: "competitor_analysis",
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
    assessmentId,
    useCase: "cold_call",
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
    assessmentId,
    useCase: "plan_90_day",
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

  await prisma.assessment.update({
    where: { id: assessmentId },
    data: {
      status: "completed",
      completedAt: new Date(),
      growthScore: scoreBreakdown.total,
      scoreBreakdown,
      biggestOpportunity: opportunity,
      recommendedChannels: channels,
      selectedCompetitorIds: competitors.map((c) => c.id),
      pricingResult: pricing,
      roiResult: roi,
      plan90Day: plan,
    },
  });

  await prisma.analysis.upsert({
    where: { assessmentId },
    create: {
      assessmentId,
      executiveSummary: analysisData.executiveSummary,
      businessOpportunity: analysisData.businessOpportunity,
      keyChallenges: analysisData.keyChallenges,
      keyOpportunities: analysisData.keyOpportunities,
      strategicPriorities: analysisData.strategicPriorities,
      channelExplanations: analysisData.channelExplanations,
      competitorSummary: analysisData.competitorSummary,
      coldCallScript: analysisData.coldCallScript,
      planNarrative: analysisData.planNarrative,
      source: analysisData.source,
    },
    update: {
      executiveSummary: analysisData.executiveSummary,
      businessOpportunity: analysisData.businessOpportunity,
      keyChallenges: analysisData.keyChallenges,
      keyOpportunities: analysisData.keyOpportunities,
      strategicPriorities: analysisData.strategicPriorities,
      channelExplanations: analysisData.channelExplanations,
      competitorSummary: analysisData.competitorSummary,
      coldCallScript: analysisData.coldCallScript,
      planNarrative: analysisData.planNarrative,
      source: analysisData.source,
    },
  });

  if (assessment.contactEmail && assessment.contactName) {
    await prisma.lead.upsert({
      where: { assessmentId },
      create: {
        assessmentId,
        name: assessment.contactName,
        email: assessment.contactEmail,
        whatsapp: assessment.contactWhatsapp || "",
        company: assessment.company,
        industry: assessment.industry,
        location: assessment.location,
        status: "qualified",
        qualification: scoreBreakdown.total >= 60 ? "hot" : "warm",
      },
      update: {
        name: assessment.contactName,
        email: assessment.contactEmail,
        whatsapp: assessment.contactWhatsapp || "",
        company: assessment.company,
        industry: assessment.industry,
        location: assessment.location,
        status: "qualified",
      },
    });
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
