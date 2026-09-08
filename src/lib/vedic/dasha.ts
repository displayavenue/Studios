import { VIMSHOTTARI_ORDER, VIMSHOTTARI_YEARS, NAKSHATRA_SPAN } from "./constants";
import { longitudeToNakshatra } from "./placements";
import { norm360 } from "./math";

export type DashaPeriod = {
  lord: string;
  start: string; // ISO date
  end: string;
  years: number;
};

function addYears(date: Date, years: number): Date {
  // Vedic year ≈ 365.2425 days for dasha math
  return new Date(date.getTime() + years * 365.2425 * 86400000);
}

/**
 * Vimshottari Mahadasha sequence from Moon's sidereal longitude at birth.
 * Balance of opening dasha = remaining portion of birth nakshatra.
 */
export function vimshottariMahadashas(moonSiderealLon: number, birthDate: Date, count = 9): DashaPeriod[] {
  const nak = longitudeToNakshatra(moonSiderealLon);
  const lord = nak.lord;
  const startIdx = VIMSHOTTARI_ORDER.indexOf(lord as (typeof VIMSHOTTARI_ORDER)[number]);
  if (startIdx < 0) throw new Error(`Unknown dasha lord ${lord}`);

  const traversed = nak.degreeInNakshatra / NAKSHATRA_SPAN;
  const balanceFraction = 1 - traversed;
  const fullYears = VIMSHOTTARI_YEARS[lord];
  const balanceYears = fullYears * balanceFraction;

  const periods: DashaPeriod[] = [];
  let cursor = new Date(birthDate.getTime());
  let years = balanceYears;
  let idx = startIdx;

  for (let i = 0; i < count; i++) {
    const currentLord = VIMSHOTTARI_ORDER[idx % 9];
    const end = addYears(cursor, years);
    periods.push({
      lord: currentLord,
      start: cursor.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
      years: Math.round(years * 1000) / 1000,
    });
    cursor = end;
    idx += 1;
    years = VIMSHOTTARI_YEARS[VIMSHOTTARI_ORDER[idx % 9]];
  }

  return periods;
}

export function currentMahadasha(periods: DashaPeriod[], at = new Date()): DashaPeriod | null {
  const t = at.toISOString().slice(0, 10);
  return periods.find((p) => p.start <= t && t <= p.end) || periods[0] || null;
}

/** Antardasha (sub-periods) inside a Mahadasha — classical proportional formula. */
export function antardashas(mahaLord: string, mahaStartIso: string, mahaYears: number): DashaPeriod[] {
  const startIdx = VIMSHOTTARI_ORDER.indexOf(mahaLord as (typeof VIMSHOTTARI_ORDER)[number]);
  if (startIdx < 0) return [];
  let cursor = new Date(`${mahaStartIso}T12:00:00Z`);
  const out: DashaPeriod[] = [];
  for (let i = 0; i < 9; i++) {
    const sub = VIMSHOTTARI_ORDER[(startIdx + i) % 9];
    const subYears = (mahaYears * VIMSHOTTARI_YEARS[sub]) / 120;
    const end = addYears(cursor, subYears);
    out.push({
      lord: sub,
      start: cursor.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
      years: Math.round(subYears * 1000) / 1000,
    });
    cursor = end;
  }
  return out;
}

void norm360;
