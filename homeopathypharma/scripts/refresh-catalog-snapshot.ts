import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DOCTORS } from "../apps/web/lib/content/doctors";
import { PRODUCTS } from "../apps/web/lib/content/products";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const brandMap = new Map<
  string,
  { slug: string; name: string; manufacturer: string; productCount: number }
>();
for (const p of PRODUCTS) {
  const cur = brandMap.get(p.brandSlug) || {
    slug: p.brandSlug,
    name: p.brandName,
    manufacturer: p.manufacturer,
    productCount: 0,
  };
  cur.productCount++;
  brandMap.set(p.brandSlug, cur);
}

const catalog = {
  products: PRODUCTS.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brandSlug: p.brandSlug,
    brandName: p.brandName,
    form: p.form,
    potency: p.potency,
    packSize: p.packSize,
    mrpInr: p.mrpInr,
    priceInr: p.priceInr,
    inStock: p.inStock,
    category: p.category,
    remedySlug: p.remedySlug,
    remedyName: p.remedyName,
    healthAreas: p.healthAreas,
    manufacturer: p.manufacturer,
  })),
  doctors: DOCTORS.map((d) => ({
    id: d.id,
    slug: d.slug,
    fullName: d.fullName,
    credentials: d.credentials,
    city: d.city,
    locality: d.locality,
    specialties: d.specialties,
    consultationFeeInr: d.consultationFeeInr,
    formats: d.formats,
    yearsExperience: d.yearsExperience,
    acceptingPatients: d.acceptingPatients,
    verificationStatus: d.verificationStatus,
    listed: d.listed,
    clinicName: d.clinicName,
  })),
  brands: [...brandMap.values()],
  categories: [...new Set(PRODUCTS.map((p) => p.category))].map((name) => ({
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
  })),
};

writeFileSync(join(root, "data/cms/catalog-snapshot.json"), `${JSON.stringify(catalog, null, 2)}\n`);
console.log(
  "snapshot ok",
  catalog.products.length,
  catalog.doctors.length,
  catalog.brands.map((b) => `${b.slug}:${b.productCount}`).join(", "),
);
