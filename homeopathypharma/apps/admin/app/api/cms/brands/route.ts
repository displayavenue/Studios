import { NextResponse } from "next/server";
import {
  createCatalogBrand,
  listCatalogBrands,
  updateCatalogBrand,
} from "@homeopathypharma/content-store";
import { requireAdminSession } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  return NextResponse.json({ items: listCatalogBrands() });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as {
    name?: string;
    manufacturer?: string;
    description?: string;
    imageUrl?: string;
    slug?: string;
  };
  if (!body.name) return NextResponse.json({ error: "name required" }, { status: 400 });
  try {
    const brand = createCatalogBrand({
      name: body.name,
      manufacturer: body.manufacturer,
      description: body.description,
      imageUrl: body.imageUrl,
      slug: body.slug,
    });
    return NextResponse.json(brand, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "create failed" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as {
    slug?: string;
    patch?: { name?: string; manufacturer?: string; description?: string; imageUrl?: string };
  };
  if (!body.slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const updated = updateCatalogBrand(body.slug, body.patch ?? {});
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
