export type SeoCity = {
  slug: string;
  name: string;
  state: string;
  blurb: string;
  /** Priority for hub ordering: mmr > tier1 > standard */
  tier?: "mmr" | "tier1" | "standard";
  neighbourhoods?: string[];
  industries?: string[];
  pricingHint?: string;
  proof?: string;
  tldr?: string;
  mapQuery?: string;
  faqs?: { question: string; answer: string }[];
  /** Optional Marathi one-liner for MMR pages */
  marathiHint?: string;
};

export type SeoService = {
  slug: string;
  name: string;
  short: string;
  serviceHref: string;
  pitch: string;
  outcomes: string[];
  costFaq?: string;
  howItWorks?: string[];
};

/** Top Indian cities for local SEO landing pages — MMR first */
export const seoCities: SeoCity[] = [
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    tier: "mmr",
    blurb: "India’s commercial capital with dense local search and ads competition.",
    tldr:
      "DisplayAvenue is a Mumbai-based digital marketing agency helping SMEs get Google and Instagram enquiries through Ads, SEO, Local SEO, websites, and WhatsApp follow-up.",
    neighbourhoods: [
      "Andheri",
      "Bandra",
      "Powai",
      "Lower Parel",
      "Dadar",
      "Goregaon",
      "Malad",
      "Borivali",
      "Chembur",
      "Worli",
    ],
    industries: ["Clinics & healthcare", "Real estate", "Education", "Retail & D2C", "Professional services"],
    pricingHint: "Many Mumbai SMEs start between ₹35,000–₹1,50,000/month for media + management, depending on competition.",
    proof: "Home base for DisplayAvenue — pan-India delivery with deep MMR market knowledge.",
    mapQuery: "Display+Avenue+Mumbai",
    marathiHint: "मुंबईतील व्यवसायांसाठी Google Ads, SEO आणि WhatsApp लीड सिस्टम्स.",
    faqs: [
      {
        question: "Is DisplayAvenue a digital marketing agency in Mumbai?",
        answer:
          "Yes. DisplayAvenue is based in the Mumbai Metropolitan Region and serves businesses across Mumbai with Google Ads, Meta Ads, SEO, Local SEO, websites, and lead systems.",
      },
      {
        question: "Which Mumbai areas do you work in?",
        answer:
          "We support clients across Andheri, Bandra, Powai, Lower Parel, Goregaon, Malad, Borivali, Chembur, Worli and surrounding suburbs — plus remote delivery pan-India.",
      },
      {
        question: "How do Mumbai businesses usually start with you?",
        answer:
          "Most start with a free growth call or WhatsApp mini-plan, then a 30-day sprint focused on one channel (often Google Ads or Local SEO) with clear enquiry targets.",
      },
    ],
  },
  {
    slug: "navi-mumbai",
    name: "Navi Mumbai",
    state: "Maharashtra",
    tier: "mmr",
    blurb: "Planned city demand for clinics, education, and home services.",
    tldr:
      "DisplayAvenue helps Navi Mumbai businesses rank on Google Maps, run Google/Meta ads, and convert website visitors into WhatsApp enquiries.",
    neighbourhoods: ["Vashi", "Nerul", "Kharghar", "Belapur", "Sanpada", "Seawoods", "Panvel corridor"],
    industries: ["Clinics", "Education & coaching", "Home services", "Real estate", "Retail"],
    pricingHint: "Navi Mumbai local campaigns often start from ₹25,000–₹1,00,000/month depending on Maps vs paid mix.",
    proof: "Strong fit for multi-location clinics and coaching brands across Vashi–Kharghar.",
    mapQuery: "Navi+Mumbai+Maharashtra",
    marathiHint: "नवी मुंबईतील लोकल SEO, Google Ads आणि वेबसाइट लीड्स.",
    faqs: [
      {
        question: "Do you offer Local SEO in Navi Mumbai?",
        answer:
          "Yes. We optimize Google Business Profiles, reviews, citations, and local landing pages for Navi Mumbai neighbourhoods like Vashi, Nerul, and Kharghar.",
      },
      {
        question: "Can you run Google Ads for Navi Mumbai only?",
        answer:
          "Yes. We geo-target Navi Mumbai (and nearby pin codes) so budget is not wasted on irrelevant Mumbai-wide clicks.",
      },
    ],
  },
  {
    slug: "thane",
    name: "Thane",
    state: "Maharashtra",
    tier: "mmr",
    blurb: "Mumbai MMR catchment with strong local SEO and Maps intent.",
    tldr:
      "DisplayAvenue runs Google Ads, Local SEO, and conversion websites for Thane businesses that want more calls and WhatsApp chats from nearby buyers.",
    neighbourhoods: ["Thane West", "Ghodbunder Road", "Hiranandani Estate", "Majiwada", "Kopri", "Wagle Estate"],
    industries: ["Healthcare", "Education", "Interior & home services", "Retail", "B2B services"],
    pricingHint: "Thane SME programs commonly begin around ₹25,000–₹1,20,000/month for ads + management.",
    proof: "Ideal for Ghodbunder Road and Thane West service businesses competing in Maps packs.",
    mapQuery: "Thane+West+Maharashtra",
    marathiHint: "ठाणे वेस्ट आणि घाटकोपर रोड व्यवसायांसाठी लोकल ग्रोथ प्लॅन्स.",
    faqs: [
      {
        question: "Do you work with Thane West businesses?",
        answer:
          "Yes. We support Thane West, Ghodbunder Road, Hiranandani Estate and nearby areas with Local SEO, Google Ads, and WhatsApp lead follow-up.",
      },
      {
        question: "What works better in Thane — SEO or Ads?",
        answer:
          "Most Thane service businesses win with both: Local SEO for Maps demand and Google Ads for high-intent keywords while organic rankings build.",
      },
    ],
  },
  {
    slug: "mira-road",
    name: "Mira Road",
    state: "Maharashtra",
    tier: "mmr",
    blurb: "DisplayAvenue’s home market — dense residential and SME growth.",
    tldr:
      "DisplayAvenue is headquartered in the Mira Road / MMR belt and helps local SMEs grow with Google, Meta, SEO, and WhatsApp systems.",
    neighbourhoods: ["Mira Road East", "Bhayandar", "Kashimira", "Shanti Nagar"],
    industries: ["Clinics", "Education", "Retail", "Home services", "Local brands"],
    pricingHint: "Local Mira Road campaigns can start lean (from ~₹20,000–₹80,000/month) with tight geo targeting.",
    proof: "Our home market — fast WhatsApp response and deep local context.",
    mapQuery: "Mira+Road+Mumbai",
    marathiHint: "मीरा रोड येथील आमचे होम मार्केट — जलद WhatsApp सपोर्ट.",
    faqs: [
      {
        question: "Where is DisplayAvenue based?",
        answer:
          "DisplayAvenue operates from the Mumbai Metropolitan Region with strong roots in Mira Road, serving Mumbai, Navi Mumbai, Thane, and pan-India clients.",
      },
    ],
  },
  {
    slug: "panvel",
    name: "Panvel",
    state: "Maharashtra",
    tier: "mmr",
    blurb: "Navi Mumbai extension market with rising Maps and ads demand.",
    tldr: "Digital marketing support for Panvel businesses — Local SEO, Google Ads, and enquiry-focused websites.",
    neighbourhoods: ["Old Panvel", "New Panvel", "Kalamboli", "Kamothe"],
    industries: ["Real estate", "Education", "Healthcare", "Retail"],
    pricingHint: "Many Panvel SMEs begin with Local SEO + light Google Ads from ₹20,000–₹75,000/month.",
    mapQuery: "Panvel+Maharashtra",
  },
  {
    slug: "kalyan",
    name: "Kalyan",
    state: "Maharashtra",
    tier: "mmr",
    blurb: "Kalyan–Dombivli corridor with strong local service search demand.",
    tldr: "Google Maps, ads, and WhatsApp lead systems for Kalyan and nearby Dombivli businesses.",
    neighbourhoods: ["Kalyan West", "Kalyan East", "Dombivli", "Titwala corridor"],
    industries: ["Healthcare", "Education", "Retail", "Home services"],
    pricingHint: "Local Kalyan programs often start around ₹20,000–₹70,000/month.",
    mapQuery: "Kalyan+Maharashtra",
  },
  { slug: "delhi-ncr", name: "Delhi NCR", state: "Delhi", tier: "tier1", blurb: "High-intent B2C and B2B demand across Delhi, Noida, and Gurugram." },
  { slug: "bengaluru", name: "Bengaluru", state: "Karnataka", tier: "tier1", blurb: "Tech-first market where SaaS, startups, and services grow through digital." },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", tier: "tier1", blurb: "Fast-growing metro for healthcare, real estate, and professional services." },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", tier: "tier1", blurb: "Strong manufacturing + services economy with local Google demand." },
  { slug: "pune", name: "Pune", state: "Maharashtra", tier: "tier1", blurb: "Education, auto, and SME hub with excellent paid + organic opportunity." },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", tier: "tier1", blurb: "Business-heavy market where trust content and Google Ads convert well." },
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
  { slug: "noida", name: "Noida", state: "Uttar Pradesh", tier: "tier1", blurb: "NCR tech and services corridor with high digital ad maturity." },
  { slug: "gurugram", name: "Gurugram", state: "Haryana", tier: "tier1", blurb: "Corporate + premium consumer market for performance marketing." },
];

