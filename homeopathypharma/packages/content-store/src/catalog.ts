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
  description?: string;
  imageUrl?: string;
  listed?: boolean;
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

export type CatalogBrand = {
  slug: string;
  name: string;
  manufacturer: string;
  productCount: number;
  description?: string;
  imageUrl?: string;
};

export type CatalogSnapshot = {
  products: CatalogProduct[];
  doctors: CatalogDoctor[];
  brands: CatalogBrand[];
  categories: { slug: string; name: string }[];
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

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

export function listCatalogProducts(includeUnlisted = false): CatalogProduct[] {
  const snap = readCatalogSnapshot();
  const overrides = getProductOverrides();
  return snap.products
    .map((p) => {
      const o = overrides[p.id];
      if (!o) return { ...p, listed: p.listed ?? true };
      return {
        ...p,
        name: o.name ?? p.name,
        description: o.description ?? p.description,
        priceInr: o.priceInr ?? p.priceInr,
        mrpInr: o.mrpInr ?? p.mrpInr,
        inStock: o.inStock ?? p.inStock,
        imageUrl: o.imageUrl ?? p.imageUrl,
        brandSlug: o.brandSlug ?? p.brandSlug,
        brandName: o.brandName ?? p.brandName,
        form: o.form ?? p.form,
        potency: o.potency ?? p.potency,
        packSize: o.packSize ?? p.packSize,
        category: o.category ?? p.category,
        listed: o.listed ?? p.listed ?? true,
      };
    })
    .filter((p) => includeUnlisted || p.listed !== false);
}

export function listCatalogDoctors(includeUnlisted = false): CatalogDoctor[] {
  const snap = readCatalogSnapshot();
  const overrides = getDoctorOverrides();
  return snap.doctors
    .map((d) => {
      const o = overrides[d.id];
      if (!o) return d;
      return {
        ...d,
        fullName: o.fullName ?? d.fullName,
        city: o.city ?? d.city,
        specialties: o.specialties ?? d.specialties,
        consultationFeeInr: o.consultationFeeInr ?? d.consultationFeeInr,
        acceptingPatients: o.acceptingPatients ?? d.acceptingPatients,
        verificationStatus: o.verificationStatus ?? d.verificationStatus,
        listed: o.listed ?? d.listed,
      };
    })
    .filter((d) => includeUnlisted || d.listed !== false);
}

export function listCatalogBrands(): CatalogBrand[] {
  const snap = readCatalogSnapshot();
  const products = listCatalogProducts(true);
  return snap.brands.map((b) => ({
    ...b,
    productCount: products.filter((p) => p.brandSlug === b.slug && p.listed !== false).length,
  }));
}

export function updateCatalogBrand(slug: string, patch: Partial<CatalogBrand>): CatalogBrand | null {
  const snap = readCatalogSnapshot();
  const idx = snap.brands.findIndex((b) => b.slug === slug);
  if (idx < 0) return null;
  snap.brands[idx] = {
    ...snap.brands[idx]!,
    name: patch.name ?? snap.brands[idx]!.name,
    manufacturer: patch.manufacturer ?? snap.brands[idx]!.manufacturer,
    description: patch.description ?? snap.brands[idx]!.description,
    imageUrl: patch.imageUrl ?? snap.brands[idx]!.imageUrl,
  };
  if (patch.name) {
    for (const p of snap.products) {
      if (p.brandSlug === slug) p.brandName = patch.name;
    }
  }
  writeCatalogSnapshot(snap);
  return listCatalogBrands().find((b) => b.slug === slug) ?? null;
}

export function createCatalogBrand(input: {
  name: string;
  manufacturer?: string;
  description?: string;
  imageUrl?: string;
  slug?: string;
}): CatalogBrand {
  const snap = readCatalogSnapshot();
  const slug = input.slug?.trim() || slugify(input.name);
  if (snap.brands.some((b) => b.slug === slug)) {
    throw new Error(`Brand slug already exists: ${slug}`);
  }
  const brand: CatalogBrand = {
    slug,
    name: input.name,
    manufacturer: input.manufacturer ?? input.name,
    productCount: 0,
    description: input.description,
    imageUrl: input.imageUrl,
  };
  snap.brands.push(brand);
  writeCatalogSnapshot(snap);
  return brand;
}

export function updateCatalogProduct(id: string, patch: Record<string, unknown>) {
  const snap = readCatalogSnapshot();
  const idx = snap.products.findIndex((p) => p.id === id);
  if (idx >= 0) {
    const current = snap.products[idx]!;
    snap.products[idx] = {
      ...current,
      name: typeof patch.name === "string" ? patch.name : current.name,
      description: typeof patch.description === "string" ? patch.description : current.description,
      priceInr: typeof patch.priceInr === "number" ? patch.priceInr : current.priceInr,
      mrpInr: typeof patch.mrpInr === "number" ? patch.mrpInr : current.mrpInr,
      inStock: typeof patch.inStock === "boolean" ? patch.inStock : current.inStock,
      listed: typeof patch.listed === "boolean" ? patch.listed : current.listed,
      imageUrl: typeof patch.imageUrl === "string" ? patch.imageUrl : current.imageUrl,
      brandSlug: typeof patch.brandSlug === "string" ? patch.brandSlug : current.brandSlug,
      brandName: typeof patch.brandName === "string" ? patch.brandName : current.brandName,
      form: typeof patch.form === "string" ? patch.form : current.form,
      potency: typeof patch.potency === "string" ? patch.potency : current.potency,
      packSize: typeof patch.packSize === "string" ? patch.packSize : current.packSize,
      category: typeof patch.category === "string" ? patch.category : current.category,
      slug: typeof patch.slug === "string" ? patch.slug : current.slug,
    };
    writeCatalogSnapshot(snap);
  }
  // Keep overrides in sync for storefronts that still merge overrides
  upsertProductOverride(id, {
    name: typeof patch.name === "string" ? patch.name : undefined,
    description: typeof patch.description === "string" ? patch.description : undefined,
    priceInr: typeof patch.priceInr === "number" ? patch.priceInr : undefined,
    mrpInr: typeof patch.mrpInr === "number" ? patch.mrpInr : undefined,
    inStock: typeof patch.inStock === "boolean" ? patch.inStock : undefined,
    listed: typeof patch.listed === "boolean" ? patch.listed : undefined,
    imageUrl: typeof patch.imageUrl === "string" ? patch.imageUrl : undefined,
    brandSlug: typeof patch.brandSlug === "string" ? patch.brandSlug : undefined,
    brandName: typeof patch.brandName === "string" ? patch.brandName : undefined,
    form: typeof patch.form === "string" ? patch.form : undefined,
    potency: typeof patch.potency === "string" ? patch.potency : undefined,
    packSize: typeof patch.packSize === "string" ? patch.packSize : undefined,
    category: typeof patch.category === "string" ? patch.category : undefined,
  });
  return listCatalogProducts(true).find((p) => p.id === id) ?? null;
}

export function createCatalogProduct(input: {
  name: string;
  brandSlug: string;
  brandName?: string;
  form?: string;
  potency?: string;
  packSize?: string;
  priceInr: number;
  mrpInr?: number;
  category?: string;
  description?: string;
  imageUrl?: string;
  slug?: string;
}): CatalogProduct {
  const snap = readCatalogSnapshot();
  const slug = input.slug?.trim() || slugify(input.name);
  const id = `cms-${Date.now().toString(36)}`;
  const brand = snap.brands.find((b) => b.slug === input.brandSlug);
  const product: CatalogProduct = {
    id,
    slug,
    name: input.name,
    brandSlug: input.brandSlug,
    brandName: input.brandName ?? brand?.name ?? input.brandSlug,
    form: input.form ?? "Dilution",
    potency: input.potency ?? "",
    packSize: input.packSize ?? "",
    mrpInr: input.mrpInr ?? input.priceInr,
    priceInr: input.priceInr,
    inStock: true,
    category: input.category ?? "General",
    remedySlug: slugify(input.name.split(" ")[0] ?? input.name),
    remedyName: input.name.split(" ").slice(0, 2).join(" ") || input.name,
    healthAreas: [],
    manufacturer: brand?.manufacturer ?? input.brandName ?? input.brandSlug,
    description: input.description ?? "",
    imageUrl: input.imageUrl,
    listed: true,
  };
  snap.products.unshift(product);
  const brandIdx = snap.brands.findIndex((b) => b.slug === input.brandSlug);
  if (brandIdx >= 0) {
    snap.brands[brandIdx]!.productCount = (snap.brands[brandIdx]!.productCount ?? 0) + 1;
  }
  writeCatalogSnapshot(snap);
  return product;
}

export function deleteCatalogProduct(id: string): boolean {
  const snap = readCatalogSnapshot();
  const before = snap.products.length;
  snap.products = snap.products.filter((p) => p.id !== id);
  if (snap.products.length === before) {
    upsertProductOverride(id, { listed: false });
    return true;
  }
  writeCatalogSnapshot(snap);
  upsertProductOverride(id, { listed: false });
  return true;
}

export function updateCatalogDoctor(id: string, patch: Record<string, unknown>) {
  const snap = readCatalogSnapshot();
  const idx = snap.doctors.findIndex((d) => d.id === id);
  if (idx >= 0) {
    const current = snap.doctors[idx]!;
    snap.doctors[idx] = {
      ...current,
      fullName: typeof patch.fullName === "string" ? patch.fullName : current.fullName,
      city: typeof patch.city === "string" ? patch.city : current.city,
      consultationFeeInr:
        typeof patch.consultationFeeInr === "number" ? patch.consultationFeeInr : current.consultationFeeInr,
      acceptingPatients:
        typeof patch.acceptingPatients === "boolean" ? patch.acceptingPatients : current.acceptingPatients,
      verificationStatus:
        patch.verificationStatus === "LISTED" || patch.verificationStatus === "VERIFIED"
          ? patch.verificationStatus
          : current.verificationStatus,
      listed: typeof patch.listed === "boolean" ? patch.listed : current.listed,
      specialties: Array.isArray(patch.specialties)
        ? (patch.specialties as string[])
        : current.specialties,
    };
    writeCatalogSnapshot(snap);
  }
  upsertDoctorOverride(id, {
    consultationFeeInr: typeof patch.consultationFeeInr === "number" ? patch.consultationFeeInr : undefined,
    acceptingPatients: typeof patch.acceptingPatients === "boolean" ? patch.acceptingPatients : undefined,
    availabilityNote: typeof patch.availabilityNote === "string" ? patch.availabilityNote : undefined,
    verificationStatus:
      patch.verificationStatus === "LISTED" || patch.verificationStatus === "VERIFIED"
        ? patch.verificationStatus
        : undefined,
    listed: typeof patch.listed === "boolean" ? patch.listed : undefined,
    fullName: typeof patch.fullName === "string" ? patch.fullName : undefined,
    city: typeof patch.city === "string" ? patch.city : undefined,
    specialties: Array.isArray(patch.specialties) ? (patch.specialties as string[]) : undefined,
  });
  return listCatalogDoctors(true).find((d) => d.id === id) ?? null;
}
