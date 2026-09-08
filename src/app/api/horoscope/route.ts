import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAstrologyProvider } from "@/providers/astrology/vedic-provider";
import { resolvePlace } from "@/lib/vedic/geo";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const profile = await prisma.birthProfile.findFirst({
    where: { userId: session.id },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });

  if (!profile) {
    return NextResponse.json({
      ok: false,
      needsProfile: true,
      message: "Add birth details to unlock personalized horoscope guidance.",
    });
  }

  const place = resolvePlace(
    profile.placeName,
    profile.lat != null ? Number(profile.lat) : null,
    profile.lng != null ? Number(profile.lng) : null,
    profile.timezone,
  );
  const astrology = createAstrologyProvider();
  const chart = await astrology.calculateChart({
    name: profile.name,
    dob: profile.dob.toISOString().slice(0, 10),
    placeName: profile.placeName,
    birthTime: profile.birthTime ?? undefined,
    birthTimeUnknown: profile.birthTimeUnknown,
    lat: place.lat,
    lng: place.lng,
    timezone: place.timezone,
  });
  const interpretation = await astrology.interpretChart(chart, "daily-horoscope");
  const sign = chart.moonSign || chart.sunSign || "General";

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const row = await prisma.dailyHoroscope.upsert({
    where: {
      sign_date_language: {
        sign,
        date: today,
        language: "en",
      },
    },
    create: {
      userId: session.id,
      birthProfileId: profile.id,
      sign,
      date: today,
      language: "en",
      content: {
        overview: interpretation.sections.overview,
        guidance: interpretation.sections.guidance,
        moonSign: chart.moonSign,
        mock: chart.mock,
        disclaimer: chart.disclaimer,
      },
    },
    update: {
      userId: session.id,
      birthProfileId: profile.id,
      content: {
        overview: interpretation.sections.overview,
        guidance: interpretation.sections.guidance,
        moonSign: chart.moonSign,
        mock: chart.mock,
        disclaimer: chart.disclaimer,
      },
    },
  });

  return NextResponse.json({ ok: true, profile: { name: profile.name }, horoscope: row });
}
