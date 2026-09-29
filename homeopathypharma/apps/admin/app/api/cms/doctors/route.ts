import { NextResponse } from "next/server";
import { listCatalogDoctors, updateCatalogDoctor } from "@homeopathypharma/content-store";
import { requireAdminSession } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  return NextResponse.json({ items: listCatalogDoctors(true) });
}

export async function PATCH(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as { id?: string; patch?: Record<string, unknown> };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const updated = updateCatalogDoctor(body.id, body.patch ?? {});
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
