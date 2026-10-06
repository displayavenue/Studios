import { img } from "./images";

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  image: string;
  bullets: string[];
  ctaLabel: string;
  ctaPath: string;
  category: "residential" | "commercial" | "advisory";
};

export const services: Service[] = [
  {
    slug: "buy-homes",
    title: "Buy residential property",
    short: "Shortlists matched to budget, society and commute.",
    description:
      "From 1BHK starter homes to family 3BHKs across Dahisar, Mira Road and Bhayandar, we verify listings, arrange visits and support negotiation through documentation.",
    image: img.apartmentModern,
    bullets: [
      "Curated society shortlists",
      "Accompanied site visits",
      "Price benchmarking",
      "Loan & documentation guidance",
    ],
    ctaLabel: "Browse homes for sale",
    ctaPath: "/buy",
    category: "residential",
  },
  {
    slug: "sell-property",
    title: "Sell or list your property",
    short: "Correct pricing, serious buyers, faster closures.",
    description:
      "Get a free valuation, professional listing presentation, and outreach to active buyers in Mira-Bhayandar and Dahisar.",
    image: img.handshake,
    bullets: [
      "Free property valuation",
      "Listing + photo guidance",
      "Qualified buyer screening",
      "Offer management",
    ],
    ctaLabel: "List your property",
    ctaPath: "/sell",
    category: "residential",
  },
  {
    slug: "rentals",
    title: "Rentals for owners & tenants",
    short: "Move-in ready matches and tenant placement.",
    description:
      "Whether you need a rental home or a reliable tenant for your flat, we handle visits, expectations and agreement basics.",
    image: img.apartmentBright,
    bullets: [
      "Tenant shortlisting",
      "Owner listing support",
      "Visit coordination",
      "Deposit & agreement checklist",
    ],
    ctaLabel: "See rentals",
    ctaPath: "/rent",
    category: "residential",
  },
  {
    slug: "commercial",
    title: "Commercial spaces",
    short: "Shops, offices and warehouses with catchment fit.",
    description:
      "Retail frontage near stations, plug-and-play offices, and practical godown space across Mira Road, Dahisar and Bhayandar.",
    image: img.officeSpace,
    bullets: [
      "Shop & showroom search",
      "Office cabin / floors",
      "Warehouse / godown",
      "Lease term advisory",
    ],
    ctaLabel: "Explore commercial",
    ctaPath: "/commercial",
    category: "commercial",
  },
  {
    slug: "redevelopment",
    title: "Society redevelopment advisory",
    short: "Owner-first guidance for ageing societies.",
    description:
      "We help societies understand the redevelopment journey, feasibility conversations, builder shortlists, and owner questions answered in plain language.",
    image: img.redevelopment,
    bullets: [
      "Society consultation",
      "Process walkthrough",
      "Builder introductions",
      "Owner FAQs & checklists",
    ],
    ctaLabel: "Talk redevelopment",
    ctaPath: "/redevelopment",
    category: "advisory",
  },
  {
    slug: "valuation",
    title: "Free property valuation",
    short: "Know your number before you list or negotiate.",
    description:
      "Local comparable-based valuation for flats and shops in our core localities, a fast lead-in to a confident sale or purchase.",
    image: img.valuation,
    bullets: [
      "Local comps",
      "Society premium factors",
      "Rent vs sell view",
      "Next-step plan",
    ],
    ctaLabel: "Request valuation",
    ctaPath: "/sell#valuation",
    category: "advisory",
  },
];

export const homeServices = services.map((s) => s.slug);
