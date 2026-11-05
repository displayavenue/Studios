import { prisma } from "../db";
import type { AssessmentProfile } from "./scoreEngine";
import { slugify } from "./slugify";

export type MatchedCompetitor = {
  id: string;
  name: string;
  website: string | null;
  city: string | null;
  description: string | null;
  businessType: string | null;
  industry: string | null;
  location: string | null;
  scores: {
    digitalScore: number;
    marketingScore: number;
    seoScore: number;
    socialScore: number;
    overallScore: number;
  };
};

/**
 * Match competitors from the Competitor catalog only.
 * Returns an empty list when no records exist — never fabricates peers.
 */
export async function matchCompetitors(
  profile: AssessmentProfile,
  limit = 5,
): Promise<MatchedCompetitor[]> {
  const industrySlug = slugify(profile.industry || "");
  const locationSlug = slugify(profile.location || "");

  const industry = industrySlug
    ? await prisma.industry.findFirst({
        where: {
          OR: [
            { slug: industrySlug },
            { name: { equals: profile.industry || "", mode: "insensitive" } },
          ],
        },
      })
    : null;
  const location = locationSlug
    ? await prisma.location.findFirst({
        where: {
          OR: [
            { slug: locationSlug },
            { name: { equals: profile.location || "", mode: "insensitive" } },
          ],
        },
      })
    : null;

  let competitors = await prisma.competitor.findMany({
    where: {
      isActive: true,
      ...(industry ? { industryId: industry.id } : {}),
      ...(location ? { locationId: location.id } : {}),
    },
    include: {
      scores: true,
      industry: true,
      location: true,
    },
    take: 50,
  });

  // If industry+location was too narrow, widen to industry-only (still real DB rows only)
  if (competitors.length < limit && industry) {
    const more = await prisma.competitor.findMany({
      where: {
        isActive: true,
        industryId: industry.id,
        id: { notIn: competitors.map((c) => c.id) },
      },
      include: { scores: true, industry: true, location: true },
      take: limit * 2,
    });
    competitors = [...competitors, ...more];
  }

  // Do NOT invent competitors when catalog is empty — empty list is OK
  if (competitors.length === 0) return [];

  const ranked = competitors
    .map((c) => ({
      id: c.id,
      name: c.name,
      website: c.website,
      city: c.city,
      description: c.description,
      businessType: c.businessType,
      industry: c.industry?.name || null,
      location: c.location?.name || c.city || null,
      scores: {
        digitalScore: c.scores?.digitalScore ?? 0,
        marketingScore: c.scores?.marketingScore ?? 0,
        seoScore: c.scores?.seoScore ?? 0,
        socialScore: c.scores?.socialScore ?? 0,
        overallScore: c.scores?.overallScore ?? 0,
      },
      _rank:
        (c.scores?.overallScore ?? 0) +
        (industry && c.industryId === industry.id ? 20 : 0) +
        (location && c.locationId === location.id ? 15 : 0),
    }))
    .sort((a, b) => b._rank - a._rank)
    .slice(0, limit)
    .map((row) => {
      const { _rank: _ignored, ...rest } = row;
      void _ignored;
      return rest;
    });

  return ranked;
}

export function competitiveGaps(
  yourScore: number,
  competitors: MatchedCompetitor[],
): string[] {
  if (!competitors.length) {
    return [
      "Limited comparable competitor data in this market segment",
      "Opportunity to define category leadership early",
      "Focus on measurable digital acquisition before rivals scale",
    ];
  }
  const avg =
    competitors.reduce((s, c) => s + c.scores.overallScore, 0) / competitors.length;
  const avgDigital =
    competitors.reduce((s, c) => s + c.scores.digitalScore, 0) / competitors.length;
  const avgMarketing =
    competitors.reduce((s, c) => s + c.scores.marketingScore, 0) / competitors.length;
  const gaps: string[] = [];

  if (yourScore < avg) {
    gaps.push("Your overall growth readiness trails the competitor average in this dataset");
  } else {
    gaps.push("You can press a digital advantage before competitors close the gap");
  }
  if (avgDigital > yourScore) {
    gaps.push("Several competitors show stronger digital presence scores in the supplied data");
  } else {
    gaps.push("Competitors appear weaker digitally — consistent content and ads can widen the lead");
  }
  if (avgMarketing >= 60) {
    gaps.push("Paid and outbound marketing intensity among peers suggests room for sharper positioning");
  } else {
    gaps.push("Peer marketing scores leave space to own demand with disciplined spend");
  }
  return gaps.slice(0, 3);
}

/** Snapshot matched competitors into Assessment.answers JSON for offline PDF / unlock flows. */
export function competitorSnapshotForAnswers(competitors: MatchedCompetitor[]) {
  return {
    matchedAt: new Date().toISOString(),
    competitors: competitors.map((c) => ({
      id: c.id,
      name: c.name,
      website: c.website,
      city: c.city,
      industry: c.industry,
      location: c.location,
      scores: c.scores,
    })),
  };
}
