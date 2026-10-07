export type HomeBanner = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  tone: "teal" | "amber" | "sage";
  /** Public image path, e.g. /images/banners/banner-medicines.png */
  imageUrl?: string;
};

export type HomeCategoryChip = {
  label: string;
  href: string;
  seed: string;
};

export type HomepageContent = {
  searchPlaceholder: string;
  banners: HomeBanner[];
  categories: HomeCategoryChip[];
  rails: {
    bestsellersTitle: string;
    consultTitle: string;
    consultBody: string;
    brandsTitle: string;
    doctorsTitle: string;
  };
};

export type ProductOverride = {
  name?: string;
  description?: string;
  priceInr?: number;
  mrpInr?: number;
  inStock?: boolean;
  listed?: boolean;
  imageUrl?: string;
  brandSlug?: string;
  brandName?: string;
  form?: string;
  potency?: string;
  packSize?: string;
  category?: string;
};

export type DoctorOverride = {
  consultationFeeInr?: number;
  acceptingPatients?: boolean;
  availabilityNote?: string;
  verificationStatus?: "LISTED" | "VERIFIED";
  listed?: boolean;
  fullName?: string;
  city?: string;
  specialties?: string[];
};

export type ProductOverrides = Record<string, ProductOverride>;
export type DoctorOverrides = Record<string, DoctorOverride>;

export type CmsPageStatus = "draft" | "published";

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  status: CmsPageStatus;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
};

export type CmsMenuItem = {
  id: string;
  label: string;
  href: string;
  order: number;
};

export type CmsMenus = {
  header: CmsMenuItem[];
  footer: CmsMenuItem[];
  mobile: CmsMenuItem[];
};

export type CmsMediaItem = {
  id: string;
  /** Public URL path served by the storefront */
  url: string;
  alt: string;
  filename: string;
  mimeType: string;
  uploadedAt: string;
};

export type CmsSettings = {
  siteName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  currency: string;
  timezone: string;
};
