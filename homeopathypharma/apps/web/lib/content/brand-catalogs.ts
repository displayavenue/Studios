import type { Product } from "./product-types";

const FAQS = [
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
] as const;

type BrandDef = {
  slug: string;
  name: string;
  manufacturer: string;
};

const SBL: BrandDef = {
  slug: "sbl",
  name: "SBL",
  manufacturer: "SBL Pvt. Ltd. · India",
};

const RECKEWEG: BrandDef = {
  slug: "dr-reckeweg",
  name: "Dr. Reckeweg",
  manufacturer: "Dr. Reckeweg & Co. GmbH · Germany (imported / distributed in India)",
};

const SCHWABE: BrandDef = {
  slug: "schwabe",
  name: "Schwabe",
  manufacturer: "Dr. Willmar Schwabe India Pvt. Ltd.",
};

/** Widely stocked single remedies across Indian retail catalogues. */
const SINGLE_REMEDIES: { slug: string; name: string; source: string }[] = [
  { slug: "aconitum-napellus", name: "Aconitum napellus", source: "Plant" },
  { slug: "allium-cepa", name: "Allium cepa", source: "Plant" },
  { slug: "antimonium-tartaricum", name: "Antimonium tartaricum", source: "Mineral" },
  { slug: "apis-mellifica", name: "Apis mellifica", source: "Animal" },
  { slug: "argentum-nitricum", name: "Argentum nitricum", source: "Mineral" },
  { slug: "arnica-montana", name: "Arnica montana", source: "Plant" },
  { slug: "arsenicum-album", name: "Arsenicum album", source: "Mineral" },
  { slug: "aurum-metallicum", name: "Aurum metallicum", source: "Mineral" },
  { slug: "baptisia-tinctoria", name: "Baptisia tinctoria", source: "Plant" },
  { slug: "baryta-carbonica", name: "Baryta carbonica", source: "Mineral" },
  { slug: "belladonna", name: "Belladonna", source: "Plant" },
  { slug: "berberis-vulgaris", name: "Berberis vulgaris", source: "Plant" },
  { slug: "bryonia-alba", name: "Bryonia alba", source: "Plant" },
  { slug: "calcarea-carbonica", name: "Calcarea carbonica", source: "Mineral" },
  { slug: "calcarea-phosphorica", name: "Calcarea phosphorica", source: "Mineral" },
  { slug: "calendula-officinalis", name: "Calendula officinalis", source: "Plant" },
  { slug: "cantharis", name: "Cantharis", source: "Animal" },
  { slug: "carbo-vegetabilis", name: "Carbo vegetabilis", source: "Plant" },
  { slug: "causticum", name: "Causticum", source: "Chemical" },
  { slug: "chamomilla", name: "Chamomilla", source: "Plant" },
  { slug: "china-officinalis", name: "China officinalis", source: "Plant" },
  { slug: "cinchona-officinalis", name: "Cinchona officinalis", source: "Plant" },
  { slug: "cocculus-indicus", name: "Cocculus indicus", source: "Plant" },
  { slug: "coffea-cruda", name: "Coffea cruda", source: "Plant" },
  { slug: "colchicum-autumnale", name: "Colchicum autumnale", source: "Plant" },
  { slug: "colocynthis", name: "Colocynthis", source: "Plant" },
  { slug: "drosera-rotundifolia", name: "Drosera rotundifolia", source: "Plant" },
  { slug: "dulcamara", name: "Dulcamara", source: "Plant" },
  { slug: "eupatorium-perfoliatum", name: "Eupatorium perfoliatum", source: "Plant" },
  { slug: "euphrasia-officinalis", name: "Euphrasia officinalis", source: "Plant" },
  { slug: "ferrum-phosphoricum", name: "Ferrum phosphoricum", source: "Mineral" },
  { slug: "gelsemium-sempervirens", name: "Gelsemium sempervirens", source: "Plant" },
  { slug: "glonoinum", name: "Glonoinum", source: "Chemical" },
  { slug: "graphites", name: "Graphites", source: "Mineral" },
  { slug: "hamamelis-virginica", name: "Hamamelis virginica", source: "Plant" },
  { slug: "hepar-sulphuris", name: "Hepar sulphuris", source: "Mineral" },
  { slug: "hypericum-perforatum", name: "Hypericum perforatum", source: "Plant" },
  { slug: "ignatia-amara", name: "Ignatia amara", source: "Plant" },
  { slug: "ipecacuanha", name: "Ipecacuanha", source: "Plant" },
  { slug: "kali-bichromicum", name: "Kali bichromicum", source: "Mineral" },
  { slug: "kali-carbonicum", name: "Kali carbonicum", source: "Mineral" },
  { slug: "kali-phosphoricum", name: "Kali phosphoricum", source: "Mineral" },
  { slug: "lachesis-mutus", name: "Lachesis mutus", source: "Animal" },
  { slug: "ledum-palustre", name: "Ledum palustre", source: "Plant" },
  { slug: "lycopodium-clavatum", name: "Lycopodium clavatum", source: "Plant" },
  { slug: "magnesia-phosphorica", name: "Magnesia phosphorica", source: "Mineral" },
  { slug: "mercurius-solubilis", name: "Mercurius solubilis", source: "Mineral" },
  { slug: "natrum-muriaticum", name: "Natrum muriaticum", source: "Mineral" },
  { slug: "natrum-phosphoricum", name: "Natrum phosphoricum", source: "Mineral" },
  { slug: "natrum-sulphuricum", name: "Natrum sulphuricum", source: "Mineral" },
  { slug: "nux-vomica", name: "Nux vomica", source: "Plant" },
  { slug: "phosphorus", name: "Phosphorus", source: "Mineral" },
  { slug: "podophyllum-peltatum", name: "Podophyllum peltatum", source: "Plant" },
  { slug: "pulsatilla-nigricans", name: "Pulsatilla nigricans", source: "Plant" },
  { slug: "rhus-toxicodendron", name: "Rhus toxicodendron", source: "Plant" },
  { slug: "ruta-graveolens", name: "Ruta graveolens", source: "Plant" },
  { slug: "sepia", name: "Sepia", source: "Animal" },
  { slug: "silicea", name: "Silicea", source: "Mineral" },
  { slug: "spigelia", name: "Spigelia", source: "Plant" },
  { slug: "spongia-tosta", name: "Spongia tosta", source: "Animal" },
  { slug: "staphysagria", name: "Staphysagria", source: "Plant" },
  { slug: "sulphur", name: "Sulphur", source: "Mineral" },
  { slug: "symphytum-officinale", name: "Symphytum officinale", source: "Plant" },
  { slug: "thuja-occidentalis", name: "Thuja occidentalis", source: "Plant" },
  { slug: "verbascum-thapsus", name: "Verbascum thapsus", source: "Plant" },
  { slug: "zincum-metallicum", name: "Zincum metallicum", source: "Mineral" },
];

