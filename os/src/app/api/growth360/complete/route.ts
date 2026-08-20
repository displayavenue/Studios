import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { getDisplayAvenueOrg } from "@/lib/org";
import { completeAssessmentAnalysis } from "@/lib/engines/analysisOrchestrator";
import { calculateLeadScore } from "@/lib/engines/leadScoreEngine";
import { profileFromAnswers } from "@/lib/engines/scoreEngine";
import { triggerWorkflow } from "@/lib/workflows/engine";
import { readSessionFromRequest } from "@/lib/auth";

export const maxDuration = 60;

const schema = z.object({
  assessmentId: z.string().min(1).optional(),
  publicId: z.string().min(1).optional(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const session = await readSessionFromRequest(req);
    const name = body.name || session?.name;
    const email = body.email || session?.email;
    if (!name || !email) {
      return jsonError("Sign in with Google is required before completing Growth360", 401);
    }
    if (!body.assessmentId && !body.publicId) {
      return jsonError("assessmentId or publicId required", 400);
    }

    const assessment = body.assessmentId
      ? await prisma.assessment.findUnique({ where: { id: body.assessmentId } })
      : await prisma.assessment.findUnique({ where: { publicId: body.publicId! } });

    if (!assessment) return jsonError("Assessment not found", 404);

    const da = await getDisplayAvenueOrg();
    const profile = profileFromAnswers(assessment.answers);

    const contactAnswers = {
      ...(assessment.answers && typeof assessment.answers === "object"
        ? (assessment.answers as Record<string, unknown>)
        : {}),
      name,
      email,
      phone: body.phone,
      company: body.company || profile.company,
      website: body.website,
    };

    await prisma.assessment.update({
      where: { id: assessment.id },
      data: { answers: contactAnswers as Prisma.InputJsonValue },
    });

    let leadId = assessment.leadId;
    if (!leadId) {
      const lead = await prisma.lead.create({
        data: {
          organizationId: da.id,
          name,
          email,
          phone: body.phone,
          company: body.company || profile.company || null,
          website: body.website || null,
          industry: profile.industry,
          location: profile.location,
          budget: profile.marketingBudget,
          source: body.source || "growth360",
          utmSource: body.utmSource,
          utmMedium: body.utmMedium,
          utmCampaign: body.utmCampaign,
          utmContent: body.utmContent,
          utmTerm: body.utmTerm,
          landingPage: body.landingPage,
          referrer: body.referrer,
        },
      });
      leadId = lead.id;
      await prisma.assessment.update({
        where: { id: assessment.id },
        data: { leadId, organizationId: assessment.organizationId || da.id },
      });
      await triggerWorkflow({
        event: "lead.created",
        organizationId: da.id,
        entityType: "lead",
        entityId: lead.id,
        payload: { source: "growth360", assessmentId: assessment.id },
      });
    } else {
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          name,
          email,
          phone: body.phone ?? undefined,
          company: body.company || profile.company || undefined,
          website: body.website ?? undefined,
          industry: profile.industry ?? undefined,
          location: profile.location ?? undefined,
          budget: profile.marketingBudget ?? undefined,
          utmSource: body.utmSource ?? undefined,
          utmMedium: body.utmMedium ?? undefined,
          utmCampaign: body.utmCampaign ?? undefined,
          utmContent: body.utmContent ?? undefined,
          utmTerm: body.utmTerm ?? undefined,
          landingPage: body.landingPage ?? undefined,
          referrer: body.referrer ?? undefined,
        },
      });
    }

    const result = await completeAssessmentAnalysis(assessment.id);

    const lead = await prisma.lead.findUnique({ where: { id: leadId! } });
    let leadScore = null;
    if (lead) {
      leadScore = calculateLeadScore({
        budget: lead.budget,
        growthScore: result.growthScore,
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
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          growthScore: result.growthScore,
          leadScore: leadScore.score,
          leadGrade: leadScore.grade,
        },
      });
      if (lead.pipelineStatus === "QUALIFIED" || leadScore.score >= 65) {
        await triggerWorkflow({
          event: "lead.qualified",
          organizationId: lead.organizationId,
          entityType: "lead",
          entityId: lead.id,
        });
      }
    }

    await triggerWorkflow({
      event: "assessment.completed",
      organizationId: assessment.organizationId || da.id,
      entityType: "assessment",
      entityId: assessment.id,
      payload: { publicId: assessment.publicId, leadId },
    });

    return jsonOk({
      publicId: assessment.publicId,
      assessmentId: assessment.id,
      leadId,
      growthScore: result.growthScore,
      leadScore,
      biggestOpportunity: result.biggestOpportunity,
      recommendedChannels: result.recommendedChannels,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
