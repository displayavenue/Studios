export type Faq = { q: string; a: string };
export type Benefit = { title: string; desc: string };
export type ProcessStep = { title: string; desc: string };

/** Page information architecture / conversion layout */
export type PageArchitecture =
  | "default"
  | "lead-gen"
  | "seo"
  | "aeo"
  | "automation"
  | "ads"
  | "web"
  | "industry"
  | "manufacturing"
  | "healthcare"
  | "education"
  | "real-estate"
  | "ecommerce"
  | "combo";

export type DetailPageContent = {
  slug: string;
  kind:
    | "service"
    | "industry"
    | "package"
    | "solution"
    | "ai"
    | "tool"
    | "case-study"
    | "project"
    | "resource"
    | "combo";
  title: string;
  category: string;
  icon: string;
  color: string;
  eyebrow: string;
  headline: string;
  summary: string;
  benefits: Benefit[];
  deliverables: string[];
  process: ProcessStep[];
  faqs: Faq[];
  related: { label: string; href: string }[];
  metrics?: { value: string; label: string }[];
  ctaLabel?: string;
  /** SEO + AEO extensions (optional — existing pages keep working) */
  architecture?: PageArchitecture;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  searchIntent?: string;
  targetAudience?: string;
  decisionMaker?: string;
  painPoints?: string[];
  uniqueAngle?: string;
  quickAnswer?: string;
  keyFacts?: string[];
  whenYouNeedThis?: string[];
  objections?: { q: string; a: string }[];
  funnelSteps?: ProcessStep[];
  comparison?: { traditional: string[]; ours: string[] };
  seoTitle?: string;
  seoDescription?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  industrySlug?: string;
  serviceSlug?: string;
  indexable?: boolean;
};

export function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) =>
      ["AI", "SEO", "AEO", "GEO", "CRO", "PWA", "CRM", "ERP", "POS", "HRMS", "AWS", "GCP", "UI", "UX", "B2B", "IVF", "EV", "PPC"].includes(
        w.toUpperCase(),
      )
        ? w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ")
    .replace("Ui Ux", "UI/UX")
    .replace("Ai Seo", "AI SEO");
}

export function buildDetailPage(
  partial: Partial<DetailPageContent> &
    Pick<DetailPageContent, "slug" | "kind" | "title" | "category">,
): DetailPageContent {
  const title = partial.title;
  const category = partial.category;
  return {
    icon: "grid",
    color: "#0056ff",
    eyebrow: category,
    headline: `${title} that drives measurable growth`,
    summary: `DisplayAvenue delivers end-to-end ${title.toLowerCase()} for brands that want clarity, speed, and ROI - powered by strategy, creative, and AI.`,
    benefits: [
      {
        title: "Strategy first",
        desc: `We align ${title.toLowerCase()} with your business goals, audience, and funnel - not vanity metrics.`,
      },
      {
        title: "Expert execution",
        desc: "Specialists who ship weekly, report clearly, and optimize continuously.",
      },
      {
        title: "AI-accelerated delivery",
        desc: "Our AI platform speeds research, content, QA, and reporting without losing human judgment.",
      },
      {
        title: "Transparent ROI",
        desc: "Dashboards, attribution, and monthly reviews so you always know what's working.",
      },
    ],
    deliverables: [
      `Dedicated ${title} roadmap`,
      "Kickoff workshop & KPI framework",
      "Creative / technical implementation",
      "Weekly progress updates",
      "Monthly performance report",
      "Optimization sprints",
    ],
    process: [
      {
        title: "Discover",
        desc: "Audit current state, competitors, and opportunities across channel and funnel.",
      },
      {
        title: "Plan",
        desc: "Define goals, messaging, tech stack, timeline, and success metrics.",
      },
      {
        title: "Build & launch",
        desc: "Execute with quality checks, tracking, and staged rollouts.",
      },
      {
        title: "Optimize & scale",
        desc: "Iterate from data - improve conversion, efficiency, and growth.",
      },
    ],
    faqs: [
      {
        q: `How fast can we start ${title}?`,
        a: "Most engagements kick off within 5-7 business days after scope confirmation.",
      },
      {
        q: "Do you work with startups and enterprises?",
        a: "Yes. We tailor scope, SLAs, and reporting for startups, SMBs, and enterprise teams.",
      },
      {
        q: "Can this integrate with our existing stack?",
        a: "We work with Google, Meta, HubSpot, Shopify, WordPress, custom CRMs, and most modern tools.",
      },
      {
        q: "Is pricing fixed or custom?",
        a: "We offer package tiers and custom proposals based on goals, complexity, and volume.",
      },
    ],
    related: [
      { label: "View Packages", href: "/packages" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Free Consultation", href: "/contact" },
    ],
    metrics: [
      { value: "850+", label: "Projects" },
      { value: "98%", label: "Satisfaction" },
      { value: "320%", label: "Avg ROI lift" },
    ],
    ctaLabel: "Get Free Proposal",
    architecture: "default",
    indexable: true,
    ...partial,
  };
}
