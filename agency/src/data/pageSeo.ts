/**
 * Unique SEO meta for static + programmatic routes.
 * CMS detail pages store seoTitle / seoDescription / seoKeywords on each item.
 */

export type PageMeta = {
  title: string;
  description: string;
  keywords: string[];
};

const BRAND = "DisplayAvenue";

export const staticPageSeo: Record<string, PageMeta> = {
  "/": {
    title: `Digital Marketing Agency Mumbai | Google Ads, SEO & Leads | ${BRAND}`,
    description:
      "DisplayAvenue helps Indian SMEs get Google and Instagram enquiries with Google Ads, Meta Ads, SEO, Local SEO, websites, and WhatsApp lead systems. Free growth plan · WhatsApp 9222 122333.",
    keywords: [
      "digital marketing agency Mumbai",
      "Google Ads agency India",
      "SEO agency Mumbai",
      "Meta Ads for SMEs",
      "Local SEO Navi Mumbai",
      "DisplayAvenue",
    ],
  },
  "/services": {
    title: `Digital Marketing Services | Ads, SEO, Websites & AI | ${BRAND}`,
    description:
      "Browse DisplayAvenue services: Google Ads, Meta Ads, SEO, Local SEO, websites, ecommerce, automation, and AI growth systems for Indian businesses.",
    keywords: [
      "digital marketing services India",
      "Google Ads services",
      "SEO services Mumbai",
      "website development agency",
      "DisplayAvenue services",
    ],
  },
  "/industries": {
    title: `Industry Digital Marketing | Healthcare, Real Estate & More | ${BRAND}`,
    description:
      "Industry-specific digital growth for healthcare, real estate, manufacturing, education, ecommerce, and more — plans that match how your buyers search.",
    keywords: [
      "industry digital marketing",
      "healthcare digital marketing India",
      "real estate lead generation",
      "manufacturing digital marketing",
      "DisplayAvenue industries",
    ],
  },
  "/industry-solutions": {
    title: `Industry × Service Solutions | Conversion Landing Pages | ${BRAND}`,
    description:
      "Industry and service combination pages for real estate, manufacturing, healthcare, education, and ecommerce — each with its own intent and conversion path.",
    keywords: [
      "industry service landing pages",
      "real estate SEO India",
      "healthcare Google Ads",
      "ecommerce growth solutions",
      "DisplayAvenue",
    ],
  },
  "/packages": {
    title: `Digital Marketing Packages & Pricing | Monthly Plans | ${BRAND}`,
    description:
      "Transparent DisplayAvenue packages for SEO, ads, websites, ecommerce, and branding. Pick a monthly plan or request a custom proposal for your business.",
    keywords: [
      "digital marketing packages India",
      "SEO packages Mumbai",
      "Google Ads packages",
      "monthly marketing plans",
      "DisplayAvenue pricing",
    ],
  },
  "/solutions": {
    title: `Digital Growth Solutions by Goal & Channel | ${BRAND}`,
    description:
      "DisplayAvenue solutions mapped to goals, business size, platforms, and channels — lead generation, conversion, automation, and digital transformation.",
    keywords: [
      "digital growth solutions",
      "lead generation solution",
      "marketing automation India",
      "conversion optimisation",
      "DisplayAvenue solutions",
    ],
  },
  "/free-tools": {
    title: `Free Digital Marketing Tools | ROI, SEO & Local SEO | ${BRAND}`,
    description:
      "Free DisplayAvenue tools: ROI calculator, SEO checklist, Local SEO score, citation directory, and more — check your setup before you hire.",
    keywords: [
      "free SEO tools India",
      "ROI calculator marketing",
      "Local SEO score",
      "SEO checklist",
      "DisplayAvenue free tools",
    ],
  },
  "/case-studies": {
    title: `Case Studies | SEO, Ads & Ecommerce Results | ${BRAND}`,
    description:
      "Real DisplayAvenue client results across SEO, paid ads, ecommerce, and full-funnel growth — proof before you book a consultation.",
    keywords: [
      "digital marketing case studies India",
      "SEO case study",
      "Google Ads results",
      "DisplayAvenue case studies",
    ],
  },
  "/portfolio": {
    title: `Portfolio | Websites, Apps & Brand Campaigns | ${BRAND}`,
    description:
      "Selected DisplayAvenue work: websites, apps, branding, and campaigns built for Indian SMEs and growing brands.",
    keywords: [
      "digital agency portfolio India",
      "website design portfolio Mumbai",
      "DisplayAvenue projects",
    ],
  },
  "/resources": {
    title: `Resources & Growth Guides | Playbooks for SMEs | ${BRAND}`,
    description:
      "Practical DisplayAvenue guides, templates, and playbooks on SEO, ads, websites, and lead systems for Indian business owners.",
    keywords: [
      "digital marketing resources India",
      "SEO guides",
      "SME growth playbooks",
      "DisplayAvenue resources",
    ],
  },
  "/why-displayavenue": {
    title: `Why DisplayAvenue | Transparent Growth Agency | ${BRAND}`,
    description:
      "Why brands choose DisplayAvenue: plain-English plans, measurable enquiries, AI-assisted delivery, and Mumbai MMR specialists with pan-India reach.",
    keywords: [
      "why DisplayAvenue",
      "best digital marketing agency Mumbai",
      "transparent marketing agency India",
    ],
  },
  "/ai-platform": {
    title: `AI Platform for Marketing & Automation | ${BRAND}`,
    description:
      "Explore DisplayAvenue AI suites for marketing, sales, content, automation, analytics, and development — practical AI without the buzzword fog.",
    keywords: [
      "AI marketing platform India",
      "AI automation for agencies",
      "DisplayAvenue AI",
      "marketing AI tools",
    ],
  },
  "/contact": {
    title: `Get Free Proposal | Contact DisplayAvenue Mumbai`,
    description:
      "Book a free consultation or request a custom proposal. Tell us your city and goal — DisplayAvenue replies with a clear next step. WhatsApp 9222 122333.",
    keywords: [
      "contact DisplayAvenue",
      "free digital marketing consultation Mumbai",
      "marketing proposal India",
      "WhatsApp 9222122333",
    ],
  },
  "/locations": {
    title: `Digital Marketing by City | Mumbai, Navi Mumbai, Thane & India | ${BRAND}`,
    description:
      "Local digital marketing pages for Mumbai MMR and major Indian cities — Google Ads, Meta Ads, SEO, Local SEO, and WhatsApp lead systems by city.",
    keywords: [
      "digital marketing by city India",
      "Mumbai digital marketing",
      "Navi Mumbai SEO",
      "Thane Google Ads",
      "DisplayAvenue locations",
    ],
  },
  "/digital-marketing-agency-mumbai": {
    title: `Digital Marketing Agency in Mumbai | MMR Specialists | ${BRAND}`,
    description:
      "DisplayAvenue is a Mumbai MMR digital marketing agency for SMEs — Google Ads, SEO, Local SEO, Meta Ads, websites, and WhatsApp lead systems. Cite-ready overview.",
    keywords: [
      "digital marketing agency in Mumbai",
      "Mumbai MMR marketing agency",
      "DisplayAvenue Mumbai",
      "Google Ads Mumbai",
    ],
  },
  "/agency-partner": {
    title: `Agency Partner Program | Refer, Lead or White-Label | ${BRAND}`,
    description:
      "Grow your agency with DisplayAvenue as your behind-the-scenes execution team. Refer & Earn 10%, back-end execution, or white-label. 30+ specialists. Partner-first.",
    keywords: [
      "agency partner program India",
      "white label digital marketing",
      "agency referral commission",
      "outsourced agency execution",
      "DisplayAvenue partner",
    ],
  },
  "/talent-branding": {
    title: `Talent Branding for Models & Creators | ${BRAND}`,
    description:
      "Personal branding and social growth systems for models, actresses, and creators in India — casting-ready profiles and brand-deal visibility.",
    keywords: [
      "talent branding India",
      "personal branding for models",
      "creator marketing Mumbai",
      "DisplayAvenue talent",
    ],
  },
  "/blog": {
    title: `Blog | Digital Marketing Insights for Indian SMEs | ${BRAND}`,
    description:
      "DisplayAvenue blog: practical articles on SEO, Google Ads, Local SEO, Meta Ads, websites, and lead generation for Indian business owners.",
    keywords: [
      "digital marketing blog India",
      "SEO tips Mumbai",
      "Google Ads guide",
      "DisplayAvenue blog",
    ],
  },
  "/awards": {
    title: `Awards & Recognition | ${BRAND}`,
    description:
      "Awards and recognition earned by the DisplayAvenue team for delivery, results, and partner excellence.",
    keywords: ["DisplayAvenue awards", "digital agency awards India"],
  },
  "/certifications": {
    title: `Certifications | Google, Meta & Growth Credentials | ${BRAND}`,
    description:
      "DisplayAvenue team certifications across Google, Meta, and digital growth disciplines — proof of specialist capability.",
    keywords: [
      "DisplayAvenue certifications",
      "Google Ads certified agency",
      "Meta marketing certified",
    ],
  },
  "/card": {
    title: `Digital Business Card | ${BRAND}`,
    description:
      "DisplayAvenue digital business card — save contact, WhatsApp, and key links in one tap.",
    keywords: ["DisplayAvenue business card", "digital visiting card"],
  },
  "/privacy": {
    title: `Privacy Policy | ${BRAND}`,
    description:
      "How DisplayAvenue collects, uses, and protects personal information on displayavenue.com.",
    keywords: ["DisplayAvenue privacy policy"],
  },
  "/terms": {
    title: `Terms & Conditions | ${BRAND}`,
    description:
      "Terms and conditions for using DisplayAvenue websites, services, and digital products.",
    keywords: ["DisplayAvenue terms"],
  },
};

