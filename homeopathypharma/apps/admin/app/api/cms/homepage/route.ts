import { NextResponse } from "next/server";
import { getHomepage, saveHomepage, type HomepageContent } from "@homeopathypharma/content-store";
import { requireAdminSession } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  return NextResponse.json(getHomepage());
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const body = (await request.json()) as HomepageContent;
  return NextResponse.json(saveHomepage(body));
}
