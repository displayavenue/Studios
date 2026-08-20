import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { cmsFile } from "./paths.js";
import {
  getDoctorOverrides,
  getProductOverrides,
  upsertDoctorOverride,
  upsertProductOverride,
} from "./store.js";

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  brandSlug: string;
  brandName: string;
  form: string;
  potency: string;
  packSize: string;
  mrpInr: number;
  priceInr: number;
  inStock: boolean;
  category: string;
  remedySlug: string;
  remedyName: string;
  healthAreas: string[];
  manufacturer: string;
};

export type CatalogDoctor = {
  id: string;
  slug: string;
  fullName: string;
  credentials: string;
  city: string;
  locality: string;
  specialties: string[];
  consultationFeeInr: number;
  formats: string[];
  yearsExperience: number;
  acceptingPatients: boolean;
  verificationStatus: "LISTED" | "VERIFIED";
  listed: boolean;
  clinicName: string;
};

export type CatalogSnapshot = {
  products: CatalogProduct[];
  doctors: CatalogDoctor[];
  brands: { slug: string; name: string; manufacturer: string; productCount: number }[];
  categories: { slug: string; name: string }[];
};

export function readCatalogSnapshot(): CatalogSnapshot {
  const path = cmsFile("catalog-snapshot.json");
  if (!existsSync(path)) {
    return { products: [], doctors: [], brands: [], categories: [] };
  }
  return JSON.parse(readFileSync(path, "utf8")) as CatalogSnapshot;
}

export function writeCatalogSnapshot(snapshot: CatalogSnapshot): void {
  writeFileSync(cmsFile("catalog-snapshot.json"), `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

export function listCatalogProducts(): CatalogProduct[] {
  const snap = readCatalogSnapshot();
  const overrides = getProductOverrides();
  return snap.products
    .map((p) => {
      const o = overrides[p.id];
      if (!o) return p;
      return {
        ...p,
        name: o.name ?? p.name,
        priceInr: o.priceInr ?? p.priceInr,
        mrpInr: o.mrpInr ?? p.mrpInr,
        inStock: o.inStock ?? p.inStock,
      };
    })
    .filter((p) => (overrides[p.id]?.listed ?? true) !== false);
}

export function listCatalogDoctors(): CatalogDoctor[] {
  const snap = readCatalogSnapshot();
  const overrides = getDoctorOverrides();
  return snap.doctors
    .map((d) => {
      const o = overrides[d.id];
      if (!o) return d;
      return {
        ...d,
        consultationFeeInr: o.consultationFeeInr ?? d.consultationFeeInr,
        acceptingPatients: o.acceptingPatients ?? d.acceptingPatients,
        verificationStatus: o.verificationStatus ?? d.verificationStatus,
        listed: o.listed ?? d.listed,
      };
    })
    .filter((d) => d.listed !== false);
}

export function updateCatalogProduct(id: string, patch: Record<string, unknown>) {
  upsertProductOverride(id, {
    name: typeof patch.name === "string" ? patch.name : undefined,
    priceInr: typeof patch.priceInr === "number" ? patch.priceInr : undefined,
    mrpInr: typeof patch.mrpInr === "number" ? patch.mrpInr : undefined,
    inStock: typeof patch.inStock === "boolean" ? patch.inStock : undefined,
    listed: typeof patch.listed === "boolean" ? patch.listed : undefined,
  });
  return listCatalogProducts().find((p) => p.id === id) ?? null;
}

export function updateCatalogDoctor(id: string, patch: Record<string, unknown>) {
  upsertDoctorOverride(id, {
    consultationFeeInr: typeof patch.consultationFeeInr === "number" ? patch.consultationFeeInr : undefined,
    acceptingPatients: typeof patch.acceptingPatients === "boolean" ? patch.acceptingPatients : undefined,
    availabilityNote: typeof patch.availabilityNote === "string" ? patch.availabilityNote : undefined,
    verificationStatus:
      patch.verificationStatus === "LISTED" || patch.verificationStatus === "VERIFIED"
        ? patch.verificationStatus
        : undefined,
    listed: typeof patch.listed === "boolean" ? patch.listed : undefined,
  });
  return listCatalogDoctors().find((d) => d.id === id) ?? null;
}