export function locationCityMeta(cityName: string, state: string): PageMeta {
  return {
    title: `Digital Marketing Agency in ${cityName} | Ads, SEO & Leads | ${BRAND}`,
    description: `Google Ads, Meta Ads, SEO, Local SEO, websites, and WhatsApp lead generation for businesses in ${cityName}, ${state}. Free plan from DisplayAvenue · WhatsApp 9222 122333.`,
    keywords: [
      `digital marketing agency ${cityName}`,
      `SEO agency ${cityName}`,
      `Google Ads ${cityName}`,
      `Local SEO ${cityName}`,
      `${cityName} digital marketing`,
      "DisplayAvenue",
    ],
  };
}

export function locationServiceMeta(
  cityName: string,
  state: string,
  serviceName: string,
): PageMeta {
  return {
    title: `${serviceName} in ${cityName} | ${BRAND}`,
    description: `${serviceName} for businesses in ${cityName}, ${state}. Strategy, tracking, and weekly optimisation from DisplayAvenue. Get a free growth plan on WhatsApp 9222 122333.`,
    keywords: [
      `${serviceName} ${cityName}`,
      `${serviceName.toLowerCase()} agency ${cityName}`,
      `${cityName} ${serviceName.toLowerCase()}`,
      "DisplayAvenue",
    ],
  };
}

