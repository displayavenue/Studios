import { img } from "./images";

export type HomeContent = {
  seo: { title: string; description: string };
  hero: {
    brand: string;
    headline: string;
    support: string;
    primaryCta: string;
    primaryPath: string;
    secondaryCta: string;
    secondaryPath: string;
    image: string;
  };
  services: { eyebrow: string; title: string; text: string };
  featured: { eyebrow: string; title: string; text: string };
  localities: { eyebrow: string; title: string; text: string };
  whyChoose: { eyebrow: string; title: string; text: string };
  process: { eyebrow: string; title: string; text: string };
  testimonials: { eyebrow: string; title: string; text: string };
  faqs: { eyebrow: string; title: string; text: string };
  blogs: { eyebrow: string; title: string; text: string };
  ctaBanner: {
    title: string;
    text: string;
    primaryCta: string;
    primaryPath: string;
    secondaryCta: string;
    secondaryHref: string;
  };
};

export const homeContent: HomeContent = {
  seo: {
    title:
      "DisplayAvenue Realty | Dahisar, Mira Road & Bhayandar Property",
    description:
      "Buy, sell or rent residential & commercial property in Dahisar, Mira Road and Bhayandar. Redevelopment advisory, site visits and WhatsApp-first support.",
  },
  hero: {
    brand: "DisplayAvenue Realty",
    headline: "Find your next address in Mira Road, Dahisar & Bhayandar",
    support:
      "Residential · Commercial · Redevelopment. Local listings, honest advice, faster site visits.",
    primaryCta: "Browse homes",
    primaryPath: "/buy",
    secondaryCta: "List your property",
    secondaryPath: "/sell",
    image: img.heroLocal,
  },
  services: {
    eyebrow: "What we do",
    title: "One team for every property move",
    text: "Whether you are buying your first home, placing a tenant, leasing a shop or exploring society redevelopment, we stay local and practical.",
  },
  featured: {
    eyebrow: "Featured listings",
    title: "Homes and spaces worth a visit",
    text: "A rotating shortlist across our three core localities. WhatsApp us for the latest availability.",
  },
  localities: {
    eyebrow: "Where we specialise",
    title: "Three localities. Deep coverage.",
    text: "Hyperlocal pages for buyers, tenants and investors who want clarity, not pan-city noise.",
  },
  whyChoose: {
    eyebrow: "Why DisplayAvenue",
    title: "Local trust, clear deals",
    text: "We are based in Mira Road East and work these markets daily.",
  },
  process: {
    eyebrow: "How it works",
    title: "From enquiry to keys",
    text: "A simple path designed for busy Mumbai schedules.",
  },
  testimonials: {
    eyebrow: "Client stories",
    title: "People we’ve helped move",
    text: "Buyers, tenants, shop owners and society committees.",
  },
  faqs: {
    eyebrow: "FAQs",
    title: "Questions we hear every week",
    text: "Straight answers before you call.",
  },
  blogs: {
    eyebrow: "Insights",
    title: "Guides for local decisions",
    text: "Market notes and checklists for Dahisar, Mira Road and Bhayandar.",
  },
  ctaBanner: {
    title: "Tell us your budget and locality. We’ll shortlist today",
    text: "Call, WhatsApp or send an enquiry. Most active listings can be visited within 24–48 hours.",
    primaryCta: "WhatsApp us",
    primaryPath: "whatsapp",
    secondaryCta: "Contact form",
    secondaryHref: "/contact",
  },
};
