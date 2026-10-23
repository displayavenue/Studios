import { listBrandSlugs } from "./content/brands";
import { listAllDoctorSlugs } from "./content/doctors";
import { listProductSlugs } from "./content/products";
import { listRemedySlugs } from "./content/remedies";

/** Static export params — derived from live storefront content modules. */

export const PRODUCT_SLUGS = listProductSlugs();
export const DOCTOR_SLUGS = listAllDoctorSlugs();
export const REMEDY_SLUGS = listRemedySlugs();
export const BRAND_SLUGS = listBrandSlugs();
export const BUNDLE_SLUGS = ["family-winter-wellness-kit", "digestive-care-starter"] as const;
export const HEALTH_AREA_SLUGS = [
  "general-wellness",
  "digestive-health",
  "respiratory-health",
  "skin-health",
  "pet-care",
] as const;
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