const BIOCHEMICS = [
  "Calcarea fluorica",
  "Calcarea phosphorica",
  "Calcarea sulphurica",
  "Ferrum phosphoricum",
  "Kali muriaticum",
  "Kali phosphoricum",
  "Kali sulphuricum",
  "Magnesia phosphorica",
  "Natrum muriaticum",
  "Natrum phosphoricum",
  "Natrum sulphuricum",
  "Silicea",
] as const;

const MOTHER_TINCTURES = [
  "Aloe vera",
  "Arnica montana",
  "Berberis vulgaris",
  "Calendula officinalis",
  "Carduus marianus",
  "Chelidonium majus",
  "Cimicifuga racemosa",
  "Crataegus oxyacantha",
  "Echinacea angustifolia",
  "Ginkgo biloba",
  "Hamamelis virginica",
  "Hydrastis canadensis",
  "Hypericum perforatum",
  "Jaborandi",
  "Millefolium",
  "Nux vomica",
  "Passiflora incarnata",
  "Plantago major",
  "Rauwolfia serpentina",
  "Sabal serrulata",
  "Symphytum officinale",
  "Thuja occidentalis",
  "Urtica urens",
  "Withania somnifera",
] as const;

/** Full Dr. Reckeweg World Famous Specialities R1–R89 retail line (trade titles). */
const RECKEWEG_R_SERIES: { code: string; title: string; form: string; pack: string }[] = [
  { code: "R1", title: "Inflammation Drops", form: "Drops", pack: "22 ml" },
  { code: "R2", title: "Gold Drops", form: "Drops", pack: "22 ml" },
  { code: "R3", title: "Heart Drops", form: "Drops", pack: "22 ml" },
  { code: "R4", title: "Diarrhoea Drops", form: "Drops", pack: "22 ml" },
  { code: "R5", title: "Stomach Drops", form: "Drops", pack: "22 ml" },
  { code: "R6", title: "Influenza Drops", form: "Drops", pack: "22 ml" },
  { code: "R7", title: "Liver and Gallbladder Drops", form: "Drops", pack: "22 ml" },
  { code: "R8", title: "Jutussin Cough Syrup", form: "Syrup", pack: "150 ml" },
  { code: "R9", title: "Jutussin Cough Drops", form: "Drops", pack: "22 ml" },
  { code: "R10", title: "Menopausal Drops", form: "Drops", pack: "22 ml" },
  { code: "R11", title: "Rheuma Drops", form: "Drops", pack: "22 ml" },
  { code: "R12", title: "Calcification Drops", form: "Drops", pack: "22 ml" },
  { code: "R13", title: "Haemorrhoidal Drops", form: "Drops", pack: "22 ml" },
  { code: "R14", title: "Nerve and Sleep Drops", form: "Drops", pack: "22 ml" },
  { code: "R15", title: "Vita-C Relaxant", form: "Drops", pack: "22 ml" },
  { code: "R16", title: "Migraine and Neuralgia Drops", form: "Drops", pack: "22 ml" },
  { code: "R17", title: "Regeneration Drops", form: "Drops", pack: "22 ml" },
  { code: "R18", title: "Kidney and Bladder Drops", form: "Drops", pack: "22 ml" },
  { code: "R19", title: "Glandular Drops for Men", form: "Drops", pack: "22 ml" },
  { code: "R20", title: "Glandular Drops for Women", form: "Drops", pack: "22 ml" },
  { code: "R21", title: "Reconstituant Drops", form: "Drops", pack: "22 ml" },
  { code: "R22", title: "Nervous Disorders Drops", form: "Drops", pack: "22 ml" },
  { code: "R23", title: "Eczema Drops", form: "Drops", pack: "22 ml" },
  { code: "R24", title: "Pleurisy Drops", form: "Drops", pack: "22 ml" },
  { code: "R25", title: "Prostatitis Drops", form: "Drops", pack: "22 ml" },
  { code: "R26", title: "Draining and Stimulating Drops", form: "Drops", pack: "22 ml" },
  { code: "R27", title: "Renal Calculi Drops", form: "Drops", pack: "22 ml" },
  { code: "R28", title: "Dysmenorrhea Drops", form: "Drops", pack: "22 ml" },
  { code: "R29", title: "Vertigo Drops", form: "Drops", pack: "22 ml" },
  { code: "R30", title: "Universal Ointment", form: "Ointment", pack: "85 g" },
  { code: "R31", title: "Appetite Drops", form: "Drops", pack: "22 ml" },
  { code: "R32", title: "Hyperhidrosis Drops", form: "Drops", pack: "22 ml" },
  { code: "R33", title: "Constitutional Drops", form: "Drops", pack: "22 ml" },
  { code: "R34", title: "Recalcifying Drops", form: "Drops", pack: "22 ml" },
  { code: "R35", title: "Teething Aches Drops", form: "Drops", pack: "22 ml" },
  { code: "R36", title: "Nerve Drops", form: "Drops", pack: "22 ml" },
  { code: "R37", title: "Intestinal Drops", form: "Drops", pack: "22 ml" },
  { code: "R38", title: "Ovaries Right Side Drops", form: "Drops", pack: "22 ml" },
  { code: "R39", title: "Ovaries Left Side Drops", form: "Drops", pack: "22 ml" },
  { code: "R40", title: "Diabetes Support Drops", form: "Drops", pack: "22 ml" },
  { code: "R41", title: "Sexual Neurasthenia Drops", form: "Drops", pack: "22 ml" },
  { code: "R42", title: "Vein Inflammation Drops", form: "Drops", pack: "22 ml" },
  { code: "R43", title: "Asthmatic Constitution Drops", form: "Drops", pack: "22 ml" },
  { code: "R44", title: "Low Blood Pressure Drops", form: "Drops", pack: "22 ml" },
  { code: "R45", title: "Hoarseness Drops", form: "Drops", pack: "22 ml" },
  { code: "R46", title: "Forearm Rheuma Drops", form: "Drops", pack: "22 ml" },
  { code: "R47", title: "Hysteric Complaints Drops", form: "Drops", pack: "22 ml" },
  { code: "R48", title: "Pulmonary Weakness Drops", form: "Drops", pack: "22 ml" },
  { code: "R49", title: "Sinus and Catarrh Drops", form: "Drops", pack: "22 ml" },
  { code: "R50", title: "Gynecological Sacroiliac Drops", form: "Drops", pack: "22 ml" },
  { code: "R51", title: "Thyroid Drops", form: "Drops", pack: "22 ml" },
  { code: "R52", title: "Vomiting and Nausea Drops", form: "Drops", pack: "22 ml" },
  { code: "R53", title: "Acne Drops", form: "Drops", pack: "22 ml" },
  { code: "R54", title: "Memory Weakness Drops", form: "Drops", pack: "22 ml" },
  { code: "R55", title: "Injury Drops", form: "Drops", pack: "22 ml" },
  { code: "R56", title: "Vermifuge Drops", form: "Drops", pack: "22 ml" },
  { code: "R57", title: "Pulmonary Tonic Drops", form: "Drops", pack: "22 ml" },
  { code: "R58", title: "Renal Function Drops", form: "Drops", pack: "22 ml" },
  { code: "R59", title: "Obesity Drops", form: "Drops", pack: "22 ml" },
  { code: "R60", title: "Blood Impurities Drops", form: "Drops", pack: "22 ml" },
  { code: "R61", title: "Rheumatic Ointment", form: "Ointment", pack: "50 g" },
  { code: "R62", title: "Mucous Membrane Drops", form: "Drops", pack: "22 ml" },
  { code: "R63", title: "Impaired Circulation Drops", form: "Drops", pack: "22 ml" },
  { code: "R64", title: "Albuminuria Drops", form: "Drops", pack: "22 ml" },
  { code: "R65", title: "Psoriasis Drops", form: "Drops", pack: "22 ml" },
  { code: "R66", title: "Cardiac Arrhythmia Drops", form: "Drops", pack: "22 ml" },
  { code: "R67", title: "Circulatory Debility Drops", form: "Drops", pack: "22 ml" },
  { code: "R68", title: "Herpes Drops", form: "Drops", pack: "22 ml" },
  { code: "R69", title: "Intercostal Neuralgia Drops", form: "Drops", pack: "22 ml" },
  { code: "R70", title: "Neuralgia Drops", form: "Drops", pack: "22 ml" },
  { code: "R71", title: "Sciatica Drops", form: "Drops", pack: "22 ml" },
  { code: "R72", title: "Pancreas Drops", form: "Drops", pack: "22 ml" },
  { code: "R73", title: "Joint Drops", form: "Drops", pack: "22 ml" },
  { code: "R74", title: "Nocturnal Enuresis Drops", form: "Drops", pack: "22 ml" },
  { code: "R75", title: "Dysmenorrhoea Drops", form: "Drops", pack: "22 ml" },
  { code: "R76", title: "Asthma Forte Drops", form: "Drops", pack: "22 ml" },
  { code: "R77", title: "Anti-Smoking Drops", form: "Drops", pack: "22 ml" },
  { code: "R78", title: "Eye Care Drops (oral)", form: "Drops", pack: "22 ml" },
  { code: "R79", title: "Heart Capsules", form: "Capsule", pack: "20 caps" },
  { code: "R80", title: "Arnica Oil", form: "Oil", pack: "50 ml" },
  { code: "R81", title: "Analgesic Drops", form: "Drops", pack: "22 ml" },
  { code: "R82", title: "Skin Care Drops", form: "Drops", pack: "22 ml" },
  { code: "R83", title: "Food Allergy Drops", form: "Drops", pack: "22 ml" },
  { code: "R84", title: "Inhalant Allergy Drops", form: "Drops", pack: "22 ml" },
  { code: "R85", title: "Blood Pressure Drops", form: "Drops", pack: "22 ml" },
  { code: "R86", title: "Hypoglycemia Drops", form: "Drops", pack: "22 ml" },
  { code: "R87", title: "Immune Support Drops", form: "Drops", pack: "22 ml" },
  { code: "R88", title: "Anti-Viral Drops", form: "Drops", pack: "22 ml" },
  { code: "R89", title: "Hair Care Drops", form: "Drops", pack: "22 ml" },
];

