import { img, propertyGallery } from "./images";

export type PropertyType =
  | "apartment"
  | "shop"
  | "office"
  | "warehouse"
  | "plot";

export type ListingIntent = "sale" | "rent";

export type PropertyCategory = "residential" | "commercial";

export type Property = {
  id: string;
  slug: string;
  title: string;
  intent: ListingIntent;
  category: PropertyCategory;
  type: PropertyType;
  locality: "dahisar" | "mira-road" | "bhayandar";
  localityLabel: string;
  society?: string;
  bhk?: number;
  bathrooms?: number;
  carpetSqft: number;
  builtUpSqft?: number;
  floor?: string;
  parking?: string;
  furnishing?: "unfurnished" | "semi-furnished" | "fully-furnished";
  price: number;
  priceLabel: string;
  priceNegotiable?: boolean;
  deposit?: string;
  possession: string;
  highlights: string[];
  amenities: string[];
  description: string;
  nearby: string[];
  images: string[];
  featured?: boolean;
  status: "available" | "under-offer" | "rented" | "sold";
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const lac = (n: number) => `₹${n} Lac`;
const cr = (n: number) => `₹${n} Cr`;

export const properties: Property[] = [
  {
    id: "p1",
    slug: "2bhk-kanakia-mira-road-east-sale",
    title: "Spacious 2BHK in Kanakia, Mira Road East",
    intent: "sale",
    category: "residential",
    type: "apartment",
    locality: "mira-road",
    localityLabel: "Mira Road East",
    society: "Unique Garden / Kanakia belt",
    bhk: 2,
    bathrooms: 2,
    carpetSqft: 780,
    builtUpSqft: 980,
    floor: "7th of 15",
    parking: "1 covered",
    furnishing: "semi-furnished",
    price: 8500000,
    priceLabel: lac(85),
    priceNegotiable: true,
    possession: "Ready to move",
    highlights: ["Near station connectivity", "Cross ventilation", "Society amenities"],
    amenities: ["Lift", "Security", "Park", "Gym", "Power backup"],
    description:
      "Well-maintained 2BHK ideal for families looking at Mira Road East. Bright living room, modular kitchen start, and easy access to markets and the Western line.",
    nearby: ["Mira Road station ~10 min", "Schools & colleges nearby", "Hospitals & malls"],
    images: propertyGallery.flatA,
    featured: true,
    status: "available",
  },
  {
    id: "p2",
    slug: "3bhk-dahisar-east-sale",
    title: "Sunlit 3BHK Society Flat, Dahisar East",
    intent: "sale",
    category: "residential",
    type: "apartment",
    locality: "dahisar",
    localityLabel: "Dahisar East",
    society: "Established society near SV Road belt",
    bhk: 3,
    bathrooms: 3,
    carpetSqft: 1050,
    builtUpSqft: 1280,
    floor: "5th of 12",
    parking: "1 covered + stack",
    furnishing: "unfurnished",
    price: 14500000,
    priceLabel: cr(1.45),
    possession: "Ready to move",
    highlights: ["Corner flat", "Vastu-friendly layout", "Quiet internal road"],
    amenities: ["Lift", "Security", "Clubhouse", "Children's play area"],
    description:
      "Family-ready 3BHK in Dahisar East with strong resale demand and good connectivity toward Borivali and the Western Express Highway.",
    nearby: ["Dahisar station", "National Park access", "Daily markets"],
    images: propertyGallery.flatB,
    featured: true,
    status: "available",
  },
  {
    id: "p3",
    slug: "1bhk-bhayandar-west-rent",
    title: "1BHK Semi-Furnished Rental, Bhayandar West",
    intent: "rent",
    category: "residential",
    type: "apartment",
    locality: "bhayandar",
    localityLabel: "Bhayandar West",
    society: "Gated society near Jesal Park belt",
    bhk: 1,
    bathrooms: 1,
    carpetSqft: 420,
    floor: "3rd of 7",
    parking: "Bike + open car",
    furnishing: "semi-furnished",
    price: 18000,
    priceLabel: `${inr(18000)}/mo`,
    deposit: "2 months",
    possession: "Immediate",
    highlights: ["Budget-friendly", "Family society", "Natural light"],
    amenities: ["Lift", "Security", "Water supply"],
    description:
      "Clean 1BHK for working professionals or small families. Walking distance to local shops and auto stands.",
    nearby: ["Bhayandar station", "Local markets", "Schools"],
    images: propertyGallery.flatC,
    featured: true,
    status: "available",
  },
  {
    id: "p4",
    slug: "2bhk-mira-road-east-rent",
    title: "2BHK Fully Furnished, Mira Road East",
    intent: "rent",
    category: "residential",
    type: "apartment",
    locality: "mira-road",
    localityLabel: "Mira Road East",
    society: "Premium society near Beverly Park",
    bhk: 2,
    bathrooms: 2,
    carpetSqft: 750,
    floor: "10th of 22",
    parking: "1 covered",
    furnishing: "fully-furnished",
    price: 32000,
    priceLabel: `${inr(32000)}/mo`,
    deposit: "3 months",
    possession: "From next month",
    highlights: ["Ready furniture", "High floor view", "Power backup"],
    amenities: ["Gym", "Pool", "Clubhouse", "Security", "Visitor parking"],
    description:
      "Move-in ready 2BHK with appliances, suited for relocating families and corporate transfers.",
    nearby: ["Mira-Bhayandar Road", "Malls & multiplex", "Hospitals"],
    images: propertyGallery.flatA,
    featured: true,
    status: "available",
  },
  {
    id: "p5",
    slug: "shop-mira-road-station-rent",
    title: "Ground Floor Shop near Mira Road Station",
    intent: "rent",
    category: "commercial",
    type: "shop",
    locality: "mira-road",
    localityLabel: "Mira Road East",
    carpetSqft: 320,
    floor: "Ground",
    parking: "Front access",
    price: 55000,
    priceLabel: `${inr(55000)}/mo`,
    deposit: "6–10 months (negotiable)",
    possession: "Immediate",
    highlights: ["High footfall", "Main road visibility", "Ideal F&B / retail"],
    amenities: ["Shutters", "Power connection", "Water"],
    description:
      "Prime retail frontage for brands looking at Mira Road’s daily traffic catchment.",
    nearby: ["Mira Road station", "Bus routes", "Dense residential catchment"],
    images: propertyGallery.commercialA,
    featured: true,
    status: "available",
  },
  {
    id: "p6",
    slug: "office-dahisar-east-sale",
    title: "Furnished Office Cabin, Dahisar East",
    intent: "sale",
    category: "commercial",
    type: "office",
    locality: "dahisar",
    localityLabel: "Dahisar East",
    carpetSqft: 650,
    floor: "4th of 8",
    parking: "2 dedicated",
    furnishing: "fully-furnished",
    price: 9800000,
    priceLabel: lac(98),
    possession: "Ready",
    highlights: ["Cabin + open workstations", "Lift access", "Corporate ready"],
    amenities: ["AC", "Reception space", "Restroom", "Security"],
    description:
      "Compact office suited for consultants, clinics, or boutique teams wanting Dahisar connectivity.",
    nearby: ["WEH access", "Dahisar station", "Hotels & F&B"],
    images: propertyGallery.commercialB,
    featured: false,
    status: "available",
  },
  {
    id: "p7",
    slug: "3bhk-bhayandar-east-sale",
    title: "Vast 3BHK with Balcony, Bhayandar East",
    intent: "sale",
    category: "residential",
    type: "apartment",
    locality: "bhayandar",
    localityLabel: "Bhayandar East",
    society: "Newer tower project",
    bhk: 3,
    bathrooms: 3,
    carpetSqft: 980,
    builtUpSqft: 1200,
    floor: "12th of 20",
    parking: "2 covered",
    furnishing: "semi-furnished",
    price: 11800000,
    priceLabel: cr(1.18),
    possession: "Ready to move",
    highlights: ["Sea-breeze corridor", "Two parking", "Modern amenities"],
    amenities: ["Gym", "Garden", "Security", "Power backup", "Jogging track"],
    description:
      "Value-focused 3BHK for end-users upgrading within Bhayandar with strong amenities.",
    nearby: ["Bhayandar station", "Schools", "Weekly markets"],
    images: propertyGallery.flatB,
    featured: true,
    status: "available",
  },
  {
    id: "p8",
    slug: "warehouse-bhayandar-rent",
    title: "Warehouse / Godown Space, Bhayandar",
    intent: "rent",
    category: "commercial",
    type: "warehouse",
    locality: "bhayandar",
    localityLabel: "Bhayandar East",
    carpetSqft: 2500,
    floor: "Ground + mezzanine",
    parking: "Truck loading bay",
    price: 125000,
    priceLabel: `${inr(125000)}/mo`,
    deposit: "6 months",
    possession: "15 days notice",
    highlights: ["Loading access", "Height clearance", "Industrial pocket"],
    amenities: ["Power", "Water", "Security cabin", "Toilet"],
    description:
      "Practical warehousing for distributors and e-commerce sellers serving Mira-Bhayandar.",
    nearby: ["Highway connectors", "Labour availability", "Local transporters"],
    images: propertyGallery.warehouseA,
    featured: false,
    status: "available",
  },
  {
    id: "p9",
    slug: "2bhk-dahisar-west-rent",
    title: "Quiet 2BHK Rental, Dahisar West",
    intent: "rent",
    category: "residential",
    type: "apartment",
    locality: "dahisar",
    localityLabel: "Dahisar West",
    society: "Well-kept society near Link Road",
    bhk: 2,
    bathrooms: 2,
    carpetSqft: 690,
    floor: "2nd of 6",
    parking: "1 open",
    furnishing: "unfurnished",
    price: 28000,
    priceLabel: `${inr(28000)}/mo`,
    deposit: "3 months",
    possession: "Immediate",
    highlights: ["Low-rise society", "Family neighbourhood", "Good water"],
    amenities: ["Security", "Society office", "Park nearby"],
    description:
      "Simple, well-located 2BHK for tenants who prefer Dahisar West’s quieter residential pockets.",
    nearby: ["Link Road", "Markets", "Borivali access"],
    images: propertyGallery.flatC,
    featured: false,
    status: "available",
  },
  {
    id: "p10",
    slug: "shop-bhayandar-west-sale",
    title: "Corner Retail Shop for Sale, Bhayandar West",
    intent: "sale",
    category: "commercial",
    type: "shop",
    locality: "bhayandar",
    localityLabel: "Bhayandar West",
    carpetSqft: 280,
    floor: "Ground",
    parking: "Two-wheeler frontage",
    price: 7200000,
    priceLabel: lac(72),
    possession: "Ready",
    highlights: ["Corner plotage feel", "Steady local demand", "Investment yield"],
    amenities: ["Shutter", "Mezzanine option", "Power"],
    description:
      "Owner-sale retail unit suited for pharmacy, salon, kirana, or franchise formats.",
    nearby: ["Dense housing", "Schools", "Daily foot traffic"],
    images: propertyGallery.commercialA,
    featured: false,
    status: "available",
  },
  {
    id: "p11",
    slug: "1bhk-mira-road-sale",
    title: "Compact 1BHK Investment Flat, Mira Road",
    intent: "sale",
    category: "residential",
    type: "apartment",
    locality: "mira-road",
    localityLabel: "Mira Road East",
    society: "Mid-rise society",
    bhk: 1,
    bathrooms: 1,
    carpetSqft: 390,
    floor: "4th of 9",
    parking: "Bike + open car",
    furnishing: "semi-furnished",
    price: 5200000,
    priceLabel: lac(52),
    possession: "Ready to move",
    highlights: ["Entry ticket pricing", "Rental demand strong", "Low maintenance"],
    amenities: ["Lift", "Security", "CCTV"],
    description:
      "Ideal first home or rental-yield purchase in Mira Road’s established residential fabric.",
    nearby: ["Shops", "Auto stands", "Station connectivity"],
    images: propertyGallery.flatC,
    featured: false,
    status: "available",
  },
  {
    id: "p12",
    slug: "office-mira-road-rent",
    title: "Plug-and-Play Office, Mira Road East",
    intent: "rent",
    category: "commercial",
    type: "office",
    locality: "mira-road",
    localityLabel: "Mira Road East",
    carpetSqft: 900,
    floor: "6th of 10",
    parking: "3 slots",
    furnishing: "fully-furnished",
    price: 90000,
    priceLabel: `${inr(90000)}/mo`,
    deposit: "6 months",
    possession: "Immediate",
    highlights: ["Ready workstations", "Conference room", "Brand signage possible"],
    amenities: ["AC", "Pantry", "Lift", "Security", "Power backup"],
    description:
      "Ready office for startups and branch teams wanting Mira-Bhayandar catchment without downtown rents.",
    nearby: ["MB Road", "Hotels", "Courier hubs"],
    images: propertyGallery.commercialB,
    featured: true,
    status: "available",
  },
];

export function formatPrice(p: Property) {
  return p.priceLabel;
}

export function getPropertyBySlug(slug: string) {
  return properties.find((p) => p.slug === slug);
}

export function filterProperties(opts: {
  intent?: ListingIntent | "all";
  category?: PropertyCategory | "all";
  locality?: string | "all";
  bhk?: number | "all";
  maxPrice?: number;
  q?: string;
}) {
  return properties.filter((p) => {
    if (p.status !== "available" && p.status !== "under-offer") return false;
    if (opts.intent && opts.intent !== "all" && p.intent !== opts.intent)
      return false;
    if (
      opts.category &&
      opts.category !== "all" &&
      p.category !== opts.category
    )
      return false;
    if (
      opts.locality &&
      opts.locality !== "all" &&
      p.locality !== opts.locality
    )
      return false;
    if (opts.bhk && opts.bhk !== "all" && p.bhk !== opts.bhk) return false;
    if (opts.maxPrice && p.price > opts.maxPrice) return false;
    if (opts.q) {
      const hay = `${p.title} ${p.society || ""} ${p.localityLabel} ${p.type}`.toLowerCase();
      if (!hay.includes(opts.q.toLowerCase())) return false;
    }
    return true;
  });
}

export const heroBg = img.heroLocal;
