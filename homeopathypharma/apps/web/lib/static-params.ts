/** Placeholder slugs for static export shells — not production catalog data. */

export const PRODUCT_SLUGS = ["arnica-montana-30c"] as const;
export const DOCTOR_SLUGS = ["sample-practitioner"] as const;
export const BODY_SYSTEM_SLUGS = [
  "cardiovascular-system",
  "respiratory-system",
  "digestive-system",
  "nervous-system",
] as const;
export const ORGAN_SLUGS = ["heart", "lungs"] as const;
export const CONDITION_SLUGS = ["common-cold"] as const;
export const PET_SPECIES_SLUGS = ["dogs", "cats"] as const;
export const PET_CONDITION_SLUGS = ["digestive-comfort"] as const;
export const ARTICLE_SLUGS = ["content-governance-template"] as const;
export const BLOG_SLUGS = ["welcome-to-homeopathypharma", "understanding-potency-labels"] as const;
export const SYMPTOM_SLUGS = ["headache", "fatigue"] as const;
export const AGE_GROUP_SLUGS = ["children", "seniors"] as const;
export const GENDER_HEALTH_SLUGS = ["womens-wellness", "mens-wellness"] as const;
export const DOCTOR_CITY_SLUGS = ["mumbai", "delhi", "bengaluru"] as const;

export function toParams(slugs: readonly string[]): { slug: string }[] {
  return slugs.map((slug) => ({ slug }));
}

export function toSpeciesParams(slugs: readonly string[]): { species: string }[] {
  return slugs.map((species) => ({ species }));
}

export function toCityParams(slugs: readonly string[]): { city: string }[] {
  return slugs.map((city) => ({ city }));
}

export function toDoctorSlugParams(slugs: readonly string[]): { doctorSlug: string }[] {
  return slugs.map((doctorSlug) => ({ doctorSlug }));
}
