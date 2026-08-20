import { NextResponse } from "next/server";
import { listCatalogProducts, updateCatalogProduct } from "@homeopathypharma/content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ items: listCatalogProducts() });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { id?: string; patch?: Record<string, unknown> };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const updated = updateCatalogProduct(body.id, body.patch ?? {});
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
