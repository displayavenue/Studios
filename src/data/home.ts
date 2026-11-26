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
    "title": "Wedding Photographer in Mumbai | Candid Photography & Films | DisplayAvenue Studios",
    "description": "Wedding photographer in Mumbai for Hindu, Muslim, Christian, Sikh, Parsi and interfaith weddings — candid photography, cinematic films, pre-wedding, maternity and events across India."
  },
  "hero": {
    "brand": "DisplayAvenue Studios",
    "eyebrow": "Wedding photographers & filmmakers in Mumbai",
    "headline": "Weddings of every faith, told like cinema.",
    "description": "Pheras, nikah, church vows, Anand Karaj and everything in between — photographed and filmed by one Mumbai studio, anywhere in India.",
    "primaryCtaLabel": "Check your date",
    "primaryCtaPath": "/availability",
    "secondaryCtaLabel": "See our weddings",
    "secondaryCtaPath": "/portfolio",
    "image": "/images/indian/wedding-01.jpg",
    "imageAlt": "Luxury Indian wedding couple in designer lehenga and sherwani — DisplayAvenue Studios Mumbai"
  },
  "brands": {
    "label": "Trusted by Couples Across India"
  },
  "services": {
    "eyebrow": "What we shoot",
    "title": "What we capture",
    "text": "Wedding photography & videography, pre-wedding films, engagement, maternity, birthday and complete event coverage — photo and film for every celebration.",
    "ctaLabel": "All services",
    "ctaPath": "/services"
  },
  "portfolio": {
    "eyebrow": "Selected work",
    "title": "Moments, not poses",
    "text": "Destination palaces, Mumbai banquets, pre-wedding chemistry and milestone celebrations — a portfolio built for couples.",
    "ctaLabel": "View full portfolio",
    "ctaPath": "/portfolio"
  },
  "packages": {
    "eyebrow": "Wedding Packages",
    "title": "Essential, Signature, Luxury",
    "text": "Starting prices for photography and film. Every package can be shaped around your ceremonies, days and city.",
    "featuredBadge": "Most booked",
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
    "eyebrow": "",
    "title": "From our couples",
    "text": ""
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

