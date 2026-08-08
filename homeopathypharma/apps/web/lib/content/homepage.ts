import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { HomepageContent } from "../../../../data/cms/homepage-types";

export type { HomeBanner, HomeCategoryChip, HomepageContent } from "../../../../data/cms/homepage-types";

function loadHomepage(): HomepageContent {
  const candidates = [
    join(process.cwd(), "../../data/cms/homepage.json"),
    join(process.cwd(), "data/cms/homepage.json"),
    join(process.cwd(), "../data/cms/homepage.json"),
  ];
  for (const path of candidates) {
    try {
      return JSON.parse(readFileSync(path, "utf8")) as HomepageContent;
    } catch {
      // try next
    }
  }
  return {
    searchPlaceholder: "Search medicines, remedies & doctors",
    banners: [],
    categories: [],
    rails: {
      bestsellersTitle: "Popular medicines",
      consultTitle: "Consult a homeopathy doctor",
      consultBody: "Book online or clinic visits with listed BHMS practitioners.",
      brandsTitle: "Shop by brand",
      doctorsTitle: "Doctors near you",
    },
  };
}

/** Loaded from Admin-controlled `data/cms/homepage.json` at build/runtime. */
export const HOMEPAGE = loadHomepage();
