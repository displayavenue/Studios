import { buildDetailPage, type DetailPageContent } from "./catalogTypes";

const defs: Array<Partial<DetailPageContent> & Pick<DetailPageContent, "slug" | "kind" | "title" | "category">> = [
  {
    slug: "vaidraj-seo",
    kind: "case-study",
    title: "Healthcare SEO Growth Program",
    category: "SEO",
    industry: "Healthcare",
    icon: "search",
    color: "#16a34a",
    eyebrow: "SEO",
    headline: "More patients finding the right care online — without paid media dependency.",
    summary:
      "Organic search strategy that helped a healthcare brand capture high-intent patient demand and grow qualified website traffic.",
    intro:
      "Healthcare buyers research symptoms, treatments, and providers long before they call. This engagement rebuilt the brand’s search foundation so people looking for care could discover trustworthy information, book faster, and convert with confidence. We focused on clinical relevance, local visibility, and a content system that supports both patients and practitioners.",
    process: [
      {
        title: "Clinical keyword & competitor mapping",
        desc: "Mapped patient-intent queries, treatment pathways, and competitive gaps across service lines and locations.",
      },
      {
        title: "Technical & on-page remediation",
        desc: "Fixed crawl issues, improved page speed, structured data, and on-page relevance for priority care pages.",
      },
      {
        title: "Content & local authority build",
        desc: "Published helpful educational content and strengthened local signals so nearby patients could find and trust the brand.",
      },
      {
        title: "Measurement & compounding growth",
        desc: "Installed clear KPI tracking and a monthly optimization loop so rankings and leads kept compounding.",
      },
    ],
    deliverables: [
      "Technical SEO audit and fix roadmap",
      "Service-line keyword architecture",
      "Optimized care and location pages",
      "Educational content calendar",
      "Local SEO and citation plan",
      "Search Console + GA4 reporting dashboard",
    ],
    benefits: [
      {
        title: "Higher-intent organic traffic",
        desc: "Rankings shifted toward queries that signal real care-seeking behavior, not vanity volume.",
      },
      {
        title: "Stronger local discovery",
        desc: "Location and service pages became easier for nearby patients to find and act on.",
      },
      {
        title: "Trustworthy content system",
        desc: "Educational pages answered patient questions while supporting clinical authority and SEO.",
      },
      {
        title: "Clear ROI visibility",
        desc: "Leadership could see which pages and topics drove inquiries — not just sessions.",
      },
    ],
    faqs: [
      {
        q: "How long does healthcare SEO usually take to show results?",
        a: "Most programs show early movement in 8–12 weeks, with stronger compounding results over 4–6 months depending on competition and content velocity.",
      },
      {
        q: "Do you handle medical content carefully?",
        a: "Yes. We structure content for clarity and compliance-minded messaging, and we can work with your clinical reviewers before publishing.",
      },
      {
        q: "Can this work alongside paid ads?",
        a: "Absolutely. SEO reduces long-term CAC while paid channels capture demand immediately — the two reinforce each other.",
      },
    ],
    metrics: [
      { value: "+180%", label: "Organic Growth" },
      { value: "High Intent", label: "Lead Quality" },
      { value: "6 Months", label: "Timeline" },
    ],
    seo: {
      title: "Healthcare SEO | DisplayAvenue",
      description:
        "Organic search strategy that helped a healthcare brand capture high-intent patient demand and grow qualified website traffic.",
    },
    related: [
      { label: "All Case Studies", href: "/case-studies" },
      { label: "Start Similar Project", href: "/contact" },
      { label: "Portfolio", href: "/portfolio" },
    ],
  },
  {
    slug: "bpg-ads",
    kind: "case-study",
    title: "Real Estate Google Ads Engine",
    category: "Google Ads",
    industry: "Real Estate",
    icon: "ads",
    color: "#0056ff",
    eyebrow: "Google Ads",
    headline: "Property demand captured at the moment buyers and sellers search.",
    summary:
      "Performance-led Google Ads system built to generate qualified property inquiries and improve cost per lead for real estate brands.",
    intro:
      "Real estate search is competitive and expensive when campaigns are broad. This program rebuilt Google Ads around intent: project-specific keywords, sharper ad messaging, faster landing experiences, and clean conversion tracking. The result was a more efficient lead engine for site visits, inquiries, and sales follow-up.",
    process: [
      {
        title: "Intent & inventory mapping",
        desc: "Segmented campaigns by buyer journey — discovery, project interest, and high-intent inquiry — aligned to available inventory.",
      },
      {
        title: "Account rebuild & creative testing",
        desc: "Restructured campaigns, wrote property-specific ads, and tested messaging that clarified location, pricing cues, and CTAs.",
      },
      {
        title: "Landing page & form optimization",
        desc: "Improved speed, clarity, and form friction so more clicks became qualified inquiries for the sales team.",
      },
      {
        title: "Bid & waste control",
        desc: "Tightened negatives, geo rules, and bidding so spend concentrated on locations and queries that convert.",
      },
    ],
    deliverables: [
      "Full Google Ads account restructure",
      "Project and location ad groups",
      "Conversion tracking and CRM handoff map",
      "Landing page UX recommendations",
      "Weekly performance and lead-quality reports",
      "Negative keyword and geo control system",
    ],
    benefits: [
      {
        title: "Lower cost per inquiry",
        desc: "Budget shifted away from broad, low-intent search toward queries that produce sales-ready leads.",
      },
      {
        title: "Better lead quality for sales",
        desc: "Forms and tracking made it clearer which campaigns produced real site visits and conversations.",
      },
      {
        title: "Faster creative learning",
        desc: "Structured testing showed which offers and property angles actually moved buyers.",
      },
      {
        title: "Scalable paid acquisition",
        desc: "A clean account structure made it easier to launch new projects without rebuilding from scratch.",
      },
    ],
    faqs: [
      {
        q: "What budget do real estate Google Ads usually need?",
        a: "It depends on market competition and ticket size. We recommend starting with a test budget that can generate enough conversions to learn, then scaling winners.",
      },
      {
        q: "Can you track site visits and calls?",
        a: "Yes. We set up form, call, and offline conversion tracking so media decisions reflect real sales outcomes.",
      },
      {
        q: "Do you manage landing pages too?",
        a: "We optimize existing pages and can design dedicated campaign landing experiences when needed.",
      },
    ],
    metrics: [
      { value: "-32%", label: "CPL Improvement" },
      { value: "+2.1x", label: "Qualified Inquiries" },
      { value: "90 Days", label: "Timeline" },
    ],
    seo: {
      title: "Real Estate Google Ads | DisplayAvenue",
      description:
        "Performance-led Google Ads system built to generate qualified property inquiries and improve cost per lead for real estate brands.",
    },
    related: [
      { label: "All Case Studies", href: "/case-studies" },
      { label: "Start Similar Project", href: "/contact" },
      { label: "Portfolio", href: "/portfolio" },
    ],
  },
  {
    slug: "royal-ecom",
    kind: "case-study",
    title: "Ecommerce Conversion & Growth System",
    category: "E-commerce",
    industry: "Ecommerce",
    icon: "bag",
    color: "#f97316",
    eyebrow: "E-commerce",
    headline: "A store experience built to convert browsers into buyers — and buyers into repeats.",
    summary:
      "Full-funnel ecommerce improvements spanning product discovery, checkout UX, and retention so more visitors become repeat buyers.",
    intro:
      "Traffic alone does not grow an online store. This engagement focused on the full purchase journey: clearer product discovery, frictionless checkout, trust signals at decision points, and post-purchase lifecycle flows. Every change was measured against conversion rate, average order value, and repeat purchase behavior.",
    process: [
      {
        title: "Funnel & UX diagnosis",
        desc: "Analyzed drop-offs from collection to cart to checkout and identified the highest-friction moments.",
      },
      {
        title: "Product & merchandising upgrades",
        desc: "Improved PDP clarity, social proof, and collection navigation so shoppers could decide faster.",
      },
      {
        title: "Checkout & trust optimization",
        desc: "Reduced form friction, strengthened payment confidence, and clarified shipping and return expectations.",
      },
      {
        title: "Retention & lifecycle loops",
        desc: "Built browse/cart recovery and post-purchase journeys to increase second orders without extra ad spend.",
      },
    ],
    deliverables: [
      "Conversion audit and prioritized backlog",
      "PDP and collection UX improvements",
      "Checkout friction reduction plan",
      "Email/SMS lifecycle flow set",
      "AOV and upsell experiments",
      "Ecommerce KPI dashboard",
    ],
    benefits: [
      {
        title: "Higher conversion rate",
        desc: "Shoppers found products faster and completed checkout with fewer abandoned sessions.",
      },
      {
        title: "Improved average order value",
        desc: "Merchandising and offer tests increased basket size without aggressive discounting.",
      },
      {
        title: "Stronger repeat purchase rate",
        desc: "Lifecycle journeys brought first-time buyers back with relevant post-purchase prompts.",
      },
      {
        title: "Clearer growth decisions",
        desc: "Funnel analytics showed which pages and campaigns deserved more investment.",
      },
    ],
    faqs: [
      {
        q: "Do you work on Shopify and custom stores?",
        a: "Yes. We optimize UX and conversion on Shopify, WooCommerce, and custom ecommerce stacks.",
      },
      {
        q: "Will this require a full redesign?",
        a: "Not always. Many gains come from focused CRO experiments before a larger redesign is needed.",
      },
      {
        q: "How do you measure success?",
        a: "We track conversion rate, AOV, revenue per session, and repeat purchase rate — not vanity traffic.",
      },
    ],
    metrics: [
      { value: "+41%", label: "Conversion Lift" },
      { value: "+18%", label: "AOV" },
      { value: "4 Months", label: "Timeline" },
    ],
    seo: {
      title: "Ecommerce E-commerce | DisplayAvenue",
      description:
        "Full-funnel ecommerce improvements spanning product discovery, checkout UX, and retention so more visitors become repeat buyers.",
    },
    related: [
      { label: "All Case Studies", href: "/case-studies" },
      { label: "Start Similar Project", href: "/contact" },
      { label: "Portfolio", href: "/portfolio" },
    ],
  },
  {
    slug: "island360",
    kind: "case-study",
    title: "Travel Meta Ads Acquisition",
    category: "Meta Ads",
    industry: "Travel & Tourism",
    icon: "share",
    color: "#0891b2",
    eyebrow: "Meta Ads",
    headline: "Scroll-stopping travel creative that turns inspiration into booked trips.",
    summary:
      "Meta Ads campaigns designed to inspire travel demand and convert interest into bookings for tourism and experience brands.",
    intro:
      "Travel decisions start with emotion and end with trust. This Meta program paired destination storytelling with disciplined performance structure — cold prospecting, retargeting, and offer creative mapped to booking intent. Creative testing and landing alignment helped lower cost per lead while improving inquiry quality for the sales and reservations team.",
    process: [
      {
        title: "Audience & seasonality planning",
        desc: "Built audience segments around trip intent, geography, and seasonal travel windows.",
      },
      {
        title: "Creative system for inspiration → action",
        desc: "Produced hooks, destination stories, and offer creatives that moved people from dream to inquiry.",
      },
      {
        title: "Funnel & retargeting setup",
        desc: "Connected awareness, consideration, and remarketing so warm prospects saw the right next message.",
      },
      {
        title: "Booking-path optimization",
        desc: "Improved landing clarity, package proof, and inquiry flow so ad traffic converted more efficiently.",
      },
    ],
    deliverables: [
      "Meta Ads account and campaign architecture",
      "Creative testing matrix (hooks, angles, offers)",
      "Retargeting and lookalike framework",
      "Landing page recommendations for packages",
      "Pixel and conversion event hygiene",
      "Weekly creative + CPL reporting",
    ],
    benefits: [
      {
        title: "Lower cost per travel lead",
        desc: "Creative winners and tighter audiences reduced wasted spend on low-intent clicks.",
      },
      {
        title: "Higher inquiry quality",
        desc: "Messaging and landing alignment attracted travelers closer to booking decisions.",
      },
      {
        title: "Repeatable creative learning",
        desc: "A testing system showed which destinations, hooks, and offers scaled reliably.",
      },
      {
        title: "Season-ready campaign structure",
        desc: "The account could flex for peak travel windows without starting over each season.",
      },
    ],
    faqs: [
      {
        q: "What creative formats work best for travel?",
        a: "Short vertical video, destination carousels, and UGC-style clips usually outperform static alone — we test what fits your brand.",
      },
      {
        q: "Can you promote packages and experiences?",
        a: "Yes. We structure campaigns around destinations, packages, and seasonal offers with clear booking CTAs.",
      },
      {
        q: "How quickly can campaigns launch?",
        a: "A focused first flight can usually launch within 1–2 weeks once creative assets and tracking are ready.",
      },
    ],
    metrics: [
      { value: "+3.4x", label: "Lead Volume" },
      { value: "-28%", label: "CPL" },
      { value: "12 Weeks", label: "Timeline" },
    ],
    seo: {
      title: "Travel & Tourism Meta Ads | DisplayAvenue",
      description:
        "Meta Ads campaigns designed to inspire travel demand and convert interest into bookings for tourism and experience brands.",
    },
    related: [
      { label: "All Case Studies", href: "/case-studies" },
      { label: "Start Similar Project", href: "/contact" },
      { label: "Portfolio", href: "/portfolio" },
    ],
  },
];

export const casePages: DetailPageContent[] = defs.map((d) => buildDetailPage(d));
export const caseBySlug = Object.fromEntries(casePages.map((p) => [p.slug, p])) as Record<string, DetailPageContent>;
export function getCasePage(slug: string): DetailPageContent | undefined {
  return caseBySlug[slug];
}
