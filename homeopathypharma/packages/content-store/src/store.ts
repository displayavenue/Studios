import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { cmsFile, resolveCmsDir } from "./paths.js";
import type {
  DoctorOverrides,
  HomepageContent,
  ProductOverrides,
} from "./types.js";

function readJson<T>(fileName: string, fallback: T): T {
  const path = cmsFile(fileName);
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function writeJson(fileName: string, value: unknown): void {
  const dir = resolveCmsDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(cmsFile(fileName), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function getHomepage(): HomepageContent {
  return readJson<HomepageContent>("homepage.json", {
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
  });
}

export function saveHomepage(content: HomepageContent): HomepageContent {
  writeJson("homepage.json", content);
  return content;
}

export function getProductOverrides(): ProductOverrides {
  return readJson<ProductOverrides>("product-overrides.json", {});
}

export function saveProductOverrides(overrides: ProductOverrides): ProductOverrides {
  writeJson("product-overrides.json", overrides);
  return overrides;
}

export function upsertProductOverride(id: string, patch: ProductOverrides[string]): ProductOverrides {
  const all = getProductOverrides();
  all[id] = { ...all[id], ...patch };
  return saveProductOverrides(all);
}

export function getDoctorOverrides(): DoctorOverrides {
  return readJson<DoctorOverrides>("doctor-overrides.json", {});
}

export function saveDoctorOverrides(overrides: DoctorOverrides): DoctorOverrides {
  writeJson("doctor-overrides.json", overrides);
  return overrides;
}

export function upsertDoctorOverride(id: string, patch: DoctorOverrides[string]): DoctorOverrides {
  const all = getDoctorOverrides();
  all[id] = { ...all[id], ...patch };
  return saveDoctorOverrides(all);
}

export function getCmsSummary() {
  const homepage = getHomepage();
  return {
    cmsDir: resolveCmsDir(),
    bannerCount: homepage.banners.length,
    categoryCount: homepage.categories.length,
    productOverrideCount: Object.keys(getProductOverrides()).length,
    doctorOverrideCount: Object.keys(getDoctorOverrides()).length,
  };
}
