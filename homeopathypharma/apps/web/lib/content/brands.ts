import { PRODUCTS } from "./products";

export type Brand = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  manufacturer: string;
  productCount: number;
};

const brandMeta: Record<
  string,
  { name: string; tagline: string; summary: string; manufacturer: string }
> = {
  "homeopathypharma-essentials": {
    name: "HomeopathyPharma Essentials",
    tagline: "Core dilutions, globules, and everyday packs",
    summary:
      "HomeopathyPharma Essentials covers widely stocked single remedies in clear potency and pack sizes. Use this brand hub to compare dilutions, globules, and related forms without treatment promises.",
    manufacturer: "Licensed contract manufacturer · Maharashtra",
  },
  "harbour-leaf-remedies": {
    name: "Harbour Leaf Remedies",
    tagline: "Plant-forward single remedy range",
    summary:
      "Harbour Leaf Remedies focuses on classic materia medica entries with transparent labelling. Browse by remedy or potency, then open a product page for pack details, directions, and warnings.",
    manufacturer: "Licensed contract manufacturer · Maharashtra",
  },
  "coastal-biochemic": {
    name: "Coastal Biochemic",
    tagline: "Tissue salts and biochemic combinations",
    summary:
      "Coastal Biochemic lists tissue-salt and biochemic formats commonly browsed alongside single remedies. Educational retail listings only — follow pack labels and practitioner guidance.",
    manufacturer: "Licensed contract manufacturer · Maharashtra",
  },
  "saffron-grove-care": {
    name: "Saffron Grove Care",
    tagline: "Specialty kits and pet-care packs",
    summary:
      "Saffron Grove Care covers curated kits and specialty packs, including pet-care assortments. Always use animal products under qualified veterinary guidance.",
    manufacturer: "Licensed contract manufacturer · Maharashtra",
  },
};

export const brands: Brand[] = (Object.entries(brandMeta) as [string, (typeof brandMeta)[string]][])
  .map(([slug, meta]) => ({
    slug,
    name: meta.name,
    tagline: meta.tagline,
    summary: meta.summary,
    manufacturer: meta.manufacturer,
    productCount: PRODUCTS.filter((p) => p.brandSlug === slug).length,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function getBrand(slug: string) {
  return brands.find((b) => b.slug === slug);
}

export function listBrandSlugs() {
  return brands.map((b) => b.slug);
}