export const mmrCitySlugs = ["mumbai", "navi-mumbai", "thane", "mira-road", "panvel", "kalyan"] as const;

export const seoServices: SeoService[] = [
  {
    slug: "google-ads",
    name: "Google Ads",
    short: "High-intent search campaigns",
    serviceHref: "/services/google-ads",
    pitch: "Capture people actively searching for your offer and send them to a focused landing page or WhatsApp.",
    outcomes: ["Search + call campaigns", "Negative keyword hygiene", "Conversion tracking", "Weekly optimization"],
    costFaq:
      "Many Indian SMEs start Google Ads between ₹25,000 and ₹1,50,000 per month for media, plus management. Competitive metros like Mumbai often need the higher end.",
    howItWorks: [
      "Audit keywords, competitors, and offer",
      "Launch exact/phrase campaigns with conversion tracking",
      "Send traffic to one focused page or WhatsApp",
      "Optimize search terms and budget weekly",
    ],
  },
  {
    slug: "meta-ads",
    name: "Meta Ads",
    short: "Facebook & Instagram demand",
    serviceHref: "/services/meta-ads",
    pitch: "Build demand with creative testing, retargeting, and lead forms that feed your sales WhatsApp.",
    outcomes: ["Creative testing system", "Retargeting pools", "Lead quality filters", "Catalogue / lead ads"],
    costFaq:
      "Meta lead programs for SMEs often start around ₹20,000–₹1,00,000/month in media. Quality depends on form questions and reply speed.",
    howItWorks: [
      "Define offer and audience",
      "Launch creative tests + Instant Forms or Click-to-WhatsApp",
      "Filter leads by budget, city, timeline",
      "Retarget warm visitors weekly",
    ],
  },
  {
    slug: "seo",
    name: "SEO",
    short: "Organic Google growth",
    serviceHref: "/services/seo",
    pitch: "Rank for service and local keywords so you earn enquiries without paying for every click.",
    outcomes: ["Technical SEO", "Service page architecture", "Content that ranks", "Authority building"],
    costFaq:
      "SEO retainers for Indian SMEs commonly range ₹20,000–₹80,000/month depending on competition and page volume.",
    howItWorks: [
      "Fix technical and indexation issues",
      "Build city × service pages that convert",
      "Publish answer-led content",
      "Earn links and track rankings + leads",
    ],
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    short: "Maps & Google Business Profile",
    serviceHref: "/services/local-seo",
    pitch: "Win the local pack and nearby searches for clinics, stores, and service businesses.",
    outcomes: ["GBP optimization", "Reviews engine", "Citations / NAP", "Local landing pages"],
    costFaq:
      "Local SEO packages often start ₹15,000–₹60,000/month for GBP, reviews, citations, and local pages.",
    howItWorks: [
      "Optimize Google Business Profile",
      "Build review and photo cadence",
      "Fix NAP citations",
      "Publish local landing pages",
    ],
  },
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    short: "Always-on brand + leads",
    serviceHref: "/services/social-media",
    pitch: "Turn Instagram and Facebook into a consistent enquiry channel with content and community ops.",
    outcomes: ["Content calendar", "Creative production", "Community replies", "Lead CTAs"],
    costFaq:
      "Social retainers typically run ₹20,000–₹75,000/month for content + community, excluding ad spend.",
    howItWorks: [
      "Position offer and content pillars",
      "Produce weekly creatives",
      "Reply fast on DMs",
      "Route hot chats to WhatsApp/sales",
    ],
  },
  {
    slug: "website-development",
    name: "Website Development",
    short: "Sites that convert",
    serviceHref: "/services/web-development",
    pitch: "Fast, mobile-first websites and landing pages built to turn traffic into calls and forms.",
    outcomes: ["Conversion-focused UX", "Speed & Core Web Vitals", "Tracking setup", "WhatsApp CTAs"],
    costFaq:
      "Landing pages and SME sites vary widely; many projects start from ₹40,000–₹2,50,000 depending on scope.",
    howItWorks: [
      "Clarify offer and primary CTA",
      "Design mobile-first pages",
      "Ship speed + tracking",
      "Connect WhatsApp and forms",
    ],
  },
  {
    slug: "lead-generation",
    name: "Lead Generation",
    short: "Full-funnel enquiry systems",
    serviceHref: "/solutions/lead-generation",
    pitch: "Combine ads, SEO, landing pages, and sales follow-up into one predictable lead engine.",
    outcomes: ["Offer + funnel design", "Multi-channel acquisition", "CRM / WhatsApp handoff", "KPI reporting"],
    costFaq:
      "Full-funnel lead systems are scoped after an audit — channel mix drives budget more than a flat package price.",
    howItWorks: [
      "Map offer and buyer journey",
      "Launch acquisition channels",
      "Handoff to WhatsApp/CRM",
      "Report cost per booked job",
    ],
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

export function mmrCities(): SeoCity[] {
  return seoCities.filter((c) => c.tier === "mmr");
}

export function citiesByTier(): { mmr: SeoCity[]; tier1: SeoCity[]; other: SeoCity[] } {
  return {
    mmr: seoCities.filter((c) => c.tier === "mmr"),
    tier1: seoCities.filter((c) => c.tier === "tier1"),
    other: seoCities.filter((c) => !c.tier || c.tier === "standard"),
  };
}

export function cityWhatsAppHref(baseHref: string, city: SeoCity, service?: SeoService) {
  const text = service
    ? `Hi DisplayAvenue, I need ${service.name} help in ${city.name}.`
    : `Hi DisplayAvenue, I need digital marketing help in ${city.name}.`;
  if (baseHref.includes("wa.me")) {
    const url = new URL(baseHref);
    url.searchParams.set("text", text);
    return url.toString();
  }
  return `${baseHref}${baseHref.includes("?") ? "&" : "?"}text=${encodeURIComponent(text)}`;
}

export function buildLocationFaqs(city: SeoCity, service: SeoService) {
  const base = [
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
      answer:
        city.pricingHint ||
        service.costFaq ||
        `It depends on competition and goals. Many SMEs in ${city.name} start between ₹25,000 and ₹1,50,000 per month for media plus management. We’ll recommend a fit after a short audit.`,
    },
    {
      question: `How does ${service.name} work with DisplayAvenue?`,
      answer: (service.howItWorks || []).length
        ? `${service.howItWorks!.join(" → ")}.`
        : `We audit, launch, track conversions, and optimize weekly with WhatsApp support for your ${city.name} team.`,
    },
    {
      question: `Can I get a free plan before hiring DisplayAvenue?`,
      answer: `Yes. Use our free Strategy planner, chat with DA Growth AI on the website, or WhatsApp 9222 122333 for a mini-plan tailored to ${city.name}.`,
    },
  ];
  const cityExtra = (city.faqs || []).slice(0, 2);
  return [...cityExtra, ...base].slice(0, 7);
}

export function locationTldr(city: SeoCity, service?: SeoService): string {
  if (service) {
    if (city.tldr) {
      return `${city.tldr.replace(/\.$/, "")} For ${service.name.toLowerCase()} in ${city.name}, we focus on measurable enquiries — not vanity traffic.`;
    }
    return `${service.name} in ${city.name}: ${service.pitch}`;
  }
  return (
    city.tldr ||
    `DisplayAvenue helps ${city.name} businesses grow with Google Ads, Meta Ads, SEO, Local SEO, websites, and WhatsApp lead systems.`
  );
}
