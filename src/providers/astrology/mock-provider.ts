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
    `In traditional storytelling, these placements colour how you begin new chapters, how you restore emotionally, and where vitality shows up in daily life.\n\n` +
    `Reflection prompts: Which part of this theme already feels true in your experience? Where do you want more patience with yourself? ` +
    `If you are sharing this PDF with family, use it as vocabulary for a calm conversation rather than as a verdict.\n\n` +
    `Remember: JyotishKundali chapters are interpretive entertainment. Keep medical, legal, financial, and relationship decisions with qualified professionals and your own judgment.`
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
        : [
            "Chart overview & how to read this report",
            "Temperament & rising themes",
            "Emotional rhythm",
            "Practical reflection prompts",
          ];

    const personHint = "this chart";
    const chapters = titles.map((title) => ({
      title: title.replace(/^\d+\.\s*/, ""),
      body: chapterBody(title, chart, personHint),
    }));

    return {
      sections: {
        overview: `This ${templateKey.replace(/-/g, " ")} reading is framed around ${chart.ascendant} rising, Moon in ${chart.moonSign}, and Sun in ${chart.sunSign}. It organises life themes into clear chapters so you can revisit what matters without treating astrology as certainty.`,
        personality: `With Moon in ${chart.moonSign} and rising themes of ${chart.ascendant}, the personality colour of this chart emphasises how you meet the world and what restores you. Notice patterns; do not force a label.`,
        guidance:
          "Treat every chapter as reflective entertainment. Pair insights with your lived experience, professional advice where needed, and kindness toward yourself and others.",
      },
      chapters,
    };
  }
}

export function createAstrologyProvider(): AstrologyProvider {
  return new MockAstrologyProvider();
}
