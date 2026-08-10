export type AwardItem = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  summary: string;
  category?: string;
  image: string;
  featured?: boolean;
};

export type CertificationItem = {
  id: string;
  title: string;
  issuer: string;
  credential: string;
  year: string;
  brand: string;
  category?: string;
  image: string;
  featured?: boolean;
};

export type AwardsCms = {
  enabled: boolean;
  title: string;
  sub: string;
  seo?: { title?: string; description?: string };
  homeTitle?: string;
  homeSub?: string;
  homeAwardsLimit?: number;
  homeCertsLimit?: number;
  items: AwardItem[];
};

export type CertificationsCms = {
  enabled: boolean;
  title: string;
  sub: string;
  seo?: { title?: string; description?: string };
  items: CertificationItem[];
};

export const fallbackAwards: AwardsCms = {
  enabled: true,
  title: "Awards we've won",
  sub: "Recognition for results, delivery, and partner excellence - earned by the DisplayAvenue team.",
  seo: {
    title: "Awards | DisplayAvenue",
    description:
      "19 awards won by the DisplayAvenue team for digital marketing, SEO, ads, AI, and client results.",
  },
  homeTitle: "Certifications & awards",
  homeSub:
    "Credentials our team earned from Google, Meta, HubSpot, and more - plus awards for real client results.",
  homeAwardsLimit: 6,
  homeCertsLimit: 8,
  items: [],
};

export const fallbackCertifications: CertificationsCms = {
  enabled: true,
  title: "Team certifications",
  sub: "40 professional certificates from Google, Meta, HubSpot, Microsoft, Semrush, Shopify, and more.",
  seo: {
    title: "Certifications | DisplayAvenue",
    description:
      "40 DisplayAvenue team certifications from Google Skillshop, Meta Blueprint, HubSpot Academy, and leading platforms.",
  },
  items: [],
};
