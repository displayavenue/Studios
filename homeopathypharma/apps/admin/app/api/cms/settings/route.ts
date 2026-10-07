import { NextResponse } from "next/server";
import { getSettings, saveSettings, type CmsSettings } from "@homeopathypharma/content-store";
import { requireAdminSession } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  return NextResponse.json(getSettings());
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as CmsSettings;
  return NextResponse.json(saveSettings(body));
}