export function catalogMeta(page: {
  title: string;
  summary?: string;
  category?: string;
  kind?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  primaryKeyword?: string;
  secondaryKeywords?: string[];
}): PageMeta {
  const kindLabel: Record<string, string> = {
    service: "Services",
    industry: "Industry",
    package: "Package",
    solution: "Solution",
    ai: "AI Suite",
    tool: "Tool",
    "case-study": "Case Study",
    project: "Project",
    resource: "Resource",
    combo: "Solution",
  };
  const kind = page.kind || "service";
  const title =
    page.seoTitle ||
    `${page.title} | ${kindLabel[kind] || "DisplayAvenue"} | ${BRAND}`;
  const description =
    page.seoDescription ||
    (page.summary
      ? `${page.summary.replace(/\s+/g, " ").trim().slice(0, 155)}${page.summary.length > 155 ? "…" : ""}`
      : `${page.title} from DisplayAvenue — practical digital growth for Indian businesses. WhatsApp 9222 122333.`);
  const keywords =
    page.seoKeywords && page.seoKeywords.length
      ? page.seoKeywords
      : [
          page.primaryKeyword,
          page.title,
          page.category,
          ...(page.secondaryKeywords || []).slice(0, 4),
          "DisplayAvenue",
          "digital marketing India",
        ].filter((k): k is string => Boolean(k && String(k).trim()));
  return { title, description, keywords: uniqueKeywords(keywords) };
}

function uniqueKeywords(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of list) {
    const k = raw.trim();
    const key = k.toLowerCase();
    if (!k || seen.has(key)) continue;
    seen.add(key);
    out.push(k);
    if (out.length >= 12) break;
  }
  return out;
}
