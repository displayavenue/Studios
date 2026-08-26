export type MenuLink = {
  label: string;
  path: string;
};

export type MenuNavItem = {
  id: string;
  label: string;
  type: "link" | "mega";
  path?: string;
  mega?: "services" | "packages" | "explore";
};

export type MenuConfig = {
  items: MenuNavItem[];
  cta: MenuLink;
  servicesMega: {
    eyebrow: string;
    title: string;
    viewAllLabel: string;
    viewAllPath: string;
    categories: string[];
    linksPerCategory: number;
    popularLabel: string;
    popularCount: number;
    popularSlugs: string[];
  };
  packagesMega: {
    allEyebrow: string;
    allLabel: string;
    allText: string;
    allPath: string;
    itemEyebrow: string;
    pricingEyebrow: string;
    pricingLabel: string;
    pricingText: string;
    pricingPath: string;
    showPricing: boolean;
  };
  exploreMega: {
    discoverTitle: string;
    discoverLinks: MenuLink[];
    citiesTitle: string;
    citiesCount: number;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaText: string;
    ctaPrimaryLabel: string;
    ctaPrimaryPath: string;
    ctaSecondaryLabel: string;
    showWhatsApp: boolean;
  };
  mobileLinks: MenuLink[];
};

export const menuConfig: MenuConfig = {
  items: [
    { id: "about", label: "About", type: "link", path: "/about" },
    { id: "services", label: "Services", type: "mega", mega: "services" },
    { id: "packages", label: "Packages", type: "mega", mega: "packages" },
    { id: "portfolio", label: "Portfolio", type: "link", path: "/portfolio" },
    { id: "explore", label: "Explore", type: "mega", mega: "explore" },
    { id: "contact", label: "Contact", type: "link", path: "/contact" },
  ],
  cta: {
    label: "Book Now",
    path: "/book-now",
  },
  servicesMega: {
    eyebrow: "Services",
    title: "Photography, film & post production",
    viewAllLabel: "View all services",
    viewAllPath: "/services",
    categories: ["Wedding", "Corporate", "Product", "Events", "Aerial", "Post"],
    linksPerCategory: 5,
    popularLabel: "Popular",
    popularCount: 6,
    popularSlugs: [],
  },
  packagesMega: {
    allEyebrow: "Overview",
    allLabel: "All packages",
    allText: "Compare Essential, Signature and Luxury tiers",
    allPath: "/packages",
    itemEyebrow: "Package",
    pricingEyebrow: "Guide",
    pricingLabel: "Pricing",
    pricingText: "See what shapes your quote →",
    pricingPath: "/pricing",
    showPricing: true,
  },
  exploreMega: {
    discoverTitle: "Discover",
    discoverLinks: [
      { label: "Hire by city", path: "/hire" },
      { label: "Case studies", path: "/case-studies" },
      { label: "Availability", path: "/availability" },
      { label: "Locations", path: "/locations" },
      { label: "Industries", path: "/industries" },
      { label: "Careers", path: "/careers" },
      { label: "Client gallery", path: "/client-gallery" },
      { label: "Blog", path: "/blog" },
      { label: "FAQs", path: "/faqs" },
      { label: "All pages", path: "/pages" },
    ],
    citiesTitle: "Top cities",
    citiesCount: 8,
    ctaEyebrow: "Book consultation",
    ctaTitle: "Ready when you are",
    ctaText: "Share your date and city — we reply quickly on WhatsApp.",
    ctaPrimaryLabel: "Book Now",
    ctaPrimaryPath: "/book-now",
    ctaSecondaryLabel: "WhatsApp",
    showWhatsApp: true,
  },
  mobileLinks: [
    { label: "About", path: "/about" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Hire by city", path: "/hire" },
    { label: "Case studies", path: "/case-studies" },
    { label: "Availability", path: "/availability" },
    { label: "Locations", path: "/locations" },
    { label: "Industries", path: "/industries" },
    { label: "Careers", path: "/careers" },
    { label: "Client gallery", path: "/client-gallery" },
    { label: "Blog", path: "/blog" },
    { label: "FAQs", path: "/faqs" },
    { label: "Contact", path: "/contact" },
  ],
};

export function mergeMenu(partial: Partial<MenuConfig> | null | undefined): MenuConfig {
  const p = partial || {};
  return {
    items: Array.isArray(p.items) && p.items.length ? p.items : menuConfig.items,
    cta: { ...menuConfig.cta, ...(p.cta || {}) },
    servicesMega: {
      ...menuConfig.servicesMega,
      ...(p.servicesMega || {}),
      categories:
        Array.isArray(p.servicesMega?.categories) && p.servicesMega.categories.length
          ? p.servicesMega.categories
          : menuConfig.servicesMega.categories,
      popularSlugs: Array.isArray(p.servicesMega?.popularSlugs)
        ? p.servicesMega.popularSlugs
        : menuConfig.servicesMega.popularSlugs,
    },
    packagesMega: {
      ...menuConfig.packagesMega,
      ...(p.packagesMega || {}),
    },
    exploreMega: {
      ...menuConfig.exploreMega,
      ...(p.exploreMega || {}),
      discoverLinks:
        Array.isArray(p.exploreMega?.discoverLinks) && p.exploreMega.discoverLinks.length
          ? p.exploreMega.discoverLinks
          : menuConfig.exploreMega.discoverLinks,
    },
    mobileLinks:
      Array.isArray(p.mobileLinks) && p.mobileLinks.length
        ? p.mobileLinks
        : menuConfig.mobileLinks,
  };
}
