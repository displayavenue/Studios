export type Faq = { q: string; a: string };
export type Benefit = { title: string; desc: string };
export type ProcessStep = { title: string; desc: string };
export type ServiceReview = {
  name: string;
  role: string;
  company?: string;
  city?: string;
  region?: string;
  rating: number;
  quote: string;
};
export type ServiceLocation = {
  city: string;
  region?: string;
  country?: string;
  note?: string;
};
export type ContentSection = { title: string; body: string };

export type DetailPageContent = {
  slug: string;
  kind: "service" | "industry" | "package" | "solution" | "ai" | "tool" | "case-study" | "project" | "resource";
  title: string;
  category: string;
  /** Industry vertical for public cards (preferred over client name). */
  industry?: string;
  icon: string;
  color: string;
  /** Optional CMS-uploaded card / listing image (auto-compressed). */
  image?: string;
  /** Optional CMS-uploaded detail cover image. */
  coverImage?: string;
  eyebrow: string;
  headline: string;
  summary: string;
  /** Longer humanized intro (CMS-editable). */
  intro?: string;
  sections?: ContentSection[];
  whoItsFor?: string[];
  longTailKeywords?: string[];
  locations?: ServiceLocation[];
  reviews?: ServiceReview[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  benefits: Benefit[];
  deliverables: string[];
  process: ProcessStep[];
  faqs: Faq[];
  related: { label: string; href: string }[];
  metrics?: { value: string; label: string }[];
  ctaLabel?: string;
};

export function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.toUpperCase() === "AI" || w.toUpperCase() === "SEO" || w.toUpperCase() === "CRO" || w.toUpperCase() === "PWA" || w.toUpperCase() === "CRM" || w.toUpperCase() === "ERP" || w.toUpperCase() === "POS" || w.toUpperCase() === "HRMS" || w.toUpperCase() === "AWS" || w.toUpperCase() === "GCP" || w.toUpperCase() === "UI" || w.toUpperCase() === "UX"
      ? w.toUpperCase()
      : w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace("Ui Ux", "UI/UX")
    .replace("Ai Seo", "AI SEO")
    .replace("Geo", "GEO");
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
        desc: "Dashboards, attribution, and monthly reviews so you always know what’s working.",
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
    ...partial,
  };
}
