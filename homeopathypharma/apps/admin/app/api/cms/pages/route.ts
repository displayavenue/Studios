import { NextResponse } from "next/server";
import { deletePage, getPageBySlug, listPages, upsertPage, type CmsPage } from "@homeopathypharma/content-store";
import { requireAdminSession } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const slug = new URL(request.url).searchParams.get("slug");
  if (slug) {
    const page = getPageBySlug(slug);
    if (!page) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(page);
  }
  return NextResponse.json({ items: listPages() });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as Partial<CmsPage> & { title?: string };
  if (!body.title) return NextResponse.json({ error: "title required" }, { status: 400 });
  return NextResponse.json(upsertPage({ ...body, title: body.title }), { status: 201 });
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as Partial<CmsPage> & { title?: string; id?: string };
  if (!body.title || !body.id) return NextResponse.json({ error: "id and title required" }, { status: 400 });
  return NextResponse.json(upsertPage({ ...body, title: body.title, id: body.id }));
}

export async function DELETE(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as { id?: string };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const ok = deletePage(body.id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
