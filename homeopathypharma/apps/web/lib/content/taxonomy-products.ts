import type { Product } from "./product-types";
import { CATALOG_TAXONOMY } from "./taxonomy";

const brands = [
  { slug: "homeopathypharma-essentials", name: "HomeopathyPharma Essentials" },
  { slug: "harbour-leaf-remedies", name: "Harbour Leaf Remedies" },
  { slug: "coastal-biochemic", name: "Coastal Biochemic" },
  { slug: "saffron-grove-care", name: "Saffron Grove Care" },
] as const;

const forms = ["Dilution", "Globules", "Tablet", "Syrup", "Ointment", "Drops"] as const;
const potencies = ["6C", "30C", "200C", "1M", "Q"] as const;

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  return h;
}

/** One published SKU per catalogue topic from the updated product-category list. */
export const TAXONOMY_PRODUCTS: Product[] = CATALOG_TAXONOMY.flatMap((category, catIndex) =>
  category.topics.map((topic, topicIndex) => {
    const seed = `${category.slug}:${topic.slug}`;
    const h = hash(seed);
    const brand = brands[h % brands.length]!;
    const form = forms[h % forms.length]!;
    const potency = form === "Ointment" || form === "Syrup" ? "" : potencies[h % potencies.length]!;
    const packSize = form === "Ointment" ? "25 g" : form === "Syrup" ? "100 ml" : form === "Globules" ? "10 g" : "30 ml";
    const mrpInr = 95 + (h % 12) * 12;
    const priceInr = Math.round(mrpInr * 0.88);
    const idNum = 2000 + catIndex * 100 + topicIndex + 1;
    const slugBase = `${category.slug}-${topic.slug}-${form.toLowerCase()}${potency ? `-${potency.toLowerCase()}` : ""}-${packSize.replace(/\s+/g, "").toLowerCase()}`;

    return {
      id: `prd_${idNum}`,
      slug: slugBase,
      name: potency
        ? `${topic.name} ${potency} ${form} (${packSize})`
        : `${topic.name} ${form} (${packSize})`,
      remedySlug: `${category.slug}-${topic.slug}`,
      remedyName: `${topic.name}`,
      brandSlug: brand.slug,
      brandName: brand.name,
      manufacturer: "Licensed contract manufacturer · Maharashtra",
      form,
      potency,
      packSize,
      source: "Multi",
      mrpInr,
      priceInr,
      inStock: h % 17 !== 0,
      batchNote: "Batch & expiry printed on pack · FEFO warehouse dispatch",
      directions:
        "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
      warnings:
        "For labelled use only. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing — not a cure claim.",
      ingredients: potency
        ? `${topic.name} preparation (${potency}). Excipients as per label.`
        : `${topic.name} preparation. Excipients as per label.`,
      storage: "Store in a cool, dry place away from strong odours and direct sunlight.",
      faqs: [
        {
          q: "Is this a prescription medicine?",
          a: "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure.",
        },
        {
          q: "Does this treat a disease?",
          a: "No. This is an educational retail listing for product discovery — not a treatment or cure claim.",
        },
        {
          q: "What if symptoms persist?",
          a: "Stop self-care experimentation and consult a qualified healthcare professional promptly.",
        },
      ],
      healthAreas: [category.slug, topic.slug],
      category: category.name,
    } satisfies Product;
  }),
);
