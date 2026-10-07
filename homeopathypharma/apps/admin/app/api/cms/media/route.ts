import { NextResponse } from "next/server";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  deleteMedia,
  listMedia,
  registerMedia,
  resolveMediaUploadDir,
} from "@homeopathypharma/content-store";
import { requireAdminSession } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  return NextResponse.json({ items: listMedia() });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    const alt = String(form.get("alt") || "");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
    const filename = `${Date.now().toString(36)}-${safeName}`;
    const dir = resolveMediaUploadDir();
    writeFileSync(join(dir, filename), bytes);
    const item = registerMedia({
      url: `/images/uploads/${filename}`,
      alt: alt || file.name,
      filename,
      mimeType: file.type || "application/octet-stream",
    });
    return NextResponse.json(item, { status: 201 });
  }

  const body = (await request.json()) as { url?: string; alt?: string; filename?: string; mimeType?: string };
  if (!body.url) return NextResponse.json({ error: "url required" }, { status: 400 });
  const item = registerMedia({
    url: body.url,
    alt: body.alt || "",
    filename: body.filename || body.url.split("/").pop() || "asset",
    mimeType: body.mimeType || "image/*",
  });
  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as { id?: string };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const ok = deleteMedia(body.id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