const SCHWABE_ALPHA: { slug: string; name: string; form: string; pack: string }[] = [
  { slug: "alpha-acid", name: "Alpha-Acid", form: "Tablet", pack: "40 tabs" },
  { slug: "alpha-cof", name: "Alpha-COF", form: "Syrup", pack: "100 ml" },
  { slug: "alpha-wd", name: "Alpha-WD", form: "Tablet", pack: "40 tabs" },
  { slug: "alpha-liv", name: "Alpha-Liv", form: "Syrup", pack: "100 ml" },
  { slug: "alpha-tones", name: "Alpha-Tones", form: "Syrup", pack: "100 ml" },
  { slug: "alpha-mp", name: "Alpha-MP", form: "Tablet", pack: "40 tabs" },
  { slug: "alpha-nc", name: "Alpha-NC", form: "Tablet", pack: "40 tabs" },
  { slug: "alpha-res", name: "Alpha-RES", form: "Syrup", pack: "100 ml" },
  { slug: "alpha-bt", name: "Alpha-BT", form: "Tablet", pack: "40 tabs" },
  { slug: "alpha-cf", name: "Alpha-CF", form: "Tablet", pack: "40 tabs" },
  { slug: "alpha-rc", name: "Alpha-RC", form: "Tablet", pack: "40 tabs" },
  { slug: "alpha-dm", name: "Alpha-DM", form: "Tablet", pack: "40 tabs" },
  { slug: "alpha-ha", name: "Alpha-HA", form: "Tablet", pack: "40 tabs" },
  { slug: "alpha-ms", name: "Alpha-MS", form: "Tablet", pack: "40 tabs" },
  { slug: "alpha-ts", name: "Alpha-TS", form: "Tablet", pack: "40 tabs" },
  { slug: "alpha-vc", name: "Alpha-VC", form: "Syrup", pack: "100 ml" },
  { slug: "alpha-gingc", name: "Alpha-Gingc", form: "Syrup", pack: "100 ml" },
  { slug: "dismenorm", name: "Dismenorm", form: "Tablet", pack: "40 tabs" },
  { slug: "kindigest", name: "Kindigest", form: "Syrup", pack: "100 ml" },
  { slug: "kindervital", name: "Kindervital", form: "Syrup", pack: "250 ml" },
];

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeProduct(opts: {
  id: string;
  brand: BrandDef;
  slug: string;
  name: string;
  remedySlug: string;
  remedyName: string;
  form: string;
  potency: string;
  packSize: string;
  source: string;
  category: string;
  healthAreas: string[];
  baseMrp: number;
}): Product {
  const h = hash(opts.id);
  const mrpInr = opts.baseMrp + (h % 5) * 5;
  const priceInr = Math.round(mrpInr * (0.86 + (h % 7) * 0.01));
  return {
    id: opts.id,
    slug: opts.slug,
    name: opts.name,
    remedySlug: opts.remedySlug,
    remedyName: opts.remedyName,
    brandSlug: opts.brand.slug,
    brandName: opts.brand.name,
    manufacturer: opts.brand.manufacturer,
    form: opts.form,
    potency: opts.potency,
    packSize: opts.packSize,
    source: opts.source,
    mrpInr,
    priceInr,
    inStock: h % 19 !== 0,
    batchNote: "Batch & expiry printed on pack · FEFO warehouse dispatch",
    directions:
      "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    warnings:
      "For labelled use only. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing — not a cure claim.",
    ingredients: opts.potency
      ? `${opts.remedyName} preparation (${opts.potency}). Excipients as per label.`
      : `${opts.remedyName} preparation. Excipients as per label.`,
    storage: "Store in a cool, dry place away from strong odours and direct sunlight.",
    faqs: [...FAQS],
    healthAreas: opts.healthAreas,
    category: opts.category,
  };
}

