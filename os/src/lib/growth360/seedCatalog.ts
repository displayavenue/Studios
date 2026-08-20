import { Prisma, PrismaClient } from "@prisma/client";

type Db = PrismaClient;

/**
 * Seed Growth360 catalog data (industries, locations, channels, competitors,
 * pricing/strategy rules, ROI assumptions, plan templates, AI prompts, settings).
 * Safe to call from prisma/seed.ts or admin bootstrap later.
 */
export async function seedGrowth360Catalog(prisma: Db) {
  const industries = [
    ["manufacturing", "Manufacturing"],
    ["healthcare", "Healthcare"],
    ["education", "Education"],
    ["real-estate", "Real Estate"],
    ["retail", "Retail"],
    ["saas", "SaaS / Software"],
    ["professional-services", "Professional Services"],
    ["hospitality", "Hospitality"],
  ] as const;

  for (const [slug, name] of industries) {
    await prisma.industry.upsert({
      where: { slug },
      create: { slug, name },
      update: { name, isActive: true },
    });
  }

  const locations = [
    ["mumbai", "Mumbai", "Maharashtra"],
    ["delhi-ncr", "Delhi NCR", "Delhi"],
    ["bengaluru", "Bengaluru", "Karnataka"],
    ["hyderabad", "Hyderabad", "Telangana"],
    ["chennai", "Chennai", "Tamil Nadu"],
    ["pune", "Pune", "Maharashtra"],
    ["ahmedabad", "Ahmedabad", "Gujarat"],
    ["kolkata", "Kolkata", "West Bengal"],
  ] as const;

  for (const [slug, name, state] of locations) {
    await prisma.location.upsert({
      where: { slug },
      create: { slug, name, state },
      update: { name, state, isActive: true },
    });
  }

  const channels = [
    ["google-ads", "Google Ads", "Search & performance demand"],
    ["meta-ads", "Meta Ads", "Social demand & retargeting"],
    ["seo", "SEO", "Organic visibility"],
    ["landing-page", "Landing Page", "Conversion experience"],
    ["crm", "CRM", "Lead follow-up system"],
    ["cold-calling", "Cold Calling", "Outbound conversations"],
    ["whatsapp", "WhatsApp", "Conversational follow-up"],
    ["email", "Email", "Nurture sequences"],
  ] as const;

  for (const [i, [slug, name, description]] of channels.entries()) {
    await prisma.marketingChannel.upsert({
      where: { slug },
      create: { slug, name, description, sortOrder: i },
      update: { name, description, isActive: true, sortOrder: i },
    });
  }

  const industryRows = await prisma.industry.findMany();
  const locationRows = await prisma.location.findMany();
  const ind = (slug: string) => industryRows.find((i) => i.slug === slug)?.id;
  const loc = (slug: string) => locationRows.find((l) => l.slug === slug)?.id;

  // Catalog peers with internal rating scores — not fabricated financial claims.
  // Production matching returns empty when none exist; seed is optional for demos.
  const competitors = [
    ["Precision Tools India", "manufacturing", "mumbai", "https://example.com/pti", 72, 68, 70, 55],
    ["Metro Fab Solutions", "manufacturing", "pune", "https://example.com/mfs", 65, 60, 62, 48],
    ["Coastal Engineering Co", "manufacturing", "chennai", "https://example.com/cec", 58, 54, 57, 42],
    ["Northline Industrial", "manufacturing", "delhi-ncr", "https://example.com/ni", 70, 66, 68, 50],
    ["Aether Manufacturing Group", "manufacturing", "ahmedabad", "https://example.com/amg", 63, 59, 61, 47],
    ["CareFirst Clinics", "healthcare", "mumbai", "https://example.com/cfc", 78, 74, 72, 80],
    ["CityWell Hospitals", "healthcare", "delhi-ncr", "https://example.com/cwh", 75, 70, 69, 76],
    ["Pulse Diagnostic Centre", "healthcare", "bengaluru", "https://example.com/pdc", 68, 64, 66, 70],
    ["HealPath Medical", "healthcare", "hyderabad", "https://example.com/hpm", 62, 58, 60, 65],
    ["Lotus Multi-Specialty", "healthcare", "chennai", "https://example.com/lms", 71, 67, 65, 73],
    ["BrightPath Academy", "education", "bengaluru", "https://example.com/bpa", 69, 72, 64, 75],
    ["Summit Learning Hub", "education", "pune", "https://example.com/slh", 64, 66, 60, 68],
    ["Vertex Coaching Institute", "education", "delhi-ncr", "https://example.com/vci", 73, 70, 68, 72],
    ["Horizon Skill Center", "education", "hyderabad", "https://example.com/hsc", 60, 58, 55, 62],
    ["Nova EdTech Labs", "education", "mumbai", "https://example.com/nel", 80, 76, 78, 74],
    ["Skyline Homes Realty", "real-estate", "mumbai", "https://example.com/shr", 77, 79, 70, 82],
    ["UrbanNest Properties", "real-estate", "bengaluru", "https://example.com/unp", 74, 76, 68, 78],
    ["Heritage Estates Group", "real-estate", "chennai", "https://example.com/heg", 66, 64, 62, 68],
    ["PrimePlot Developers", "real-estate", "hyderabad", "https://example.com/ppd", 71, 73, 65, 74],
    ["GreenField Realty", "real-estate", "pune", "https://example.com/gfr", 68, 70, 63, 71],
    ["ShopKart Local", "retail", "mumbai", "https://example.com/skl", 70, 72, 60, 76],
    ["BazaarOne Retail", "retail", "delhi-ncr", "https://example.com/bor", 67, 69, 58, 72],
    ["FreshBasket Stores", "retail", "bengaluru", "https://example.com/fbs", 63, 65, 55, 70],
    ["TrendLane Fashion", "retail", "ahmedabad", "https://example.com/tlf", 72, 74, 61, 78],
    ["DailyMart Collective", "retail", "kolkata", "https://example.com/dmc", 58, 60, 52, 64],
    ["CloudForge Softwares", "saas", "bengaluru", "https://example.com/cfs", 85, 80, 84, 78],
    ["Nimbus Analytics", "saas", "hyderabad", "https://example.com/na", 82, 78, 80, 74],
    ["Orbit CRM Systems", "saas", "pune", "https://example.com/ocs", 79, 76, 77, 72],
    ["PixelOps Platform", "saas", "mumbai", "https://example.com/pop", 76, 74, 75, 70],
    ["StackBridge India", "saas", "delhi-ncr", "https://example.com/sbi", 81, 77, 79, 73],
    ["Counsel & Co Advisors", "professional-services", "mumbai", "https://example.com/cca", 66, 62, 64, 55],
    ["LexVista Legal", "professional-services", "delhi-ncr", "https://example.com/lvl", 70, 65, 68, 58],
    ["LedgerPoint CA Firm", "professional-services", "ahmedabad", "https://example.com/lpc", 61, 58, 60, 50],
    ["InsightOps Consulting", "professional-services", "bengaluru", "https://example.com/ioc", 74, 70, 72, 66],
    ["Bridgework Partners", "professional-services", "hyderabad", "https://example.com/bwp", 68, 64, 66, 60],
    ["HarborView Hotels", "hospitality", "mumbai", "https://example.com/hvh", 75, 73, 68, 80],
    ["PalmCourt Residency", "hospitality", "chennai", "https://example.com/pcr", 69, 67, 62, 74],
    ["SpiceRoute Dining", "hospitality", "hyderabad", "https://example.com/srd", 72, 74, 60, 78],
    ["AlpineStay Resorts", "hospitality", "bengaluru", "https://example.com/asr", 70, 68, 65, 76],
    ["CityLights Boutique", "hospitality", "kolkata", "https://example.com/clb", 64, 66, 58, 70],
  ] as const;

  for (const [name, industrySlug, locationSlug, website, digital, marketing, seo, social] of competitors) {
    const existing = await prisma.competitor.findFirst({ where: { name } });
    const overall = Math.round(((digital + marketing + seo + social) / 4) * 10) / 10;
    if (existing) {
      await prisma.competitorScore.upsert({
        where: { competitorId: existing.id },
        create: {
          competitorId: existing.id,
          digitalScore: digital,
          marketingScore: marketing,
          seoScore: seo,
          socialScore: social,
          overallScore: overall,
        },
        update: {
          digitalScore: digital,
          marketingScore: marketing,
          seoScore: seo,
          socialScore: social,
          overallScore: overall,
        },
      });
      continue;
    }
    await prisma.competitor.create({
      data: {
        name,
        website,
        industryId: ind(industrySlug),
        locationId: loc(locationSlug),
        city: locationRows.find((l) => l.slug === locationSlug)?.name,
        businessType: "Established business",
        description: `${name} operates in the ${industrySlug.replace(/-/g, " ")} category.`,
        scores: {
          create: {
            digitalScore: digital,
            marketingScore: marketing,
            seoScore: seo,
            socialScore: social,
            overallScore: overall,
          },
        },
      },
    });
  }

  await prisma.pricingRule.deleteMany({});
  await prisma.pricingRule.createMany({
    data: [
      {
        name: "Starter budget",
        budgetMin: 0,
        budgetMax: 24999,
        adSpendPct: 1,
        mgmtFeePct: 0.4,
        setupFeeInr: 10000,
        minAdSpend: 15000,
        maxAdSpend: 24999,
        priority: 10,
      },
      {
        name: "Growth budget",
        budgetMin: 25000,
        budgetMax: 74999,
        adSpendPct: 1,
        mgmtFeePct: 0.35,
        setupFeeInr: 15000,
        minAdSpend: 25000,
        maxAdSpend: 75000,
        priority: 20,
      },
      {
        name: "Scale budget",
        budgetMin: 75000,
        budgetMax: null,
        adSpendPct: 1,
        mgmtFeePct: 0.3,
        setupFeeInr: 25000,
        minAdSpend: 75000,
        maxAdSpend: 300000,
        priority: 30,
      },
    ],
  });

  await prisma.strategyRule.deleteMany({});
  await prisma.strategyRule.createMany({
    data: [
      {
        name: "More leads default",
        growthGoal: "more-leads",
        channels: ["google-ads", "landing-page", "meta-ads", "crm"],
        priority: 20,
      },
      {
        name: "More sales default",
        growthGoal: "more-sales",
        channels: ["google-ads", "meta-ads", "landing-page", "crm", "cold-calling"],
        priority: 20,
      },
      {
        name: "New markets",
        growthGoal: "new-markets",
        channels: ["google-ads", "seo", "cold-calling", "landing-page"],
        priority: 20,
      },
      {
        name: "Brand growth",
        growthGoal: "brand-growth",
        channels: ["meta-ads", "seo", "landing-page", "crm"],
        priority: 20,
      },
      {
        name: "Manufacturing tilt",
        industrySlug: "manufacturing",
        channels: ["google-ads", "seo", "landing-page", "cold-calling", "crm"],
        priority: 30,
      },
    ],
  });

  const roiDefaults: [string, string, number, string?][] = [
    ["default_cpl", "Default CPL (INR)", 450, "INR"],
    ["lead_to_customer_rate", "Lead to customer rate", 0.12, "ratio"],
    ["default_acv", "Default ACV (INR)", 25000, "INR"],
  ];
  for (const [key, name, value, unit] of roiDefaults) {
    await prisma.roiAssumption.upsert({
      where: { key },
      create: { key, name, value, unit },
      update: { value, name, unit, isActive: true },
    });
  }

  const settings: [string, unknown][] = [
    ["ai_enabled", process.env.AI_ENABLED !== "false"],
    ["ai_model", process.env.AI_MODEL || "gpt-4o-mini"],
    ["ai_max_output_tokens", Number(process.env.AI_MAX_OUTPUT_TOKENS || 2000)],
    ["ai_temperature", Number(process.env.AI_TEMPERATURE || 0.4)],
    ["ai_max_calls_per_assessment", Number(process.env.AI_MAX_CALLS_PER_ASSESSMENT || 6)],
    ["gst_percent", Number(process.env.GST_PERCENT || 18)],
    ["booking_fee_inr", Number(process.env.BOOKING_FEE_INR || 99)],
    ["default_mgmt_fee_pct", 0.35],
    ["default_setup_fee", 15000],
  ];
  for (const [key, value] of settings) {
    await prisma.setting.upsert({
      where: { key },
      create: { key, value: value as Prisma.InputJsonValue },
      update: { value: value as Prisma.InputJsonValue },
    });
  }

  await prisma.planTemplate.upsert({
    where: { key: "default" },
    create: {
      key: "default",
      name: "Default 90-Day Plan",
      phase1Tasks: [
        "Audit tracking, website, and enquiry flow",
        "Finalize ICP messaging",
        "Launch Landing Page",
        "Start Google Ads foundation campaigns",
      ],
      phase2Tasks: [
        "Scale winning paid channels",
        "Activate CRM follow-up",
        "Publish SEO service pages",
        "Add Meta Ads retargeting",
      ],
      phase3Tasks: [
        "Optimize CPL and conversion",
        "Expand creatives and keywords",
        "Run Cold Calling for qualified accounts",
        "Quarterly growth review",
      ],
    },
    update: {},
  });

  const prompts: [string, string, string][] = [
    [
      "business_analysis",
      "Business Analysis Prompt",
      "Produce executiveSummary, businessOpportunity, keyChallenges, keyOpportunities, strategicPriorities for this Indian SMB based only on supplied fields.",
    ],
    [
      "strategy",
      "Strategy Prompt",
      "Explain each recommended channel. Return channels array with explanation, role, priority, guidance. Do not invent pricing.",
    ],
    [
      "competitor_analysis",
      "Competitor Prompt",
      "Using ONLY supplied competitor records and scores, write competitiveSummary, advantages, weaknesses, opportunities, recommendedActions. Never invent spend or contact facts.",
    ],
    [
      "cold_call",
      "Cold Call Prompt",
      "Write a conversational cold-call script with opening, discoveryQuestions, qualificationQuestions, objectionHandling, meetingBooking.",
    ],
    [
      "plan_90_day",
      "90-Day Plan Prompt",
      "Polish the supplied phase tasks into overview and phase narratives. Do not introduce channels/services not in recommendedChannels.",
    ],
    [
      "pdf_summary",
      "PDF Summary Prompt",
      "Write a concise narrative summary for the PDF cover/exec section without changing any supplied numbers.",
    ],
    [
      "monthly_report",
      "Monthly Report Prompt",
      "Write executiveSummary, highlights, risks, nextMonthFocus from supplied measured metrics only. Do not invent KPIs.",
    ],
  ];
  for (const [key, name, content] of prompts) {
    const existing = await prisma.aiPromptVersion.findFirst({
      where: { key },
      orderBy: { version: "desc" },
    });
    if (!existing) {
      await prisma.aiPromptVersion.create({
        data: { key, name, version: 1, content, isActive: true },
      });
    }
  }

  return {
    industries: industries.length,
    locations: locations.length,
    channels: channels.length,
    competitors: competitors.length,
  };
}
