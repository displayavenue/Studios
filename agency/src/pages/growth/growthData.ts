/** Static copy + scoring for the /growth Meta Ads landing page. */

export const growthIndustries = [
  "Real Estate",
  "Education",
  "Healthcare",
  "Manufacturing",
  "Travel",
  "E-commerce",
  "B2B",
  "Professional Services",
  "Local Business",
  "Other",
] as const;

export const growthNeeds = [
  "Generate More Leads",
  "Website Development",
  "Website Management",
  "Meta Ads",
  "Google Ads",
  "Google Business Profile",
  "E-commerce Management",
  "Multiple Services",
  "Not Sure — Recommend a Plan",
] as const;

export const growthCurrentMarketing = [
  "Meta Ads",
  "Google Ads",
  "SEO",
  "Social Media",
  "Google Business Profile",
  "E-commerce",
  "Website",
  "Nothing Currently",
  "Other",
] as const;

export const growthBudgets = [
  { id: "under-10k", label: "Under ₹10,000", score: 0 },
  { id: "10-25k", label: "₹10,000–₹25,000", score: 5 },
  { id: "25-50k", label: "₹25,000–₹50,000", score: 15 },
  { id: "50-100k", label: "₹50,000–₹1,00,000", score: 25 },
  { id: "100k-plus", label: "₹1,00,000+", score: 35 },
] as const;

export const growthPlans = [
  { id: "growth-30k", label: "₹30,000 Growth", score: 15, priceLabel: "₹30,000/month" },
  { id: "scale-60k", label: "₹60,000 Scale", score: 25, priceLabel: "₹60,000/month" },
  { id: "partner-90k", label: "₹90,000 Growth Partner", score: 35, priceLabel: "₹90,000/month" },
  { id: "not-sure", label: "Not Sure — Recommend a Plan", score: 10, priceLabel: "Recommend a plan" },
] as const;

export const growthTimelines = [
  { id: "immediately", label: "Immediately", score: 25 },
  { id: "7-days", label: "Within 7 days", score: 20 },
  { id: "30-days", label: "Within 30 days", score: 10 },
  { id: "1-3-months", label: "1–3 months", score: 5 },
  { id: "researching", label: "Just researching", score: 0 },
] as const;

export type LeadTemperature = "HOT" | "WARM" | "NURTURE";

export function scoreGrowthLead(input: {
  budgetId: string;
  planId: string;
  timelineId: string;
  servicesRequired: string[];
  currentMarketing: string[];
}): { lead_score: number; lead_temperature: LeadTemperature } {
  const budget = growthBudgets.find((b) => b.id === input.budgetId)?.score ?? 0;
  const plan = growthPlans.find((p) => p.id === input.planId)?.score ?? 0;
  const timeline = growthTimelines.find((t) => t.id === input.timelineId)?.score ?? 0;
  const multi =
    input.servicesRequired.includes("Multiple Services") ||
    input.servicesRequired.filter((s) => s !== "Not Sure — Recommend a Plan").length >= 2
      ? 10
      : 0;
  const adsRunning =
    input.currentMarketing.some((m) => m === "Meta Ads" || m === "Google Ads") ? 5 : 0;
  const lead_score = budget + plan + timeline + multi + adsRunning;
  const lead_temperature: LeadTemperature =
    lead_score >= 60 ? "HOT" : lead_score >= 30 ? "WARM" : "NURTURE";
  return { lead_score, lead_temperature };
}