function buildSblCatalog(startId: number): Product[] {
  const out: Product[] = [];
  let n = startId;
  const potencies = ["6C", "30C", "200C", "1M"] as const;
  const packs = [
    { form: "Dilution", pack: "30 ml" },
    { form: "Globules", pack: "10 g" },
  ] as const;

  for (const remedy of SINGLE_REMEDIES) {
    for (const potency of potencies) {
      for (const { form, pack } of packs) {
        // Keep catalogue dense but skip uncommon 1M globules to stay retail-realistic
        if (potency === "1M" && form === "Globules") continue;
        const id = `prd_${n++}`;
        const slug = `sbl-${remedy.slug}-${form.toLowerCase()}-${potency.toLowerCase()}-${pack.replace(/\s+/g, "").toLowerCase()}`;
        out.push(
          makeProduct({
            id,
            brand: SBL,
            slug,
            name: `SBL ${remedy.name} ${potency} ${form} (${pack})`,
            remedySlug: remedy.slug,
            remedyName: remedy.name,
            form,
            potency,
            packSize: pack,
            source: remedy.source,
            category: "Single Remedies",
            healthAreas: ["general-wellness", remedy.slug],
            baseMrp: form === "Dilution" ? 95 : 85,
          }),
        );
      }
    }
  }

  for (const name of MOTHER_TINCTURES) {
    const remedySlug = slugify(name);
    for (const pack of ["30 ml", "100 ml"] as const) {
      const id = `prd_${n++}`;
      out.push(
        makeProduct({
          id,
          brand: SBL,
          slug: `sbl-${remedySlug}-mother-tincture-q-${pack.replace(/\s+/g, "").toLowerCase()}`,
          name: `SBL ${name} Mother Tincture Q (${pack})`,
          remedySlug,
          remedyName: name,
          form: "Mother Tincture",
          potency: "Q",
          packSize: pack,
          source: "Plant",
          category: "Mother Tinctures",
          healthAreas: ["general-wellness", remedySlug],
          baseMrp: pack === "100 ml" ? 165 : 120,
        }),
      );
    }
  }

  for (const name of BIOCHEMICS) {
    const remedySlug = slugify(name);
    for (const pack of ["25 g", "450 g"] as const) {
      const id = `prd_${n++}`;
      out.push(
        makeProduct({
          id,
          brand: SBL,
          slug: `sbl-${remedySlug}-biochemic-6x-${pack.replace(/\s+/g, "").toLowerCase()}`,
          name: `SBL ${name} 6X Biochemic Tablet (${pack})`,
          remedySlug,
          remedyName: name,
          form: "Tablet",
          potency: "6X",
          packSize: pack,
          source: "Mineral",
          category: "Biochemics",
          healthAreas: ["general-wellness", "biochemic"],
          baseMrp: pack === "450 g" ? 320 : 95,
        }),
      );
    }
  }

  return out;
}

