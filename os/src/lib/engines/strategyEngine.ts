import { prisma } from "../db";
import type { AssessmentProfile } from "./scoreEngine";
import { slugify } from "./slugify";

const DEFAULT_CHANNELS = ["google-ads", "meta-ads", "seo", "landing-page", "crm"];

/** Rule-based channel recommendations — empty DB falls back to defaults. */
export async function recommendChannels(profile: AssessmentProfile): Promise<string[]> {
  const budget = profile.marketingBudget || 0;
  const industrySlug = slugify(profile.industry || "");
  const goal = profile.growthGoal || undefined;

  const rules = await prisma.strategyRule.findMany({
    where: { isActive: true },
    orderBy: { priority: "desc" },
  });

  const match = rules.find(
    (r) =>
      (!r.industrySlug || r.industrySlug === industrySlug) &&
      (!r.growthGoal || r.growthGoal === goal) &&
      (r.budgetMin == null || budget >= r.budgetMin) &&
      (r.budgetMax == null || budget <= r.budgetMax),
  );

  let channels = match?.channels?.length ? [...match.channels] : [...DEFAULT_CHANNELS];

  if (goal === "more-leads" && !channels.includes("google-ads")) channels.unshift("google-ads");
  if (goal === "brand-growth" && !channels.includes("meta-ads")) channels.push("meta-ads");
  if (goal === "new-markets" && !channels.includes("cold-calling")) channels.push("cold-calling");
  if (budget >= 40000 && !channels.includes("crm")) channels.push("crm");

  const active = await prisma.marketingChannel.findMany({
    where: { isActive: true, slug: { in: channels } },
    select: { slug: true },
  });
  const activeSet = new Set(active.map((c) => c.slug));
  channels = channels.filter((c) => activeSet.has(c) || active.length === 0);

  return Array.from(new Set(channels)).slice(0, 6);
}

export function channelFallbackExplanations(channels: string[]) {
  const map: Record<string, { explanation: string; role: string; priority: string; guidance: string }> = {
    "google-ads": {
      explanation: "Captures high-intent search demand from buyers actively looking for your offer.",
      role: "Primary demand capture",
      priority: "High",
      guidance: "Start with exact-match keywords around your core product and location.",
    },
    "meta-ads": {
      explanation: "Builds awareness and retargets warm audiences across Facebook and Instagram.",
      role: "Demand creation & retargeting",
      priority: "High",
      guidance: "Use creative testing with clear offers and strong local relevance.",
    },
    seo: {
      explanation: "Compounds organic visibility for category and location searches over time.",
      role: "Long-term pipeline",
      priority: "Medium",
      guidance: "Prioritize service pages, Google Business Profile, and technical basics.",
    },
    "landing-page": {
      explanation: "Converts paid and organic traffic with a focused message and clear CTA.",
      role: "Conversion layer",
      priority: "High",
      guidance: "One offer, one CTA, mobile-first layout, and WhatsApp/call options.",
    },
    crm: {
      explanation: "Prevents lead leakage and improves follow-up consistency across the team.",
      role: "Sales enablement",
      priority: "Medium",
      guidance: "Track every enquiry, set response SLAs, and automate reminders.",
    },
    "cold-calling": {
      explanation: "Creates outbound conversations with decision makers in your ICP.",
      role: "Outbound acceleration",
      priority: "Medium",
      guidance: "Use a short script, qualify quickly, and book strategy conversations.",
    },
  };

  return channels.map((slug) => ({
    channel: slug,
    ...(map[slug] || {
      explanation: "Supports your growth mix based on your goals and budget.",
      role: "Supporting channel",
      priority: "Medium",
      guidance: "Implement with clear KPIs and weekly review.",
    }),
  }));
}
