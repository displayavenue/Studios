export type PlatformFitInput = {
  budget?: number | null;
  growthGoal?: string | null;
  industry?: string | null;
  currentChannels?: string[];
};

export type PlatformRecommendation = {
  platform: string;
  slug: string;
  fitScore: number;
  status: "primary" | "recommended" | "optional";
  rationale: string;
  automationReady: boolean;
};

/**
 * Deterministic platform fit scores.
 * Meta Ads is the only automation-ready channel in OS today.
 * Others are recommendation-only — never invent live metrics.
 */
export function recommendPlatforms(input: PlatformFitInput): PlatformRecommendation[] {
  const budget = input.budget || 0;
  const goal = (input.growthGoal || "").toLowerCase();
  const channels = (input.currentChannels || []).map((c) => c.toLowerCase());

  let meta = 72;
  let google = 58;
  let linkedin = 40;
  let youtube = 35;
  let seo = 48;

  if (budget >= 100000) {
    meta += 15;
    google += 18;
    youtube += 12;
  } else if (budget >= 50000) {
    meta += 12;
    google += 10;
  } else if (budget >= 25000) {
    meta += 8;
    google += 6;
  } else if (budget > 0 && budget < 15000) {
    meta += 4;
    google -= 5;
    linkedin -= 8;
  }

  if (/lead|enquiry|inquiry|demo/.test(goal)) {
    meta += 12;
    google += 10;
  }
  if (/sale|revenue|roas|conversion/.test(goal)) {
    meta += 10;
    google += 14;
  }
  if (/brand|awareness|reach/.test(goal)) {
    meta += 8;
    youtube += 18;
    seo += 6;
  }
  if (/b2b|enterprise|linkedin/.test(goal) || /b2b|saas|software/.test(input.industry || "")) {
    linkedin += 25;
    google += 8;
  }
  if (/local|store|clinic|restaurant/.test(input.industry || "")) {
    meta += 10;
    google += 12;
    linkedin -= 10;
  }

  if (channels.some((c) => c.includes("meta") || c.includes("facebook") || c.includes("instagram"))) {
    meta += 5;
  }
  if (channels.some((c) => c.includes("google"))) {
    google += 5;
  }
  if (channels.some((c) => c.includes("seo"))) {
    seo += 8;
  }

  const rows: PlatformRecommendation[] = [
    {
      platform: "Meta Ads",
      slug: "meta",
      fitScore: clamp(meta),
      status: "primary",
      rationale:
        "Highest fit for demand generation with DisplayAvenue OS automation path once Meta credentials are approved.",
      automationReady: true,
    },
    {
      platform: "Google Ads",
      slug: "google",
      fitScore: clamp(google),
      status: "recommended",
      rationale: "Strong intent capture; recommendation-only until Google Ads adapter ships.",
      automationReady: false,
    },
    {
      platform: "LinkedIn Ads",
      slug: "linkedin",
      fitScore: clamp(linkedin),
      status: "optional",
      rationale: "Useful for B2B / high-ticket audiences; recommendation-only.",
      automationReady: false,
    },
    {
      platform: "YouTube Ads",
      slug: "youtube",
      fitScore: clamp(youtube),
      status: "optional",
      rationale: "Brand and consideration support; recommendation-only.",
      automationReady: false,
    },
    {
      platform: "SEO / Content",
      slug: "seo",
      fitScore: clamp(seo),
      status: "recommended",
      rationale: "Compounding organic demand; recommendation-only (no fabricated rankings).",
      automationReady: false,
    },
  ];

  return rows.sort((a, b) => b.fitScore - a.fitScore);
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n * 10) / 10));
}
