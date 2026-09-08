import { ayanamsaMeta } from "./ayanamsa";
import { ashtakoota, type AshtakootResult } from "./ashtakoota";
import { ENGINE_META } from "./constants";
import { antardashas, currentMahadasha, vimshottariMahadashas, type DashaPeriod } from "./dasha";
import { analyzeKaalSarp, analyzeManglik, analyzeSadeSati, type DoshaReport } from "./dosha";
import {
  computeSiderealLongitudes,
  tropicalAscendant,
  type PlanetKey,
} from "./ephemeris";
import { tropicalToSidereal } from "./ayanamsa";
import {
  longitudeToNakshatra,
  longitudeToSign,
  wholeSignHouse,
} from "./placements";
import { formatDms } from "./math";

export type VedicBirthInput = {
  name: string;
  dob: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  birthTimeUnknown?: boolean;
  placeName: string;
  lat: number;
  lng: number;
  timezone?: string;
};

export type PlanetPlacement = {
  name: PlanetKey;
  longitude: number;
  sign: string;
  signLord: string;
  degreeInSign: number;
  formatted: string;
  house: number;
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
};

export type VedicChart = {
  mock: false;
  engine: typeof ENGINE_META;
  disclaimer: string;
  birth: {
    name: string;
    utcIso: string;
    localDate: string;
    localTime: string;
    placeName: string;
    lat: number;
    lng: number;
    timeUnknown: boolean;
  };
  ayanamsa: ReturnType<typeof ayanamsaMeta>;
  lagna: PlanetPlacement & { signIndex: number };
  moon: PlanetPlacement;
  sun: PlanetPlacement;
  planets: PlanetPlacement[];
  houses: Record<string, string>; // house -> sign
  dasha: {
    mahadashas: DashaPeriod[];
    current: DashaPeriod | null;
    antardashas: DashaPeriod[];
  };
  dosha: DoshaReport;
};

const DISCLAIMER =
  "Planetary longitudes are computed astronomically (geocentric ecliptic), converted to the Lahiri sidereal zodiac, with whole-sign houses from Lagna. Classical Ashtakoota, Vimshottari, Manglik, and Sade Sati rules are applied as documented algorithms. Interpretive narrative is for personal reflection and entertainment — not medical, legal, financial, or marriage certainty.";

function parseBirthUtc(input: VedicBirthInput): { date: Date; localTime: string; timeUnknown: boolean } {
  const timeUnknown = Boolean(input.birthTimeUnknown || !input.birthTime);
  const time = timeUnknown ? "12:00" : input.birthTime!;
  // Treat provided civil time as IST (+05:30) when timezone not given — India-first product.
  // Better: use input.timezone offset when available.
  const offsetHours = timezoneOffsetHours(input.timezone || "Asia/Kolkata");
  const [y, m, d] = input.dob.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const utcMs = Date.UTC(y, m - 1, d, hh, mm) - offsetHours * 3600 * 1000;
  return { date: new Date(utcMs), localTime: time, timeUnknown };
}

function timezoneOffsetHours(tz: string): number {
  // Fixed offsets for common India product paths; UTC fallback.
  if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta" || tz === "IST") return 5.5;
  if (tz === "UTC" || tz === "Etc/UTC") return 0;
  // Approximate via formatToParts when available
  try {
    const probe = new Date("2024-01-01T12:00:00Z");
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
      hour: "2-digit",
    }).formatToParts(probe);
    const name = parts.find((p) => p.type === "timeZoneName")?.value || "";
    const m = name.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/);
    if (m) return Number(m[1]) + (m[2] ? Number(m[2]) / 60 : 0);
  } catch {
    /* ignore */
  }
  return 5.5;
}

function placement(
  name: PlanetKey,
  lon: number,
  lagnaSignIndex: number,
): PlanetPlacement {
  const sign = longitudeToSign(lon);
  const nak = longitudeToNakshatra(lon);
  return {
    name,
    longitude: lon,
    sign: sign.sign,
    signLord: sign.lord,
    degreeInSign: sign.degreeInSign,
    formatted: `${formatDms(sign.degreeInSign)} ${sign.sign}`,
    house: wholeSignHouse(lagnaSignIndex, sign.signIndex),
    nakshatra: nak.name,
    nakshatraLord: nak.lord,
    pada: nak.pada,
  };
}

export function calculateVedicChart(input: VedicBirthInput): VedicChart {
  const { date, localTime, timeUnknown } = parseBirthUtc(input);
  const sidereal = computeSiderealLongitudes(date);
  const tropAsc = tropicalAscendant(date, input.lat, input.lng);
  const lagnaLon = tropicalToSidereal(tropAsc, date);
  const lagnaSign = longitudeToSign(lagnaLon);

  const planets: PlanetPlacement[] = (Object.keys(sidereal) as PlanetKey[]).map((name) =>
    placement(name, sidereal[name], lagnaSign.signIndex),
  );

  const houses: Record<string, string> = {};
  for (let h = 1; h <= 12; h++) {
    const idx = (lagnaSign.signIndex + h - 1) % 12;
    houses[String(h)] = longitudeToSign(idx * 30).sign;
  }

  const mahadashas = vimshottariMahadashas(sidereal.Moon, date, 9);
  const current = currentMahadasha(mahadashas, new Date());
  const antars = current ? antardashas(current.lord, current.start, current.years) : [];

  const manglik = analyzeManglik(
    lagnaSign.signIndex,
    sidereal.Mars,
    sidereal.Moon,
    sidereal.Saturn,
    sidereal.Jupiter,
  );
  const kaalSarp = analyzeKaalSarp(sidereal);
  const sadeSati = analyzeSadeSati(sidereal.Moon, computeSiderealLongitudes(new Date()).Saturn);

  const lagnaNak = longitudeToNakshatra(lagnaLon);
  const lagna = {
    name: "Sun" as PlanetKey,
    longitude: lagnaLon,
    sign: lagnaSign.sign,
    signLord: lagnaSign.lord,
    degreeInSign: lagnaSign.degreeInSign,
    formatted: `${formatDms(lagnaSign.degreeInSign)} ${lagnaSign.sign}`,
    house: 1,
    nakshatra: lagnaNak.name,
    nakshatraLord: lagnaNak.lord,
    pada: lagnaNak.pada,
    signIndex: lagnaSign.signIndex,
  };

  return {
    mock: false,
    engine: ENGINE_META,
    disclaimer: DISCLAIMER + (timeUnknown ? " Birth time was unknown — Lagna and time-sensitive flags use noon local time and must be treated as approximate." : ""),
    birth: {
      name: input.name,
      utcIso: date.toISOString(),
      localDate: input.dob,
      localTime,
      placeName: input.placeName,
      lat: input.lat,
      lng: input.lng,
      timeUnknown,
    },
    ayanamsa: ayanamsaMeta(date),
    lagna,
    moon: placement("Moon", sidereal.Moon, lagnaSign.signIndex),
    sun: placement("Sun", sidereal.Sun, lagnaSign.signIndex),
    planets,
    houses,
    dasha: { mahadashas, current, antardashas: antars },
    dosha: { manglik, kaalSarp, sadeSati },
  };
}

export function matchKundali(moonA: number, moonB: number): AshtakootResult {
  return ashtakoota(moonA, moonB);
}