function buildReckewegCatalog(startId: number): Product[] {
  const out: Product[] = [];
  let n = startId;

  for (const item of RECKEWEG_R_SERIES) {
    const id = `prd_${n++}`;
    const remedySlug = `reckeweg-${item.code.toLowerCase()}`;
    out.push(
      makeProduct({
        id,
        brand: RECKEWEG,
        slug: `dr-reckeweg-${item.code.toLowerCase()}-${slugify(item.title)}-${item.pack.replace(/\s+/g, "").toLowerCase()}`,
        name: `Dr. Reckeweg ${item.code} ${item.title} (${item.pack})`,
        remedySlug,
        remedyName: `Dr. Reckeweg ${item.code}`,
        form: item.form,
        potency: "",
        packSize: item.pack,
        source: "Multi",
        category: "Specialty Combinations",
        healthAreas: ["general-wellness", "reckeweg-r-series", remedySlug],
        baseMrp: item.form === "Syrup" ? 280 : item.form === "Ointment" || item.form === "Oil" ? 260 : 295,
      }),
    );
  }

  // Popular Reckeweg single dilutions stocked alongside R-series
  const reckewegDilutions = SINGLE_REMEDIES.slice(0, 40);
  for (const remedy of reckewegDilutions) {
    for (const potency of ["30C", "200C"] as const) {
      const id = `prd_${n++}`;
      out.push(
        makeProduct({
          id,
          brand: RECKEWEG,
          slug: `dr-reckeweg-${remedy.slug}-dilution-${potency.toLowerCase()}-11ml`,
          name: `Dr. Reckeweg ${remedy.name} ${potency} Dilution (11 ml)`,
          remedySlug: remedy.slug,
          remedyName: remedy.name,
          form: "Dilution",
          potency,
          packSize: "11 ml",
          source: remedy.source,
          category: "Single Remedies",
          healthAreas: ["general-wellness", remedy.slug],
          baseMrp: 145,
        }),
      );
    }
  }

  return out;
}

