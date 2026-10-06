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
    headline: "Your Next Address Starts Here.",
    support:
      "Buy, sell, rent or explore redevelopment with a local property team that knows Mira Road, Dahisar and Bhayandar.",
    primaryCta: "Browse Homes",
    primaryPath: "/buy",
    secondaryCta: "List Your Property",
    secondaryPath: "/sell",
    image: "/content/uploads/societies/_shared/tower-blocks-mira-east.jpg",
  },
  services: {
    eyebrow: "What we do",
    title: "Property Help That Goes Beyond Listings.",
    text: "Whether you are buying your first home, looking for a rental, selling a property or discussing redevelopment, we help you take the next step.",
  },
  featured: {
    eyebrow: "Featured listings",
    title: "Properties Worth Seeing.",
    text: "A rotating shortlist across our three core localities. WhatsApp us for the latest availability.",
  },
  localities: {
    eyebrow: "Where we specialise",
    title: "Explore Your Locality.",
    text: "Hyperlocal pages for buyers, tenants and investors who want clarity, not pan-city noise.",
  },
  whyChoose: {
    eyebrow: "Why DisplayAvenue",
    title: "Local Knowledge. Personal Attention.",
    text: "We are based in Mira Road East and work these markets daily.",
  },
  process: {
    eyebrow: "How it works",
    title: "Finding Property Should Feel Simple.",
    text: "A simple path designed for busy Mumbai schedules.",
  },
  testimonials: {
    eyebrow: "Client stories",
    title: "Trusted by People Looking for the Right Property.",
    text: "Buyers, tenants, shop owners and society committees.",
  },
  faqs: {
    eyebrow: "FAQs",
    title: "Have Questions?",
    text: "Straight answers before you call.",
  },
  blogs: {
    eyebrow: "Insights",
    title: "Know the Local Market Before You Decide.",
    text: "Market notes and checklists for Dahisar, Mira Road and Bhayandar.",
  },
  ctaBanner: {
    title: "Let's Find the Right Property for You.",
    text: "Buy. Rent. Sell. Redevelop. Mira Road · Dahisar · Bhayandar",
    primaryCta: "WhatsApp us",
    primaryPath: "whatsapp",
    secondaryCta: "Call 8169 122333",
    secondaryHref: "tel:+918169122333",
  },
};
