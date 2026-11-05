export type SeoCity = {
  slug: string;
  name: string;
  state: string;
  blurb: string;
};

export type SeoService = {
  slug: string;
  name: string;
  short: string;
  serviceHref: string;
  pitch: string;
  outcomes: string[];
};

/** Top Indian cities for local SEO landing pages */
export const seoCities: SeoCity[] = [
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", blurb: "India’s commercial capital with dense local search and ads competition." },
  { slug: "delhi-ncr", name: "Delhi NCR", state: "Delhi", blurb: "High-intent B2C and B2B demand across Delhi, Noida, and Gurugram." },
  { slug: "bengaluru", name: "Bengaluru", state: "Karnataka", blurb: "Tech-first market where SaaS, startups, and services grow through digital." },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", blurb: "Fast-growing metro for healthcare, real estate, and professional services." },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", blurb: "Strong manufacturing + services economy with local Google demand." },
  { slug: "pune", name: "Pune", state: "Maharashtra", blurb: "Education, auto, and SME hub with excellent paid + organic opportunity." },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", blurb: "Business-heavy market where trust content and Google Ads convert well." },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", blurb: "Large local catchment for clinics, education, and retail brands." },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", blurb: "Tourism, jewellery, and local services with Maps-led discovery." },
  { slug: "surat", name: "Surat", state: "Gujarat", blurb: "Diamond, textile, and retail demand with strong WhatsApp-led sales." },
  { slug: "lucknow", name: "Lucknow", state: "Uttar Pradesh", blurb: "Growing metro for healthcare, education, and local service businesses." },
  { slug: "chandigarh", name: "Chandigarh", state: "Chandigarh", blurb: "Premium local market spanning Tricity catchments." },
  { slug: "indore", name: "Indore", state: "Madhya Pradesh", blurb: "Central India growth city for F&B, education, and retail." },
  { slug: "coimbatore", name: "Coimbatore", state: "Tamil Nadu", blurb: "Industrial + education city with B2B digital demand." },
  { slug: "kochi", name: "Kochi", state: "Kerala", blurb: "Tourism, healthcare, and services with bilingual search behaviour." },
  { slug: "nagpur", name: "Nagpur", state: "Maharashtra", blurb: "Logistics and regional commerce hub for central India." },
  { slug: "vadodara", name: "Vadodara", state: "Gujarat", blurb: "Industrial SME base that responds well to Google + Meta funnels." },
  { slug: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", blurb: "Coastal metro with healthcare, education, and hospitality demand." },
  { slug: "noida", name: "Noida", state: "Uttar Pradesh", blurb: "NCR tech and services corridor with high digital ad maturity." },
  { slug: "gurugram", name: "Gurugram", state: "Haryana", blurb: "Corporate + premium consumer market for performance marketing." },
  { slug: "thane", name: "Thane", state: "Maharashtra", blurb: "Mumbai MMR catchment with strong local SEO and Maps intent." },
  { slug: "navi-mumbai", name: "Navi Mumbai", state: "Maharashtra", blurb: "Planned city demand for clinics, education, and home services." },
  { slug: "mira-road", name: "Mira Road", state: "Maharashtra", blurb: "DisplayAvenue’s home market — dense residential and SME growth." },
];

export const seoServices: SeoService[] = [
  {
    slug: "google-ads",
    name: "Google Ads",
    short: "High-intent search campaigns",
    serviceHref: "/services/google-ads",
    pitch: "Capture people actively searching for your offer and send them to a focused landing page or WhatsApp.",
    outcomes: ["Search + call campaigns", "Negative keyword hygiene", "Conversion tracking", "Weekly optimization"],
  },
  {
    slug: "meta-ads",
    name: "Meta Ads",
    short: "Facebook & Instagram demand",
    serviceHref: "/services/meta-ads",
    pitch: "Build demand with creative testing, retargeting, and lead forms that feed your sales WhatsApp.",
    outcomes: ["Creative testing system", "Retargeting pools", "Lead quality filters", "Catalogue / lead ads"],
  },
  {
    slug: "seo",
    name: "SEO",
    short: "Organic Google growth",
    serviceHref: "/services/seo",
    pitch: "Rank for service and local keywords so you earn enquiries without paying for every click.",
    outcomes: ["Technical SEO", "Service page architecture", "Content that ranks", "Authority building"],
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    short: "Maps & Google Business Profile",
    serviceHref: "/services/local-seo",
    pitch: "Win the local pack and nearby searches for clinics, stores, and service businesses.",
    outcomes: ["GBP optimization", "Reviews engine", "Citations / NAP", "Local landing pages"],
  },
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    short: "Always-on brand + leads",
    serviceHref: "/services/social-media",
    pitch: "Turn Instagram and Facebook into a consistent enquiry channel with content and community ops.",
    outcomes: ["Content calendar", "Creative production", "Community replies", "Lead CTAs"],
  },
  {
    slug: "website-development",
    name: "Website Development",
    short: "Sites that convert",
    serviceHref: "/services/web-development",
    pitch: "Fast, mobile-first websites and landing pages built to turn traffic into calls and forms.",
    outcomes: ["Conversion-focused UX", "Speed & Core Web Vitals", "Tracking setup", "WhatsApp CTAs"],
  },
  {
    slug: "lead-generation",
    name: "Lead Generation",
    short: "Full-funnel enquiry systems",
    serviceHref: "/solutions/lead-generation",
    pitch: "Combine ads, SEO, landing pages, and sales follow-up into one predictable lead engine.",
    outcomes: ["Offer + funnel design", "Multi-channel acquisition", "CRM / WhatsApp handoff", "KPI reporting"],
  },
];

export function findCity(slug: string) {
  return seoCities.find((c) => c.slug === slug);
}

export function findService(slug: string) {
  return seoServices.find((s) => s.slug === slug);
}

export function locationPath(citySlug: string, serviceSlug?: string) {
  return serviceSlug ? `/locations/${citySlug}/${serviceSlug}` : `/locations/${citySlug}`;
}

export function buildLocationFaqs(city: SeoCity, service: SeoService) {
  return [
    {
      question: `Do you offer ${service.name} services in ${city.name}?`,
      answer: `Yes. DisplayAvenue runs ${service.name} for businesses in ${city.name}, ${city.state}, with strategy, creative, tracking, and weekly optimization.`,
    },
    {
      question: `How fast can ${service.name} start in ${city.name}?`,
      answer: `Most ${city.name} engagements kick off within 5–7 working days after briefing, access, and tracking setup. Urgent launches can move faster.`,
    },
    {
      question: `What budget do ${city.name} businesses usually need for ${service.name}?`,
      answer: `It depends on competition and goals. Many SMEs in ${city.name} start between ₹25,000 and ₹1,50,000 per month for media plus management. We’ll recommend a fit after a short audit.`,
    },
    {
      question: `Can I get a free plan before hiring DisplayAvenue?`,
      answer: `Yes. Use our free Strategy planner, chat with DA Growth AI on the website, or WhatsApp 9222 122333 for a mini-plan tailored to ${city.name}.`,
    },
  ];
}
