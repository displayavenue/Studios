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
    searchPlaceholder: "Search medicines, brands & doctors",
    banners: [
      {
        id: "banner-hero",
        eyebrow: "",
        title: "Homeopathy, labelled clearly.",
        subtitle:
          "Shop SBL, Dr. Reckeweg, and Schwabe — then book a listed BHMS doctor when you need guidance.",
        ctaLabel: "Shop medicines",
        ctaHref: "/shop/",
        tone: "teal",
      },
    ],
    categories: [],
    rails: {
      bestsellersTitle: "Popular from SBL, Reckeweg & Schwabe",
      consultTitle: "Consult a listed BHMS doctor",
      consultBody: "Online video or clinic visits with practitioners listed for Mumbai.",
      brandsTitle: "Trusted brands in stock",
      doctorsTitle: "Doctors in Mumbai",
    },
  };
}

/** Loaded from Admin-controlled `data/cms/homepage.json` at build/runtime. */
export const HOMEPAGE = loadHomepage();
