/** Real image assets under /public/images — used across storefront cards, banners, and hubs. */

const PRODUCT_IMAGES: Record<string, string> = {
  dilution: "/images/products/product-dilution.png",
  globules: "/images/products/product-globules.png",
  tablet: "/images/products/product-tablet.png",
  "mother tincture": "/images/products/product-mother-tincture.png",
  ointment: "/images/products/product-ointment.png",
  cream: "/images/products/product-ointment.png",
  syrup: "/images/products/product-syrup.png",
  drops: "/images/products/product-drops.png",
  capsule: "/images/products/product-capsule.png",
  oil: "/images/products/product-oil.png",
  kit: "/images/products/product-kit.png",
  pack: "/images/products/product-kit.png",
  bundle: "/images/products/product-kit.png",
};

const CATEGORY_IMAGES: Record<string, string> = {
  hair: "/images/categories/category-hair.png",
  scalp: "/images/categories/category-hair.png",
  "head-and-hair": "/images/categories/category-hair.png",
  skin: "/images/categories/category-skin.png",
  face: "/images/categories/category-skin.png",
  "face-and-skin": "/images/categories/category-skin.png",
  digestive: "/images/categories/category-digestive.png",
  "digestive-health": "/images/categories/category-digestive.png",
  respiratory: "/images/categories/category-respiratory.png",
  "respiratory-health": "/images/categories/category-respiratory.png",
  women: "/images/categories/category-women.png",
  "womens-health": "/images/categories/category-women.png",
  men: "/images/categories/category-men.png",
  "mens-health": "/images/categories/category-men.png",
  child: "/images/categories/category-child.png",
  children: "/images/categories/category-child.png",
  "childrens-health": "/images/categories/category-child.png",
  senior: "/images/categories/category-senior.png",
  "senior-health": "/images/categories/category-senior.png",
  sleep: "/images/categories/category-sleep.png",
  "sleep-health": "/images/categories/category-sleep.png",
  immunity: "/images/categories/category-immunity.png",
  "immunity-and-general-wellness": "/images/categories/category-immunity.png",
  joints: "/images/categories/category-joints.png",
  "bone-joint-and-muscle-care": "/images/categories/category-joints.png",
  eyes: "/images/categories/category-eyes.png",
  all: "/images/categories/category-immunity.png",
};

const BRAND_IMAGES: Record<string, string> = {
  sbl: "/images/brands/brand-sbl.png",
  "dr-reckeweg": "/images/brands/brand-reckeweg.png",
  schwabe: "/images/brands/brand-schwabe.png",
  "homeopathypharma-essentials": "/images/brands/brand-sbl.png",
  "harbour-leaf-remedies": "/images/brands/brand-schwabe.png",
  "coastal-biochemic": "/images/products/product-tablet.png",
  "saffron-grove-care": "/images/products/product-kit.png",
};

export const HOME_BANNERS = [
  {
    id: "medicines",
    image: "/images/banners/banner-medicines.png",
    title: "Shop homeopathy medicines",
    subtitle: "SBL · Reckeweg · Schwabe with clear pack labels",
    ctaLabel: "Browse medicines",
    ctaHref: "/shop/",
  },
  {
    id: "consult",
    image: "/images/banners/banner-consult.png",
    title: "Consult listed BHMS doctors",
    subtitle: "Online video or clinic visits in Mumbai",
    ctaLabel: "Find a doctor",
    ctaHref: "/doctors/city/mumbai/",
  },
  {
    id: "brands",
    image: "/images/banners/banner-brands.png",
    title: "Trusted brands in stock",
    subtitle: "Full Reckeweg R1–R89 · SBL · Schwabe catalogues",
    ctaLabel: "Shop by brand",
    ctaHref: "/brands/",
  },
] as const;

function formKey(form: string): string {
  const f = form.toLowerCase();
  for (const key of Object.keys(PRODUCT_IMAGES)) {
    if (f.includes(key)) return key;
  }
  return "dilution";
}

/** Product packshot path based on dosage form. */
export function productImageSrc(input: { form: string; brandSlug?: string; name?: string }): string {
  return PRODUCT_IMAGES[formKey(input.form)] ?? PRODUCT_IMAGES.dilution!;
}

/** @deprecated Use productImageSrc — kept for call-site compatibility during migration. */
export function productImageDataUrl(input: {
  name: string;
  form: string;
  brandName: string;
  potency?: string;
}): string {
  return productImageSrc(input);
}

export function categoryImageSrc(labelOrSeed: string): string {
  const key = labelOrSeed.toLowerCase().replace(/\s+/g, "-");
  if (CATEGORY_IMAGES[key]) return CATEGORY_IMAGES[key]!;
  for (const [k, path] of Object.entries(CATEGORY_IMAGES)) {
    if (key.includes(k) || k.includes(key)) return path;
  }
  return CATEGORY_IMAGES.immunity!;
}

/** @deprecated Use categoryImageSrc */
export function categoryImageDataUrl(label: string, seed: string): string {
  return categoryImageSrc(seed || label);
}

export function brandImageSrc(slug: string): string {
  return BRAND_IMAGES[slug] ?? "/images/brands/brand-sbl.png";
}

export function doctorAvatarSrc(fullName: string): string {
  const femaleHints = /\b(aisha|ananya|aditi|priya|neha|riya|sara|shruti|meera|kavya|isha|pooja|divya|nisha|swati|sonali|aarti|aarohi|aanya)\b/i;
  return femaleHints.test(fullName) ? "/images/doctors/doctor-female.png" : "/images/doctors/doctor-male.png";
}

/** @deprecated Use doctorAvatarSrc */
export function doctorAvatarDataUrl(fullName: string, _locality: string): string {
  return doctorAvatarSrc(fullName);
}

/** @deprecated Homepage now uses HOME_BANNERS carousel images */
export function heroApothecaryImageDataUrl(): string {
  return HOME_BANNERS[0]!.image;
}
