export type HomeSection = {
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel?: string;
  ctaPath?: string;
  secondaryCtaLabel?: string;
  secondaryCtaPath?: string;
};

export type HomeContent = {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    brand: string;
    eyebrow: string;
    headline: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaPath: string;
    secondaryCtaLabel: string;
    secondaryCtaPath: string;
    image: string;
    imageAlt: string;
  };
  brands: {
    label: string;
  };
  services: HomeSection;
  portfolio: HomeSection;
  packages: HomeSection & {
    featuredBadge: string;
  };
  whyChoose: HomeSection;
  process: HomeSection;
  testimonials: HomeSection;
  faqs: HomeSection;
  blogs: HomeSection;
  ctaBanner: {
    eyebrow: string;
    title: string;
    text: string;
    primaryLabel: string;
    primaryPath: string;
  };
};

export const homeContent: HomeContent = {
  "seo": {
    "title": "Wedding Photographer in Mumbai | Candid Photography & Films | DisplayAvenue",
    "description": "Premium wedding photographer & videographer in Mumbai for Indian weddings — candid photography, cinematic films, pre-wedding, engagement, maternity, birthday and event coverage across India."
  },
  "hero": {
    "brand": "DisplayAvenue Studios",
    "eyebrow": "Luxury Wedding Photography & Films · Mumbai",
    "headline": "The wedding photographer couples shortlist for forever",
    "description": "Candid photography. Cinematic videography. Traditional heirlooms. Pre-wedding, engagement, maternity, birthday and all event photo + film — crafted in Mumbai for Indian celebrations.",
    "primaryCtaLabel": "Check Availability",
    "primaryCtaPath": "/availability",
    "secondaryCtaLabel": "View Wedding Portfolio",
    "secondaryCtaPath": "/portfolio",
    "image": "/images/indian/wedding-01.jpg",
    "imageAlt": "Indian bride and groom in traditional wedding attire by DisplayAvenue Studios Mumbai"
  },
  "brands": {
    "label": "Trusted by Couples Across India"
  },
  "services": {
    "eyebrow": "Signature Services",
    "title": "Weddings & life’s celebrations — only what matters",
    "text": "Wedding photography & videography, pre-wedding films, engagement, maternity, birthday and complete event coverage — photo and film for every celebration.",
    "ctaLabel": "Explore Services",
    "ctaPath": "/services"
  },
  "portfolio": {
    "eyebrow": "Featured Stories",
    "title": "Weddings that feel like cinema",
    "text": "Destination palaces, Mumbai banquets, pre-wedding chemistry and milestone celebrations — a portfolio built for couples.",
    "ctaLabel": "Explore Portfolio",
    "ctaPath": "/portfolio"
  },
  "packages": {
    "eyebrow": "Wedding Packages",
    "title": "Essential · Signature · Luxury",
    "text": "Transparent photography and film packages for intimate ceremonies and destination celebrations — compare and customise.",
    "featuredBadge": "Most Booked",
    "ctaLabel": "Wedding Packages",
    "ctaPath": "/packages/wedding",
    "secondaryCtaLabel": "All Packages",
    "secondaryCtaPath": "/packages"
  },
  "whyChoose": {
    "eyebrow": "Why Couples Choose Us",
    "title": "Why DisplayAvenue for your wedding",
    "text": "WeddingSutra-informed craft, cinema-grade films and a calm crew that families trust on the biggest days."
  },
  "process": {
    "eyebrow": "How We Work",
    "title": "From WhatsApp enquiry to heirloom gallery",
    "text": ""
  },
  "testimonials": {
    "eyebrow": "Love Notes",
    "title": "Loved by couples across India",
    "text": "Real words from weddings, pre-weddings, maternity and milestone celebrations."
  },
  "faqs": {
    "eyebrow": "FAQs",
    "title": "Questions couples ask before booking",
    "text": "Clear answers on candid vs traditional, pricing, travel and deliverables.",
    "ctaLabel": "View All FAQs",
    "ctaPath": "/faqs"
  },
  "blogs": {
    "eyebrow": "Wedding Journal",
    "title": "Guides for planning your wedding visuals",
    "text": "",
    "ctaLabel": "Read the Journal",
    "ctaPath": "/blog"
  },
  "ctaBanner": {
    "eyebrow": "Book Your Date",
    "title": "Is your wedding date still open?",
    "text": "Check availability and reserve DisplayAvenue Studios — Mumbai’s premium wedding photography & film studio for celebrations that deserve forever.",
    "primaryLabel": "Book Consultation",
    "primaryPath": "/book-now"
  }
};

