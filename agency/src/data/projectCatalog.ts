import { buildDetailPage, type DetailPageContent } from "./catalogTypes";

const defs: Array<Partial<DetailPageContent> & Pick<DetailPageContent, "slug" | "kind" | "title" | "category">> = [
  {"slug":"vaidraj","kind":"project","title":"Vaidraj Ayurvedic Store","category":"E-commerce","industry":"Healthcare","icon":"bag","color":"#065f46","headline":"Healthcare Ecommerce","summary":"Strategy, design, and growth systems for healthcare brands — built for measurable results.","related":[{"label":"All Portfolio","href":"/portfolio"},{"label":"Case Studies","href":"/case-studies"},{"label":"Start Your Project","href":"/contact"}]},
  {"slug":"bpg","kind":"project","title":"Bhaskar Patil Group Website","category":"Web Development","industry":"Real Estate","icon":"code","color":"#1e3a8a","headline":"Real Estate Websites","summary":"Strategy, design, and growth systems for real estate brands — built for measurable results.","related":[{"label":"All Portfolio","href":"/portfolio"},{"label":"Case Studies","href":"/case-studies"},{"label":"Start Your Project","href":"/contact"}]},
  {"slug":"rak","kind":"project","title":"RAK Ceramics Brand System","category":"Branding","industry":"Manufacturing","icon":"brand","color":"#4c1d95","headline":"Manufacturing Branding","summary":"Strategy, design, and growth systems for manufacturing brands — built for measurable results.","related":[{"label":"All Portfolio","href":"/portfolio"},{"label":"Case Studies","href":"/case-studies"},{"label":"Start Your Project","href":"/contact"}]},
  {"slug":"royal","kind":"project","title":"Royal Mouth Fresheners Growth","category":"Digital Marketing","industry":"Ecommerce","icon":"megaphone","color":"#9a3412","headline":"Ecommerce Marketing","summary":"Strategy, design, and growth systems for ecommerce brands — built for measurable results.","related":[{"label":"All Portfolio","href":"/portfolio"},{"label":"Case Studies","href":"/case-studies"},{"label":"Start Your Project","href":"/contact"}]},
];

export const projectPages: DetailPageContent[] = defs.map((d) => buildDetailPage(d));
export const projectBySlug = Object.fromEntries(projectPages.map((p) => [p.slug, p])) as Record<string, DetailPageContent>;
export function getProjectPage(slug: string): DetailPageContent | undefined { return projectBySlug[slug]; }
