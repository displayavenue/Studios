export type LinkableTool = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  href: string;
  badge: string;
};

/** Live interactive tools that can earn real backlinks. */
export const linkableTools: LinkableTool[] = [
  {
    slug: "roi-calculator",
    title: "Marketing ROI Calculator",
    shortTitle: "ROI Calculator",
    description:
      "Estimate monthly leads, revenue, and return on ad spend from your marketing budget. Free, no signup.",
    category: "Marketing",
    href: "/free-tools/roi-calculator",
    badge: "Calculator",
  },
  {
    slug: "seo-checklist",
    title: "Website SEO Score Checklist",
    shortTitle: "SEO Checklist",
    description:
      "Score your website against 20 on-page and technical SEO checks used by Indian growth teams.",
    category: "SEO",
    href: "/free-tools/seo-checklist",
    badge: "Checklist",
  },
  {
    slug: "local-seo-score",
    title: "Local SEO & GMB Scorecard",
    shortTitle: "Local SEO Score",
    description:
      "Check Google Business Profile and local citation readiness for Mumbai and India businesses.",
    category: "Local SEO",
    href: "/free-tools/local-seo-score",
    badge: "Scorecard",
  },
  {
    slug: "citation-directory",
    title: "India Citation & Directory List",
    shortTitle: "Citation Directory",
    description:
      "Curated legitimate Indian and global directories for citations, plus copy-ready outreach templates.",
    category: "Link Building",
    href: "/free-tools/citation-directory",
    badge: "Outreach kit",
  },
];

export const industryReport = {
  slug: "india-sme-digital-growth-report",
  title: "India SME Digital Growth Report 2026",
  description:
    "How Indian SMEs win enquiries from Google, Instagram, and WhatsApp - benchmarks, channel mix, and a 90-day plan.",
  href: "/resources/india-sme-digital-growth-report",
};
