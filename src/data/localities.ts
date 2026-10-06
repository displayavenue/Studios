import { img } from "./images";

export type Locality = {
  slug: "dahisar" | "mira-road" | "bhayandar";
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  image: string;
  highlights: string[];
  buyerFit: string[];
  avgSaleHint: string;
  avgRentHint: string;
  seoTitle: string;
  seoDescription: string;
};

export const localities: Locality[] = [
  {
    slug: "mira-road",
    name: "Mira Road",
    shortName: "Mira Road",
    tagline: "Family suburbs, strong rental demand, growing commercial strips.",
    summary:
      "Mira Road East remains one of Western Mumbai’s most active residential markets — societies near Kanakia, Beverly Park, and station corridors see steady end-user and investor interest.",
    image: img.miraRoadFeel,
    highlights: [
      "Dense society inventory (1–3 BHK)",
      "Good Western line connectivity",
      "Retail & office demand on main roads",
      "Popular for first-time buyers",
    ],
    buyerFit: [
      "End-user families",
      "Investors seeking rental yield",
      "Relocating professionals",
    ],
    avgSaleHint: "1–3 BHK resale commonly from ~₹45L to ₹1.5Cr+ depending on society & carpet",
    avgRentHint: "1BHK from ~₹15–22k · 2BHK from ~₹25–40k (furnishing varies)",
    seoTitle: "Flats for Sale & Rent in Mira Road | DisplayAvenue Realty",
    seoDescription:
      "Buy, sell or rent residential & commercial property in Mira Road East. Local listings, site visits and WhatsApp support from DisplayAvenue Realty.",
  },
  {
    slug: "dahisar",
    name: "Dahisar",
    shortName: "Dahisar",
    tagline: "Gateway suburb with established societies and WEH access.",
    summary:
      "Dahisar East & West offer a mix of older societies and upgraded inventory — preferred by buyers who want Mumbai municipal limits feel with strong Borivali connectivity.",
    image: img.societyExterior,
    highlights: [
      "East–West pockets for different budgets",
      "Proximity to National Park & SV Road belt",
      "Office & clinic demand in commercial nodes",
      "Redevelopment interest in older societies",
    ],
    buyerFit: [
      "Upgraders from Mira-Bhayandar",
      "Families wanting quieter lanes",
      "Clinic / office seekers",
    ],
    avgSaleHint: "2–3 BHK resale often spans mid-budget to premium society pricing",
    avgRentHint: "2BHK rentals typically mid-₹20ks depending on West vs East",
    seoTitle: "Property in Dahisar East & West | Buy · Rent · Commercial",
    seoDescription:
      "Explore flats, shops and offices in Dahisar. Local advisory for sale, rent and society redevelopment with DisplayAvenue Realty.",
  },
  {
    slug: "bhayandar",
    name: "Bhayandar",
    shortName: "Bhayandar",
    tagline: "Value-led homes, rising towers, and practical commercial stock.",
    summary:
      "Bhayandar East & West attract buyers seeking larger carpet for the budget, plus landlords and shop owners serving a fast-growing catchment.",
    image: img.highrise,
    highlights: [
      "Strong value-for-carpet proposition",
      "Newer towers with amenities",
      "Shop & warehouse opportunities",
      "Growing owner-occupier base",
    ],
    buyerFit: [
      "Budget-conscious families",
      "Investors in East/West pockets",
      "Retail & warehouse operators",
    ],
    avgSaleHint: "Competitive 2–3 BHK pricing vs inner suburbs; project-dependent",
    avgRentHint: "1–2 BHK rentals popular with working families & bachelors (as society rules allow)",
    seoTitle: "Flats & Shops in Bhayandar | DisplayAvenue Realty",
    seoDescription:
      "Find homes, shops and warehouses in Bhayandar East & West. Local site visits and clear deal support from DisplayAvenue Realty.",
  },
];

export function getLocality(slug: string) {
  return localities.find((l) => l.slug === slug);
}
