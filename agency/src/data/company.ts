export const company = {
  name: "DisplayAvenue",
  shortName: "DA",
  tagline: "Digital Growth. AI Powered.",
  website: "https://displayavenue.com",
  phone: "+91 9222 122333",
  phoneHref: "tel:+919222122333",
  whatsapp: "+91 9222 122333",
  whatsappHref: "https://wa.me/919222122333",
  email: "info@displayavenue.com",
  emailHref: "mailto:info@displayavenue.com",
  clientLogin: "https://displayavenue.com/client-login",
  address: {
    city: "Mumbai",
    lines: ["Mumbai, Maharashtra, India"],
    hours: "Mon-Sat · 10:00 AM - 7:00 PM IST",
  },
  googleMaps: {
    name: "Display Avenue",
    shareUrl: "https://share.google/OC1gFqDqJCDFjdL50",
    profileUrl: "https://www.google.com/search?kgmid=/g/11l59jbzkb&q=Display+Avenue",
    embedUrl:
      "https://maps.google.com/maps?q=Display+Avenue+Mumbai&hl=en&z=15&output=embed",
    kgmid: "/g/11l59jbzkb",
    placeId: "",
    placeQuery: "Display Avenue Mira Road Mumbai",
  },
  socials: {
    facebook: "https://www.facebook.com/displayavenue",
    instagram: "https://www.instagram.com/displayavenue",
    linkedin: "https://www.linkedin.com/company/displayavenue",
    youtube: "https://www.youtube.com/@displayavenue",
  },
  stats: {
    projects: "850+",
    clients: "500+",
    industries: "25+",
    leads: "10M+",
    satisfaction: "98%",
    revenue: "$50M+",
    countries: "18+",
    years: "8+",
    experts: "50+",
    avgRoi: "320%",
  },
  catalogueUrl: "/catalogue/DisplayAvenue-Catalogue.pdf",
  catalogueFileName: "DisplayAvenue-Catalogue.pdf",
  catalogueUpdatedAt: "",
};

export type MegaKey = "whatWeDo" | "industries" | "solutions" | "aiPlatform";

export type NavItem = {
  label: string;
  href: string;
  mega: MegaKey | false;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", mega: false },
  { label: "Why DisplayAvenue", href: "/why-displayavenue", mega: false },
  { label: "What We Do", href: "/services", mega: "whatWeDo" },
  { label: "Industries", href: "/industries", mega: "industries" },
  { label: "Industry Solutions", href: "/industry-solutions", mega: false },
  { label: "Solutions", href: "/solutions", mega: "solutions" },
  { label: "AI Platform", href: "/ai-platform", mega: "aiPlatform" },
  { label: "Packages", href: "/packages", mega: false },
  { label: "Locations", href: "/locations", mega: false },
  { label: "Free Tools", href: "/free-tools", mega: false },
  { label: "Case Studies", href: "/case-studies", mega: false },
  { label: "Portfolio", href: "/portfolio", mega: false },
  { label: "Resources", href: "/resources", mega: false },
];
