export type ProductFaq = { q: string; a: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  remedySlug: string;
  remedyName: string;
  brandSlug: string;
  brandName: string;
  manufacturer: string;
  form: string;
  potency: string;
  packSize: string;
  source: string;
  mrpInr: number;
  priceInr: number;
  inStock: boolean;
  batchNote: string;
  directions: string;
  warnings: string;
  ingredients: string;
  storage: string;
  faqs: ProductFaq[];
  healthAreas: string[];
  category: string;
};
