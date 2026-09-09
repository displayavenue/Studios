/** AstroMall catalogue — remedy / spiritual retail items (JyotishKundali branded). */
export type MallItem = {
  slug: string;
  name: string;
  category: "gemstone" | "yantra" | "puja" | "rudraksha" | "kit";
  priceInr: number;
  short: string;
  description: string;
  includes: string[];
  caution: string;
  accent: string;
};

export const MALL_CATEGORIES = [
  { key: "gemstone", title: "Gemstones", desc: "Certified-style stones for planetary remedies (symbolic)." },
  { key: "yantra", title: "Yantras", desc: "Sacred geometry plates for altar practice." },
  { key: "puja", title: "Puja kits", desc: "Home ritual kits with clear instructions." },
  { key: "rudraksha", title: "Rudraksha", desc: "Beads for japa and daily wear symbolism." },
  { key: "kit", title: "Combo kits", desc: "Starter bundles for new practitioners." },
] as const;

export const MALL_ITEMS: MallItem[] = [
  {
    slug: "yellow-sapphire-pendant",
    name: "Yellow Sapphire Pendant (Pukhraj)",
    category: "gemstone",
    priceInr: 4999,
    short: "Jupiter-theme pendant with lab note placeholder.",
    description:
      "Symbolic Jupiter remedy piece for reflective practice. Includes care card. Not a medical or financial guarantee — wear only after your own astrologer’s guidance.",
    includes: ["Pendant setting", "Care card", "Invoice"],
    caution: "Gemstone remedies are traditional symbolism, not certified medical devices.",
    accent: "#eab308",
  },
  {
    slug: "pearl-bracelet",
    name: "Pearl Bracelet (Moti)",
    category: "gemstone",
    priceInr: 2499,
    short: "Moon-theme bracelet for calm reflection.",
    description: "Soft pearl strand styled for daily wear. Interpretive lunar symbolism only.",
    includes: ["Bracelet", "Pouch", "Care card"],
    caution: "Not a clinical treatment for mood or sleep.",
    accent: "#f8fafc",
  },
  {
    slug: "shri-yantra-copper",
    name: "Shri Yantra — Copper",
    category: "yantra",
    priceInr: 1299,
    short: "Altar-ready copper Shri Yantra plate.",
    description: "Etched copper yantra for home altar. Includes placement note for respectful use.",
    includes: ["Copper plate", "Placement guide"],
    caution: "Devotional article — not a wealth guarantee.",
    accent: "#b45309",
  },
  {
    slug: "navagraha-yantra",
    name: "Navagraha Yantra Set",
    category: "yantra",
    priceInr: 1899,
    short: "Nine-planet yantra cards for study altar.",
    description: "Printed + foil yantra cards representing Navagraha themes for reflective practice.",
    includes: ["9 cards", "Stand", "Guide booklet"],
    caution: "Educational / ritual symbolism only.",
    accent: "#7c3aed",
  },
  {
    slug: "satyanarayan-puja-kit",
    name: "Satyanarayan Puja Kit",
    category: "puja",
    priceInr: 999,
    short: "Home puja essentials with step card.",
    description: "Dry ingredients + aarti sheet for a simple home Satyanarayan-style observance.",
    includes: ["Puja samagri pack", "Aarti sheet", "Instructions"],
    caution: "Follow family/priest customs; kit is a convenience pack.",
    accent: "#f97316",
  },
  {
    slug: "saturn-shanti-kit",
    name: "Shani Shanti Kit",
    category: "puja",
    priceInr: 799,
    short: "Saturday oil-lamp kit for Shani reflection.",
    description: "Oil, wick, and mantra card for traditional Saturday lamp practice.",
    includes: ["Oil vial", "Wicks", "Mantra card"],
    caution: "Symbolic practice — not a curse-removal product.",
    accent: "#1e293b",
  },
  {
    slug: "5-mukhi-rudraksha",
    name: "5 Mukhi Rudraksha Mala",
    category: "rudraksha",
    priceInr: 1499,
    short: "Classic 5-mukhi mala for japa.",
    description: "Strung 5-mukhi beads with cotton thread. Energising claims are traditional, not lab-proven.",
    includes: ["Mala", "Cotton pouch"],
    caution: "Spiritual accessory — verify authenticity preferences with your guide.",
    accent: "#78350f",
  },
  {
    slug: "beginner-remedy-kit",
    name: "Beginner Remedy Starter Kit",
    category: "kit",
    priceInr: 2999,
    short: "Yantra + lamp kit + mantra cards bundle.",
    description: "A gentle starter bundle for people beginning reflective remedial practice at home.",
    includes: ["Mini yantra", "Lamp kit", "3 mantra cards", "Guide PDF link"],
    caution: "Bundle for convenience; not a substitute for personalised consultation.",
    accent: "#0d9488",
  },
];

export function getMallItem(slug: string) {
  return MALL_ITEMS.find((i) => i.slug === slug);
}

export function listMallItems(category?: string | null) {
  if (!category || category === "all") return MALL_ITEMS;
  return MALL_ITEMS.filter((i) => i.category === category);
}
