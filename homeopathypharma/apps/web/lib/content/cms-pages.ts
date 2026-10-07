import { readFileSync, existsSync } from "fs";
import { join } from "path";

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
};

function loadPages(): CmsPage[] {
  const candidates = [
    join(process.cwd(), "../../data/cms/pages.json"),
    join(process.cwd(), "data/cms/pages.json"),
    join(process.cwd(), "../data/cms/pages.json"),
  ];
  for (const path of candidates) {
    try {
      if (!existsSync(path)) continue;
      return JSON.parse(readFileSync(path, "utf8")) as CmsPage[];
    } catch {
      // try next
    }
  }
  return [];
}

export const CMS_PAGES = loadPages();

export function getPublishedCmsPage(slug: string): CmsPage | undefined {
  return CMS_PAGES.find((p) => p.slug === slug && p.status === "published");
}

export function listPublishedCmsPages(): CmsPage[] {
  return CMS_PAGES.filter((p) => p.status === "published");
}
