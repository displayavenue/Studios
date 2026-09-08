import { NextRequest, NextResponse } from "next/server";
import { createAstrologyProvider } from "@/providers/astrology/vedic-provider";
import { resolvePlace } from "@/lib/vedic/geo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const dob = String(body.dob || "").trim();
    const placeName = String(body.placeName || "").trim();
    if (!name || !dob || !placeName) {
      return NextResponse.json({ error: "NAME_DOB_PLACE_REQUIRED" }, { status: 400 });
    }
    const place = resolvePlace(placeName);
    const astrology = createAstrologyProvider();
    const chart = await astrology.calculateChart({
      name,
      dob,
      birthTime: body.birthTime ? String(body.birthTime) : undefined,
      birthTimeUnknown: Boolean(body.birthTimeUnknown) || !body.birthTime,
      placeName,
      lat: place.lat,
      lng: place.lng,
      timezone: place.timezone,
    });
    return NextResponse.json({ chart, placeApprox: place.approx });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "KUNDLI_FAILED" },
      { status: 400 },
    );
  }
}