function buildSchwabeCatalog(startId: number): Product[] {
  const out: Product[] = [];
  let n = startId;
  const potencies = ["30C", "200C", "1M"] as const;

  for (const remedy of SINGLE_REMEDIES) {
    for (const potency of potencies) {
      const id = `prd_${n++}`;
      out.push(
        makeProduct({
          id,
          brand: SCHWABE,
          slug: `schwabe-${remedy.slug}-dilution-${potency.toLowerCase()}-30ml`,
          name: `Schwabe ${remedy.name} ${potency} Dilution (30 ml)`,
          remedySlug: remedy.slug,
          remedyName: remedy.name,
          form: "Dilution",
          potency,
          packSize: "30 ml",
          source: remedy.source,
          category: "Single Remedies",
          healthAreas: ["general-wellness", remedy.slug],
          baseMrp: 110,
        }),
      );
    }
  }

  for (const name of MOTHER_TINCTURES) {
    const remedySlug = slugify(name);
    const id = `prd_${n++}`;
    out.push(
      makeProduct({
        id,
        brand: SCHWABE,
        slug: `schwabe-${remedySlug}-mother-tincture-q-30ml`,
        name: `Schwabe ${name} Mother Tincture Q (30 ml)`,
        remedySlug,
        remedyName: name,
        form: "Mother Tincture",
        potency: "Q",
        packSize: "30 ml",
        source: "Plant",
        category: "Mother Tinctures",
        healthAreas: ["general-wellness", remedySlug],
        baseMrp: 135,
      }),
    );
  }

  for (const item of SCHWABE_ALPHA) {
    const id = `prd_${n++}`;
    out.push(
      makeProduct({
        id,
        brand: SCHWABE,
        slug: `schwabe-${item.slug}-${item.form.toLowerCase()}-${item.pack.replace(/\s+/g, "").toLowerCase()}`,
        name: `Schwabe ${item.name} ${item.form} (${item.pack})`,
        remedySlug: item.slug,
        remedyName: item.name,
        form: item.form,
        potency: "",
        packSize: item.pack,
        source: "Multi",
        category: "Specialty Combinations",
        healthAreas: ["general-wellness", "schwabe-alpha", item.slug],
        baseMrp: item.form === "Syrup" ? 175 : 155,
      }),
    );
  }

  return out;
}

/** Published retail catalogues for SBL, Dr. Reckeweg, and Schwabe. */
export const BRAND_CATALOG_PRODUCTS: Product[] = [
  ...buildSblCatalog(5000),
  ...buildReckewegCatalog(8000),
  ...buildSchwabeCatalog(10000),
];
