import { NextRequest, NextResponse } from "next/server";
import { ashtakoota } from "@/lib/vedic/ashtakoota";
import { calculateVedicChart } from "@/lib/vedic/chart";
import { resolvePlace } from "@/lib/vedic/geo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tool = String(body.tool || "match");

    if (tool === "match") {
      const aPlace = resolvePlace(String(body.a?.placeName || "Mumbai"));
      const bPlace = resolvePlace(String(body.b?.placeName || "Delhi"));
      const a = calculateVedicChart({
        name: String(body.a?.name || "A"),
        dob: String(body.a?.dob),
        birthTime: body.a?.birthTime || undefined,
        birthTimeUnknown: !body.a?.birthTime,
        placeName: String(body.a?.placeName || "Mumbai"),
        lat: aPlace.lat,
        lng: aPlace.lng,
        timezone: aPlace.timezone,
      });
      const b = calculateVedicChart({
        name: String(body.b?.name || "B"),
        dob: String(body.b?.dob),
        birthTime: body.b?.birthTime || undefined,
        birthTimeUnknown: !body.b?.birthTime,
        placeName: String(body.b?.placeName || "Delhi"),
        lat: bPlace.lat,
        lng: bPlace.lng,
        timezone: bPlace.timezone,
      });
      const match = ashtakoota(a.moon.longitude, b.moon.longitude);
      return NextResponse.json({
        tool: "match",
        a: { moon: a.moon, lagna: a.lagna.sign },
        b: { moon: b.moon, lagna: b.lagna.sign },
        match,
      });
    }

    if (tool === "moon-sign") {
      const place = resolvePlace(String(body.placeName || "Mumbai"));
      const chart = calculateVedicChart({
        name: String(body.name || "Seeker"),
        dob: String(body.dob),
        birthTime: body.birthTime || undefined,
        birthTimeUnknown: !body.birthTime,
        placeName: String(body.placeName || "Mumbai"),
        lat: place.lat,
        lng: place.lng,
        timezone: place.timezone,
      });
      return NextResponse.json({
        tool: "moon-sign",
        moon: chart.moon,
        sun: chart.sun,
        lagna: chart.lagna,
      });
    }

    return NextResponse.json({ error: "UNKNOWN_TOOL" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "CALC_FAILED" },
      { status: 400 },
    );
  }
}
