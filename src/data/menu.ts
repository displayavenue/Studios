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
  "items": [
    {
      "id": "services",
      "label": "Services",
      "type": "mega",
      "mega": "services"
    },
    {
      "id": "packages",
      "label": "Packages",
      "type": "mega",
      "mega": "packages"
    },
    {
      "id": "portfolio",
      "label": "Portfolio",
      "type": "link",
      "path": "/portfolio"
    },
    {
      "id": "explore",
      "label": "Explore",
      "type": "mega",
      "mega": "explore"
    }
  ],
  "cta": {
    "label": "Book Now",
    "path": "/book-now"
  },
  "servicesMega": {
    "eyebrow": "Celebrate with us",
    "title": "Wedding photography & videography",
    "viewAllLabel": "View all services",
    "viewAllPath": "/services",
    "categories": [
      "Wedding",
      "Pre-Wedding",
      "Engagement",
      "Maternity",
      "Birthday",
      "Events"
    ],
    "linksPerCategory": 5,
    "popularLabel": "Most searched",
    "popularCount": 8,
    "popularSlugs": [
      "wedding-photography",
      "wedding-videography",
      "wedding-films",
      "candid-wedding-photography",
      "pre-wedding-shoot",
      "pre-wedding-videography",
      "engagement-photography",
      "maternity-photography"
    ]
  },
  "packagesMega": {
    "allEyebrow": "Packages",
    "allLabel": "All packages",
    "allText": "Essential · Signature · Luxury for weddings and life celebrations.",
    "allPath": "/packages",
    "itemEyebrow": "Package",
    "pricingEyebrow": "Pricing",
    "pricingLabel": "Compare pricing",
    "pricingText": "Transparent starting ranges for Mumbai and destination weddings.",
    "pricingPath": "/pricing",
    "showPricing": true
  },
  "exploreMega": {
    "discoverTitle": "Discover",
    "discoverLinks": [
      {
        "label": "Wedding photographer Mumbai",
        "path": "/locations/wedding-photographer-mumbai"
      },
      {
        "label": "Candid wedding Mumbai",
        "path": "/locations/candid-wedding-photographer-mumbai"
      },
      {
        "label": "Pre-wedding shoot Mumbai",
        "path": "/locations/pre-wedding-shoot-mumbai"
      },
      {
        "label": "Hire by city",
        "path": "/hire"
      },
      {
        "label": "Case studies",
        "path": "/case-studies"
      },
      {
        "label": "Availability",
        "path": "/availability"
      },
      {
        "label": "Wedding styles",
        "path": "/industries"
      },
      {
        "label": "Careers",
        "path": "/careers"
      },
      {
        "label": "Client gallery",
        "path": "/client-gallery"
      },
      {
        "label": "Journal",
        "path": "/blog"
      },
      {
        "label": "FAQs",
        "path": "/faqs"
      },
      {
        "label": "All pages",
        "path": "/pages"
      }
    ],
    "citiesTitle": "Top cities",
    "citiesCount": 8,
    "ctaEyebrow": "Book your date",
    "ctaTitle": "Peak Saturdays fill first",
    "ctaText": "Share your wedding date and city — we reply quickly on WhatsApp.",
    "ctaPrimaryLabel": "Book Now",
    "ctaPrimaryPath": "/book-now",
    "ctaSecondaryLabel": "WhatsApp",
    "showWhatsApp": true
  },
  "mobileLinks": [
    {
      "label": "Wedding Photography",
      "path": "/services/wedding-photography"
    },
    {
      "label": "Wedding Videography",
      "path": "/services/wedding-videography"
    },
    {
      "label": "Cinematic Films",
      "path": "/services/wedding-films"
    },
    {
      "label": "Candid Wedding",
      "path": "/services/candid-wedding-photography"
    },
    {
      "label": "Pre-Wedding Photo",
      "path": "/services/pre-wedding-shoot"
    },
    {
      "label": "Pre-Wedding Film",
      "path": "/services/pre-wedding-videography"
    },
    {
      "label": "Engagement",
      "path": "/services/engagement-photography"
    },
    {
      "label": "Maternity",
      "path": "/services/maternity-photography"
    },
    {
      "label": "Birthday Photo & Film",
      "path": "/services/birthday-photography"
    },
    {
      "label": "Event Coverage",
      "path": "/services/event-coverage"
    },
    {
      "label": "Packages",
      "path": "/packages"
    },
    {
      "label": "Portfolio",
      "path": "/portfolio"
    },
    {
      "label": "Availability",
      "path": "/availability"
    },
    {
      "label": "Contact",
      "path": "/contact"
    }
  ]
};

export function mergeMenu(partial: Partial<MenuConfig> | null | undefined): MenuConfig {
  const p = partial || {};
  return {
    items: Array.isArray(p.items) && p.items.length ? (p.items as MenuNavItem[]) : menuConfig.items,
    cta: { ...menuConfig.cta, ...(p.cta || {}) },
    servicesMega: {
      ...menuConfig.servicesMega,
      ...(p.servicesMega || {}),
      categories:
        Array.isArray(p.servicesMega?.categories) && p.servicesMega.categories.length
          ? (p.servicesMega.categories as string[]).map((c: any) =>
              typeof c === "string" ? c : c.category || c.label,
            )
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
