import {
  calculateVedicChart,
  interpretVedicChart,
  type VedicChart,
} from "@/lib/vedic";
import type { AstrologyProvider, BirthInput, ChartData } from "./types";
import { MockAstrologyProvider } from "./mock-provider";

/** Default India centroid-ish fallback when lat/lng missing (Mumbai). */
const FALLBACK = { lat: 19.076, lng: 72.8777 };

function toChartData(vedic: VedicChart): ChartData {
  const planets: ChartData["planets"] = {};
  for (const p of vedic.planets) {
    planets[p.name] = {
      sign: p.sign,
      house: p.house,
      note: `${p.formatted}; ${p.nakshatra} pada ${p.pada}`,
      longitude: p.longitude,
      formatted: p.formatted,
      nakshatra: p.nakshatra,
      pada: p.pada,
    };
  }
  return {
    mock: false,
    disclaimer: vedic.disclaimer,
    ascendant: vedic.lagna.sign,
    moonSign: vedic.moon.sign,
    sunSign: vedic.sun.sign,
    houses: vedic.houses,
    planets,
    vedic: JSON.parse(JSON.stringify(vedic)) as Record<string, unknown>,
  };
}

export class VedicAstrologyProvider implements AstrologyProvider {
  async calculateChart(input: BirthInput): Promise<ChartData> {
    const vedic = calculateVedicChart({
      name: input.name,
      dob: input.dob,
      birthTime: input.birthTime,
      birthTimeUnknown: input.birthTimeUnknown,
      placeName: input.placeName,
      lat: input.lat ?? FALLBACK.lat,
      lng: input.lng ?? FALLBACK.lng,
      timezone: input.timezone || "Asia/Kolkata",
    });
    return toChartData(vedic);
  }

  async interpretChart(chart: ChartData, templateKey: string, chapterTitles: string[] = []) {
    const vedic = chart.vedic as unknown as VedicChart | undefined;
    if (!vedic) {
      return {
        sections: {
          overview: chart.disclaimer,
          personality: `Ascendant ${chart.ascendant}, Moon ${chart.moonSign}.`,
          guidance: "Interpretive guidance only.",
        },
        chapters: chapterTitles.map((title) => ({
          title: title.replace(/^\d+\.\s*/, ""),
          body: chart.disclaimer,
        })),
      };
    }
    return interpretVedicChart(vedic, templateKey, chapterTitles, undefined);
  }
}

export function createAstrologyProvider(): AstrologyProvider {
  if (process.env.USE_MOCK_ASTROLOGY === "true") {
    return new MockAstrologyProvider();
  }
  return new VedicAstrologyProvider();
}

export { MockAstrologyProvider };