export const growthServices = [
  {
    id: "website-dev",
    title: "Website Development",
    subtitle: "Build a Website Designed for Growth",
    items: [
      "Business websites",
      "Corporate websites",
      "Lead-generation websites",
      "Landing pages",
      "E-commerce websites",
      "Shopify",
      "Magento",
      "Mobile-responsive development",
      "Conversion-focused UI/UX",
      "Analytics integration",
      "Third-party integrations",
    ],
    note: "Website Development means building or rebuilding websites — not ongoing maintenance.",
    cta: "Build My Website",
    accent: "#0056ff",
  },
  {
    id: "website-mgmt",
    title: "Website Management",
    subtitle: "Keep Your Website Updated, Secure & Optimized",
    items: [
      "Website updates",
      "Content updates",
      "Image/banner updates",
      "Product updates",
      "Landing-page updates",
      "Maintenance",
      "Bug fixes",
      "Technical support",
      "Performance monitoring",
      "Conversion optimization",
      "Analytics/tracking maintenance",
      "SEO-related technical updates where applicable",
    ],
    note: "Website Management is ongoing maintenance, updates, support and optimization — not unlimited development.",
    cta: "Manage My Website",
    accent: "#0d9488",
  },
  {
    id: "meta-ads",
    title: "Meta Ads Management",
    subtitle: "Reach Potential Customers on Facebook & Instagram",
    items: [
      "Campaign strategy",
      "Lead campaigns",
      "Conversion campaigns",
      "Retargeting",
      "Audience strategy",
      "Creative testing",
      "Campaign optimization",
      "Conversion tracking",
      "Performance reporting",
    ],
    note: "Advertising spend is billed separately.",
    cta: "Grow With Meta Ads",
    accent: "#1877f2",
  },
  {
    id: "google-ads",
    title: "Google Ads Management",
    subtitle: "Capture High-Intent Search Traffic",
    items: [
      "Google Search Ads",
      "Keyword strategy",
      "Campaign setup",
      "Conversion tracking",
      "Remarketing",
      "YouTube Ads where applicable",
      "Campaign optimization",
      "Performance reporting",
    ],
    note: "Advertising spend is billed separately.",
    cta: "Grow With Google Ads",
    accent: "#ea4335",
  },
  {
    id: "gbp",
    title: "Google Business Profile",
    subtitle: "Improve Your Google Maps & Local Search Presence",
    items: [
      "Profile optimization",
      "Business information",
      "Category optimization",
      "Services/products",
      "Google Posts",
      "Review strategy",
      "Local SEO support",
      "Google Maps presence",
      "Performance monitoring",
    ],
    note: "",
    cta: "Improve My Google Presence",
    accent: "#34a853",
  },
  {
    id: "lead-gen",
    title: "Lead Generation",
    subtitle: "Generate & Qualify Better Business Leads",
    items: [
      "Lead-generation strategy",
      "Landing pages",
      "Qualification forms",
      "Lead scoring",
      "CRM integration",
      "WhatsApp integration",
      "Retargeting",
      "Conversion tracking",
      "Funnel optimization",
      "Lead reporting",
    ],
    note: "",
    cta: "Generate More Leads",
    accent: "#7c3aed",
  },
  {
    id: "ecommerce",
    title: "E-commerce Management",
    subtitle: "Manage & Grow Your Online Store",
    items: [
      "Shopify management",
      "Magento management",
      "Product management",
      "Catalog management",
      "Product page optimization",
      "Google Merchant Center",
      "E-commerce analytics",
      "Conversion optimization",
      "E-commerce marketing integration",
      "Website maintenance",
      "Marketplace support where applicable",
    ],
    note: "",
    cta: "Grow My E-commerce Business",
    accent: "#f97316",
  },
] as const;

export const growthPricing = [
  {
    id: "growth-30k",
    name: "Growth",
    price: "₹30,000",
    period: "/month",
    position: "For businesses building a consistent digital growth foundation.",
    features: [
      "Website Management",
      "Meta Ads Management",
      "Google Business Profile",
      "Lead Generation Strategy",
      "Landing Page Support",
      "Analytics & Tracking",
      "Monthly Reporting",
      "Strategy Consultation",
    ],
    cta: "Get Growth Plan",
    featured: false,
  },
  {
    id: "scale-60k",
    name: "Scale",
    price: "₹60,000",
    period: "/month",
    position: "For businesses actively investing in customer acquisition.",
    features: [
      "Website Management",
      "Website / Landing Page Development",
      "Meta Ads Management",
      "Google Ads Management",
      "Google Business Profile",
      "Lead Generation",
      "Retargeting",
      "CRM / WhatsApp Integration",
      "Conversion Optimization",
      "E-commerce Support",
      "Advanced Analytics",
      "Monthly Strategy Review",
    ],
    cta: "Get Scale Plan",
    featured: true,
  },
  {
    id: "partner-90k",
    name: "Growth Partner",
    price: "₹90,000",
    period: "/month",
    position: "For businesses looking for broader digital management under one team.",
    features: [
      "Website Development",
      "Website Management",
      "Meta Ads",
      "Google Ads",
      "Google Business Profile",
      "Lead Generation",
      "Landing Pages",
      "Retargeting",
      "CRM Integration",
      "WhatsApp Automation",
      "E-commerce Management",
      "Conversion Optimization",
      "Analytics",
      "Creative Strategy",
      "Monthly Growth Strategy",
      "Priority Support",
    ],
    cta: "Talk to an Expert",
    featured: false,
  },
] as const;

