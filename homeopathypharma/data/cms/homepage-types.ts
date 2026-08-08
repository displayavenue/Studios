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
