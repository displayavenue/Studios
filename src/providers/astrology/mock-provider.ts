import type { AstrologyProvider, BirthInput, ChartData } from "./types";

const MOCK_DISCLAIMER =
  "This is mock interpretive chart data for development. Planetary positions are not real ephemeris calculations.";

const MOCK_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

function hashSeed(input: BirthInput): number {
  const s = `${input.name}${input.dob}${input.placeName}`;
  return s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

export class MockAstrologyProvider implements AstrologyProvider {
  async calculateChart(input: BirthInput): Promise<ChartData> {
    const seed = hashSeed(input);
    const asc = MOCK_SIGNS[seed % 12];
    const moon = MOCK_SIGNS[(seed + 3) % 12];
    const sun = MOCK_SIGNS[(seed + 7) % 12];

    return {
      mock: true,
      disclaimer: MOCK_DISCLAIMER,
      ascendant: asc,
      moonSign: moon,
      sunSign: sun,
      houses: { "1": asc, "7": MOCK_SIGNS[(seed + 6) % 12] },
      planets: {
        Sun: { sign: sun, house: (seed % 12) + 1, note: "Mock placement for interpretive demo." },
        Moon: { sign: moon, house: ((seed + 2) % 12) + 1, note: "Mock placement for interpretive demo." },
      },
    };
  }

  async interpretChart(chart: ChartData, templateKey: string) {
    return {
      sections: {
        overview: `Interpretive ${templateKey} reading based on ${chart.ascendant} ascendant themes. ${chart.disclaimer}`,
        personality: `With Moon in ${chart.moonSign}, this reading explores emotional patterns for self-reflection.`,
        guidance: "Consider this content as entertainment and personal reflection — not deterministic prediction.",
      },
    };
  }
}

export function createAstrologyProvider(): AstrologyProvider {
  return new MockAstrologyProvider();
}