export const growthFaqs = [
  {
    q: "How does DisplayAvenue generate leads?",
    a: "We connect advertising, website experience, Google presence, qualification forms and follow-up into one measurable system so traffic becomes sales opportunities — not just clicks.",
  },
  {
    q: "What services do you provide?",
    a: "Website Development, Website Management, Meta Ads, Google Ads, Google Business Profile, Lead Generation and E-commerce Management — coordinated as one digital growth partnership.",
  },
  {
    q: "Do you manage Meta Ads?",
    a: "Yes. We plan, launch, optimize and report on Facebook and Instagram campaigns. Advertising spend is billed separately.",
  },
  {
    q: "Do you manage Google Ads?",
    a: "Yes. We manage Search, remarketing and related Google Ads activity with conversion tracking. Advertising spend is billed separately.",
  },
  {
    q: "Do you manage Google Business Profile?",
    a: "Yes. We optimize your profile, posts, categories, review strategy and local presence so Maps and local search support lead generation.",
  },
  {
    q: "Do you develop websites?",
    a: "Yes. We build business, corporate, lead-generation, landing and e-commerce websites designed for conversion and tracking.",
  },
  {
    q: "Do you provide ongoing website management?",
    a: "Yes. Website Management covers updates, maintenance, support and optimization. It is separate from full website builds and is not unlimited development.",
  },
  {
    q: "Do you manage Shopify and e-commerce websites?",
    a: "Yes. We support Shopify, Magento and related e-commerce operations including catalog, product pages, analytics and marketing integration.",
  },
  {
    q: "Is advertising spend included in the monthly fee?",
    a: "No. Monthly plans cover strategy, management and execution support. Ad spend, hosting, domains, plugins and other third-party costs are separate unless explicitly included in your proposal.",
  },
  {
    q: "What is included in the ₹30,000 plan?",
    a: "The Growth plan is a foundation package typically covering website management, Meta Ads management, Google Business Profile, lead-generation strategy, landing-page support, analytics and monthly reporting. Exact scope is confirmed in your proposal.",
  },
  {
    q: "What is included in the ₹60,000 plan?",
    a: "The Scale plan expands into Google Ads, more landing-page/website work, retargeting, CRM/WhatsApp integration and deeper conversion optimization. Exact deliverables are confirmed in your proposal.",
  },
  {
    q: "What is included in the ₹90,000 plan?",
    a: "Growth Partner is the broadest monthly engagement across website, ads, Google presence, lead generation and e-commerce management with priority support. Scope is customized in the final proposal.",
  },
  {
    q: "How do you measure lead quality?",
    a: "We look at enquiry fit, business context, budget signals, timeline and requirement clarity — then refine targeting, offer and follow-up based on what becomes a real sales conversation.",
  },
  {
    q: "Can I choose multiple services?",
    a: "Yes. Most clients need a mix. Tell us your priorities in the form and we will recommend the service mix that fits.",
  },
  {
    q: "Can I request a customized plan?",
    a: "Yes. The three plans are examples. Deliverables, volume and scope are confirmed in your proposal.",
  },
  {
    q: "How quickly will your team contact me?",
    a: "After you submit the growth form, our team reviews your requirements and follows up to discuss fit, timeline and next steps. Timing can vary with enquiry volume.",
  },
] as const;

export type GrowthLeadPayload = {
  lead_id?: string;
  name: string;
  business_name: string;
  phone: string;
  email: string;
  industry: string;
  services_required: string[];
  current_marketing: string[];
  monthly_marketing_budget: string;
  selected_plan: string;
  timeline: string;
  business_description: string;
  lead_score: number;
  lead_temperature: LeadTemperature;
  consent: boolean;
  first_utm_source: string;
  first_utm_medium: string;
  first_utm_campaign: string;
  first_utm_content: string;
  last_utm_source: string;
  last_utm_medium: string;
  last_utm_campaign: string;
  last_utm_content: string;
  fbclid: string;
  landing_page: string;
  referrer: string;
  device: string;
  event_id: string;
  page: string;
  website?: string; // honeypot
};
