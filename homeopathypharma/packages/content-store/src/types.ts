export type HomeBanner = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  tone: "teal" | "amber" | "sage";
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
  priceInr?: number;
  mrpInr?: number;
  inStock?: boolean;
  listed?: boolean;
};

export type DoctorOverride = {
  consultationFeeInr?: number;
  acceptingPatients?: boolean;
  availabilityNote?: string;
  verificationStatus?: "LISTED" | "VERIFIED";
  listed?: boolean;
};

export type ProductOverrides = Record<string, ProductOverride>;
export type DoctorOverrides = Record<string, DoctorOverride>;
