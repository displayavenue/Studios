import { NextResponse } from "next/server";
import { getMenus, saveMenus, type CmsMenus } from "@homeopathypharma/content-store";
import { requireAdminSession } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  return NextResponse.json(getMenus());
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as CmsMenus;
  return NextResponse.json(saveMenus(body));
}
