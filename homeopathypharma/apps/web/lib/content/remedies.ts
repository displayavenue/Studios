import { PRODUCTS } from "./products";

export type Remedy = {
  slug: string;
  name: string;
  latinName: string;
  summary: string;
  commonForms: string[];
  productCount: number;
};

const latinOverrides: Record<string, string> = {
  "arnica-montana": "Arnica montana",
  "aconitum-napellus": "Aconitum napellus",
  "nux-vomica": "Strychnos nux-vomica",
  belladonna: "Atropa belladonna",
  "bryonia-alba": "Bryonia alba",
  pulsatilla: "Pulsatilla nigricans",
  "rhus-tox": "Rhus toxicodendron",
  gelsemium: "Gelsemium sempervirens",
  "hepar-sulph": "Hepar sulphuris calcareum",
  "mercurius-solubilis": "Mercurius solubilis",
  sulphur: "Sulphur",
  "calcarea-carbonica": "Calcarea carbonica",
  "natrum-muriaticum": "Natrum muriaticum",
  "kali-phosphoricum": "Kali phosphoricum",
  silicea: "Silicea terra",
  chamomilla: "Chamomilla",
  cina: "Cina",
  drosera: "Drosera rotundifolia",
  "antimonium-tart": "Antimonium tartaricum",
  "arsenicum-album": "Arsenicum album",
  phosphorus: "Phosphorus",
  lycopodium: "Lycopodium clavatum",
  "carbo-veg": "Carbo vegetabilis",
  ipecac: "Ipecacuanha",
  colocynthis: "Colocynthis",
  "magnesia-phosphorica": "Magnesia phosphorica",
  "ferrum-phos": "Ferrum phosphoricum",
  thuja: "Thuja occidentalis",
  hypericum: "Hypericum perforatum",
  ledum: "Ledum palustre",
  "apis-mellifica": "Apis mellifica",
  sepia: "Sepia officinalis",
  lachesis: "Lachesis mutus",
  "croton-tiglium": "Croton tiglium",
  podophyllum: "Podophyllum peltatum",
  "allium-cepa": "Allium cepa",
  euphrasia: "Euphrasia officinalis",
  sabadilla: "Sabadilla",
  spongia: "Spongia tosta",
  rumex: "Rumex crispus",
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const remedySlugs = [...new Set(PRODUCTS.map((p) => p.remedySlug))].sort();

export const remedies: Remedy[] = remedySlugs.map((slug) => {
  const related = PRODUCTS.filter((p) => p.remedySlug === slug);
  const name = related[0]?.remedyName ?? titleFromSlug(slug);
  const forms = [...new Set(related.map((p) => p.form))];
  return {
    slug,
    name,
    latinName: latinOverrides[slug] ?? name,
    summary: `${name} (${latinOverrides[slug] ?? name}) is listed across ${related.length} pack option${related.length === 1 ? "" : "s"} on HomeopathyPharma. Compare potency, form, and brand on product pages. Educational catalogue only — not prescribing guidance.`,
    commonForms: forms,
    productCount: related.length,
  };
});

export function getRemedy(slug: string) {
  return remedies.find((r) => r.slug === slug);
}

export function listRemedySlugs() {
  return remedies.map((r) => r.slug);
}
