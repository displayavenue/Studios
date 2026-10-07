import { NextResponse } from "next/server";
import {
  createCatalogProduct,
  deleteCatalogProduct,
  listCatalogProducts,
  updateCatalogProduct,
} from "@homeopathypharma/content-store";
import { requireAdminSession } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").toLowerCase().trim();
  const includeUnlisted = url.searchParams.get("all") === "1";
  let items = listCatalogProducts(includeUnlisted);
  if (q) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q),
    );
  }
  const limit = Math.min(Number(url.searchParams.get("limit") || 100), 500);
  const offset = Math.max(Number(url.searchParams.get("offset") || 0), 0);
  return NextResponse.json({
    total: items.length,
    items: items.slice(offset, offset + limit),
  });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as {
    name?: string;
    brandSlug?: string;
    brandName?: string;
    form?: string;
    potency?: string;
    packSize?: string;
    priceInr?: number;
    mrpInr?: number;
    category?: string;
    description?: string;
    imageUrl?: string;
    slug?: string;
  };
  if (!body.name || !body.brandSlug || typeof body.priceInr !== "number") {
    return NextResponse.json({ error: "name, brandSlug, and priceInr are required" }, { status: 400 });
  }
  try {
    const created = createCatalogProduct({
      name: body.name,
      brandSlug: body.brandSlug,
      brandName: body.brandName,
      form: body.form,
      potency: body.potency,
      packSize: body.packSize,
      priceInr: body.priceInr,
      mrpInr: body.mrpInr,
      category: body.category,
      description: body.description,
      imageUrl: body.imageUrl,
      slug: body.slug,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "create failed" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as { id?: string; patch?: Record<string, unknown> };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const updated = updateCatalogProduct(body.id, body.patch ?? {});
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as { id?: string };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  deleteCatalogProduct(body.id);
  return NextResponse.json({ ok: true });
}
