import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { applyAsExpert } from "@/services/experts/service";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();
  const displayName = String(body.displayName || "").trim();
  const specialties = Array.isArray(body.specialties)
    ? body.specialties.map(String).filter(Boolean)
    : String(body.specialties || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
  const languages = Array.isArray(body.languages)
    ? body.languages.map(String).filter(Boolean)
    : String(body.languages || "English, Hindi")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
  const categories = Array.isArray(body.categories)
    ? body.categories.map(String).filter(Boolean)
    : ["vedic"];

  if (!displayName || specialties.length === 0) {
    return NextResponse.json({ error: "INVALID_INPUT", message: "Name and specialties required." }, { status: 400 });
  }

  try {
    const expert = await applyAsExpert({
      userId: session.id,
      displayName,
      bio: body.bio ? String(body.bio) : undefined,
      specialties,
      languages,
      categories,
      experienceYrs: body.experienceYrs ? Number(body.experienceYrs) : 1,
      pricePerMinInr: body.pricePerMinInr ? Number(body.pricePerMinInr) : 29,
    });
    return NextResponse.json({
      ok: true,
      expert,
      message: "Application received. An admin must verify before you appear as live online.",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "APPLY_FAILED";
    const status = msg === "ALREADY_APPLIED" ? 409 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
