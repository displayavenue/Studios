import { longitudeToSign, wholeSignHouse } from "./placements";
import type { PlanetKey } from "./ephemeris";

export type DoshaReport = {
  manglik: {
    present: boolean;
    houses: number[];
    note: string;
    cancellations: string[];
  };
  kaalSarp: {
    present: boolean;
    note: string;
  };
  sadeSati: {
    active: boolean;
    phase: "none" | "rising" | "peak" | "setting";
    note: string;
  };
};

/**
 * Manglik (Kuja Dosha): Mars in 1,2,4,7,8,12 from Lagna (common North-Indian checklist).
 * Also often checked from Moon — we report Lagna-based primary + Moon-based flag in note.
 * Cancellation examples included when classical reliefs apply (simplified, documented).
 */
export function analyzeManglik(
  lagnaSignIndex: number,
  marsLon: number,
  moonLon: number,
  saturnLon?: number,
  jupiterLon?: number,
): DoshaReport["manglik"] {
  const marsSign = longitudeToSign(marsLon).signIndex;
  const house = wholeSignHouse(lagnaSignIndex, marsSign);
  const mangalHouses = [1, 2, 4, 7, 8, 12];
  const present = mangalHouses.includes(house);
  const cancellations: string[] = [];

  if (present && jupiterLon != null) {
    const jHouse = wholeSignHouse(lagnaSignIndex, longitudeToSign(jupiterLon).signIndex);
    if ([1, 4, 7, 10].includes(jHouse)) {
      cancellations.push("Jupiter in a kendra — often cited as a Manglik mitigator in classical discussions.");
    }
  }
  if (present && saturnLon != null) {
    const sHouse = wholeSignHouse(lagnaSignIndex, longitudeToSign(saturnLon).signIndex);
    if (sHouse === house) {
      cancellations.push("Saturn with Mars — some schools discuss partial cancellation.");
    }
  }

  const moonHouse = wholeSignHouse(longitudeToSign(moonLon).signIndex, marsSign);

  return {
    present,
    houses: present ? [house] : [],
    note: present
      ? `Mars occupies house ${house} from Lagna (checked houses 1/2/4/7/8/12). From Moon, Mars is in house ${moonHouse}. This is an informational classical flag — not a marriage verdict.`
      : `Mars is in house ${house} from Lagna; not in the common Manglik house set from Lagna. From Moon, Mars is in house ${moonHouse}.`,
    cancellations,
  };
}

/** Kaal Sarp: all planets between Rahu–Ketu axis (simplified classical pattern check). */
export function analyzeKaalSarp(
  planets: Partial<Record<PlanetKey, number>>,
): DoshaReport["kaalSarp"] {
  const rahu = planets.Rahu;
  const ketu = planets.Ketu;
  if (rahu == null || ketu == null) {
    return { present: false, note: "Nodes unavailable." };
  }
  const others: number[] = [];
  for (const [k, v] of Object.entries(planets)) {
    if (k === "Rahu" || k === "Ketu" || v == null) continue;
    others.push(v);
  }
  // Normalize: treat arc from Rahu to Ketu (180°) as the "axis half"
  const allInOneArc = others.every((lon) => {
    const d = (lon - rahu + 360) % 360;
    return d <= 180;
  }) || others.every((lon) => {
    const d = (lon - rahu + 360) % 360;
    return d >= 180;
  });
  // True Kaal Sarp typically requires all seven in one semicircle between nodes
  const present = allInOneArc;
  return {
    present,
    note: present
      ? "Planets lie on one side of the Rahu–Ketu axis (simplified Kaal Sarp pattern). Interpret calmly; schools differ on severity."
      : "Planets are distributed across both sides of the Rahu–Ketu axis — classical full Kaal Sarp pattern not indicated.",
  };
}

/**
 * Sade Sati: Saturn transit through 12th, 1st, 2nd houses from natal Moon sign.
 * Uses Saturn's current sidereal longitude (pass "now" saturn).
 */
export function analyzeSadeSati(
  natalMoonLon: number,
  saturnNowLon: number,
): DoshaReport["sadeSati"] {
  const moonSign = longitudeToSign(natalMoonLon).signIndex;
  const satSign = longitudeToSign(saturnNowLon).signIndex;
  const rel = (satSign - moonSign + 12) % 12; // 0 = moon sign
  if (rel === 11) {
    return {
      active: true,
      phase: "rising",
      note: "Saturn is in the 12th from natal Moon — rising Sade Sati phase (symbolic).",
    };
  }
  if (rel === 0) {
    return {
      active: true,
      phase: "peak",
      note: "Saturn is on the natal Moon sign — peak Sade Sati phase (symbolic).",
    };
  }
  if (rel === 1) {
    return {
      active: true,
      phase: "setting",
      note: "Saturn is in the 2nd from natal Moon — setting Sade Sati phase (symbolic).",
    };
  }
  return {
    active: false,
    phase: "none",
    note: "Saturn is not in 12th/1st/2nd from natal Moon — Sade Sati not active by the common definition.",
  };
}
