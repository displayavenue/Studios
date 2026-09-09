import { NextRequest, NextResponse } from "next/server";
import { getPublicExpertBySlug } from "@/services/experts/service";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const expert = await getPublicExpertBySlug(slug);
  if (!expert) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ expert });
}
