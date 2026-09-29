/**
 * Full storefront product catalogue taxonomy from
 * Homeopathy Product Categories (Updated).
 * Educational browse labels only — not disease-treatment claims.
 */

export type CatalogTopic = {
  slug: string;
  name: string;
};

export type CatalogCategory = {
  slug: string;
  name: string;
  summary: string;
  topics: CatalogTopic[];
};

function topic(name: string): CatalogTopic {
  return {
    name,
    slug: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
  };
}

export const CATALOG_TAXONOMY: CatalogCategory[] = [
  {
    slug: "head-and-hair",
    name: "Head & Hair",
    summary: "Hair, scalp, and grooming wellness product discovery.",
    topics: [
      "Hair",
      "Scalp",
      "Hair fall",
      "Hair growth",
      "Dandruff",
      "Premature greying",
      "Dry scalp",
      "Oily scalp",
      "Beard care",
      "Eyebrows",
      "Eyelashes",
    ].map(topic),
  },
  {
    slug: "face-and-skin",
    name: "Face & Skin",
    summary: "Skin comfort and appearance-related wellness browsing.",
    topics: [
      "Acne & pimples",
      "Pigmentation",
      "Melasma",
      "Dark spots",
      "Dry skin",
      "Oily skin",
      "Sensitive skin",
      "Eczema",
      "Psoriasis",
      "Fungal infections",
      "Warts",
      "Corns",
      "Vitiligo",
      "Itching",
      "Rashes",
      "Urticaria (hives)",
      "Cracked skin",
      "Stretch marks",
      "Scars",
      "Anti-aging skin care",
    ].map(topic),
  },
  {
    slug: "eyes",
    name: "Eyes",
    summary: "Everyday eye comfort and vision wellness topics.",
    topics: ["Dry eyes", "Eye strain", "Red eyes", "Watery eyes", "Vision wellness", "Dark circles"].map(topic),
  },
  {
    slug: "ears",
    name: "Ears",
    summary: "Ear comfort and hearing wellness browsing.",
    topics: ["Ear pain", "Earwax", "Tinnitus", "Hearing wellness"].map(topic),
  },
  {
    slug: "nose-and-sinuses",
    name: "Nose & Sinuses",
    summary: "Seasonal nose and sinus wellness discovery.",
    topics: ["Cold", "Nasal congestion", "Sinus wellness", "Allergic rhinitis", "Sneezing"].map(topic),
  },
  {
    slug: "mouth-and-dental-care",
    name: "Mouth & Dental Care",
    summary: "Oral comfort and dental wellness product discovery.",
    topics: ["Toothache", "Sensitive teeth", "Gum care", "Bleeding gums", "Mouth ulcers", "Bad breath"].map(topic),
  },
  {
    slug: "throat-and-neck",
    name: "Throat & Neck",
    summary: "Throat comfort and neck wellness topics.",
    topics: ["Sore throat", "Tonsils", "Hoarseness", "Voice care", "Thyroid wellness"].map(topic),
  },
  {
    slug: "respiratory-health",
    name: "Respiratory Health",
    summary: "Breathing comfort and seasonal respiratory browsing.",
    topics: ["Cough", "Cold", "Asthma wellness", "Allergy support", "Bronchial wellness", "Chest congestion"].map(topic),
  },
  {
    slug: "heart-and-circulation",
    name: "Heart & Circulation",
    summary: "Heart and circulation wellness education and discovery.",
    topics: ["Heart wellness", "Blood circulation", "Vein wellness", "Varicose veins", "Blood pressure wellness"].map(
      topic,
    ),
  },
  {
    slug: "digestive-health",
    name: "Digestive Health",
    summary: "Digestive comfort and gut wellness browsing.",
    topics: [
      "Acidity",
      "Gas",
      "Bloating",
      "Indigestion",
      "Constipation",
      "Diarrhea",
      "IBS wellness",
      "Appetite support",
      "Liver wellness",
      "Gallbladder wellness",
    ].map(topic),
  },
  {
    slug: "kidney-and-urinary-health",
    name: "Kidney & Urinary Health",
    summary: "Kidney and urinary wellness product discovery.",
    topics: [
      "Kidney wellness",
      "Bladder wellness",
      "Urinary tract wellness",
      "Frequent urination",
      "Kidney stone wellness",
    ].map(topic),
  },
  {
    slug: "bone-joint-and-muscle-care",
    name: "Bone, Joint & Muscle Care",
    summary: "Joint, bone, and muscle comfort browsing.",
    topics: [
      "Arthritis wellness",
      "Joint care",
      "Knee care",
      "Back pain",
      "Neck pain",
      "Shoulder pain",
      "Muscle pain",
      "Leg cramps",
      "Sciatica wellness",
      "Bone strength",
    ].map(topic),
  },
  {
    slug: "brain-and-mental-wellness",
    name: "Brain & Mental Wellness",
    summary: "Focus, mood, and mental wellness educational discovery.",
    topics: [
      "Stress",
      "Work stress",
      "Student stress",
      "Anxiety support",
      "Restlessness",
      "Overthinking",
      "Mood swings",
      "Memory",
      "Focus",
      "Concentration",
      "Brain fog",
      "Mental fatigue",
      "Emotional balance",
    ].map(topic),
  },
  {
    slug: "sleep-health",
    name: "Sleep Health",
    summary: "Sleep routine and rest wellness browsing.",
    topics: [
      "Difficulty falling asleep",
      "Interrupted sleep",
      "Restless sleep",
      "Light sleep",
      "Irregular sleep cycle",
      "Nightmares",
      "Morning fatigue",
      "Difficulty waking up",
    ].map(topic),
  },
  {
    slug: "immunity-and-general-wellness",
    name: "Immunity & General Wellness",
    summary: "Everyday immunity and recovery wellness discovery.",
    topics: ["Immunity", "Energy", "Fatigue", "Recovery", "Detox", "Healthy aging", "Daily wellness"].map(topic),
  },
  {
    slug: "weight-and-metabolism",
    name: "Weight & Metabolism",
    summary: "Metabolism and weight-management wellness browsing.",
    topics: ["Weight management", "Blood sugar wellness", "Thyroid wellness", "Metabolism support"].map(topic),
  },
  {
    slug: "womens-health",
    name: "Women's Health",
    summary: "Women's wellness topics across life stages.",
    topics: [
      "Menstrual wellness",
      "Irregular periods",
      "Painful periods",
      "Heavy bleeding",
      "PCOS/PCOD wellness",
      "White discharge",
      "Hormonal balance",
      "Fertility wellness",
      "Pregnancy wellness",
      "Post-pregnancy recovery",
      "Breast wellness",
      "Menopause wellness",
      "Iron & energy support",
    ].map(topic),
  },
  {
    slug: "mens-health",
    name: "Men's Health",
    summary: "Men's vitality and wellness discovery.",
    topics: [
      "Male vitality",
      "Stamina",
      "Energy",
      "Fertility wellness",
      "Prostate wellness",
      "Urinary wellness",
      "Hair fall",
      "Stress management",
      "Muscle wellness",
      "Healthy aging for men",
    ].map(topic),
  },
  {
    slug: "childrens-health",
    name: "Children's Health",
    summary: "Child wellness topics for caregiver discovery.",
    topics: [
      "Immunity",
      "Teething",
      "Colic",
      "Appetite support",
      "Digestion",
      "Constipation",
      "Cough & cold",
      "Allergy support",
      "Fever wellness",
      "Growth & development",
      "Sleep support",
      "Skin rashes",
      "Worm wellness",
      "Focus & concentration",
    ].map(topic),
  },
  {
    slug: "senior-health",
    name: "Senior (Old Age) Health",
    summary: "Senior wellness and healthy-aging discovery.",
    topics: [
      "Joint wellness",
      "Arthritis support",
      "Knee care",
      "Bone strength",
      "Muscle stiffness",
      "Back & neck care",
      "Memory wellness",
      "Brain health",
      "Heart wellness",
      "Blood circulation",
      "Blood pressure wellness",
      "Eye wellness",
      "Hearing wellness",
      "Prostate wellness",
      "Bladder wellness",
      "Kidney wellness",
      "Constipation",
      "Digestion",
      "Sleep support",
      "Stress & emotional wellness",
      "Energy & vitality",
      "Immunity",
      "Healthy aging",
      "Balance & mobility",
      "Dry skin",
      "Hair thinning",
    ].map(topic),
  },
];

export function getCatalogCategory(slug: string) {
  return CATALOG_TAXONOMY.find((c) => c.slug === slug);
}

export function getCatalogTopic(topicSlug: string) {
  for (const category of CATALOG_TAXONOMY) {
    const found = category.topics.find((t) => t.slug === topicSlug);
    if (found) return { category, topic: found };
  }
  return undefined;
}

export function listCatalogCategorySlugs() {
  return CATALOG_TAXONOMY.map((c) => c.slug);
}

export function listCatalogTopicSlugs() {
  return CATALOG_TAXONOMY.flatMap((c) => c.topics.map((t) => t.slug));
}

export function allCatalogTopicCount() {
  return CATALOG_TAXONOMY.reduce((n, c) => n + c.topics.length, 0);
}
