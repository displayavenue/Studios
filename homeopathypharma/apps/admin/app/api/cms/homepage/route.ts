import { NextResponse } from "next/server";
import { getHomepage, saveHomepage, type HomepageContent } from "@homeopathypharma/content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getHomepage());
}

export async function PUT(request: Request) {
  const body = (await request.json()) as HomepageContent;
  return NextResponse.json(saveHomepage(body));
}
