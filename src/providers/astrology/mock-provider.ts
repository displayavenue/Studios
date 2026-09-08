import type { AstrologyProvider, BirthInput, ChartData } from "./types";

const MOCK_DISCLAIMER =
  "This is mock interpretive chart data for development and entertainment. Planetary positions are not real ephemeris calculations.";

const MOCK_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const PLANET_NAMES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"] as const;

function hashSeed(input: BirthInput): number {
  const s = `${input.name}|${input.dob}|${input.birthTime || "unknown"}|${input.placeName}`;
  return s.split("").reduce((a, c) => a + c.charCodeAt(0) * 17, 0);
}

function chapterBody(title: string, chart: ChartData, personHint: string): string {
  const clean = title.replace(/^\d+\.\s*/, "");
  return (
    `${clean}. For ${personHint}, this chapter explores symbolic themes linked to ${chart.ascendant || "your"} rising colour, ` +
    `Moon in ${chart.moonSign || "your moon sign"}, and Sun in ${chart.sunSign || "your sun sign"}. ` +
    `Use these notes as journaling prompts — not fixed predictions.`
  );
}

export class MockAstrologyProvider implements AstrologyProvider {
  async calculateChart(input: BirthInput): Promise<ChartData> {
    const seed = hashSeed(input);
    const asc = MOCK_SIGNS[seed % 12];
    const moon = MOCK_SIGNS[(seed + 3) % 12];
    const sun = MOCK_SIGNS[(seed + 7) % 12];

    const planets: ChartData["planets"] = {};
    PLANET_NAMES.forEach((name, i) => {
      planets![name] = {
        sign: MOCK_SIGNS[(seed + i * 2) % 12],
        house: ((seed + i * 3) % 12) + 1,
        note: "Mock placement for interpretive demo.",
      };
    });

    const houses: Record<string, string> = {};
    for (let h = 1; h <= 12; h++) {
      houses[String(h)] = MOCK_SIGNS[(seed + h - 1) % 12];
    }

    return {
      mock: true,
      disclaimer: MOCK_DISCLAIMER,
      ascendant: asc,
      moonSign: moon,
      sunSign: sun,
      houses,
      planets,
    };
  }

  async interpretChart(chart: ChartData, templateKey: string, chapterTitles: string[] = []) {
    const titles =
      chapterTitles.length > 0
        ? chapterTitles
        : ["Chart overview", "Temperament", "Emotional rhythm", "Reflection prompts"];

    return {
      sections: {
        overview: `Mock ${templateKey} reading — ${chart.ascendant} rising, Moon ${chart.moonSign}.`,
        personality: `Moon in ${chart.moonSign}; rising ${chart.ascendant}.`,
        guidance: "Mock guidance for development only.",
      },
      chapters: titles.map((title) => ({
        title: title.replace(/^\d+\.\s*/, ""),
        body: chapterBody(title, chart, "this chart"),
      })),
    };
  }
}

export function createMockAstrologyProvider(): AstrologyProvider {
  return new MockAstrologyProvider();
}
