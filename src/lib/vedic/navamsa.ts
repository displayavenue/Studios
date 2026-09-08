import { longitudeToSign, longitudeToNakshatra, wholeSignHouse } from "./placements";
import { norm360 } from "./math";
import type { PlanetKey } from "./ephemeris";
import { formatDms } from "./math";

/**
 * Navamsa (D9): each sign divided into 9 parts of 3°20'.
 * Classical mapping: movable signs start from same sign; fixed from 9th; dual from 5th.
 */
export function siderealToNavamsa(lon: number): number {
  const L = norm360(lon);
  const signIndex = Math.floor(L / 30);
  const degInSign = L % 30;
  const pada = Math.min(8, Math.floor(degInSign / (30 / 9))); // 0..8
  const movable = signIndex % 3 === 0;
  const fixed = signIndex % 3 === 1;
  let start: number;
  if (movable) start = signIndex;
  else if (fixed) start = (signIndex + 8) % 12;
  else start = (signIndex + 4) % 12;
  const navSign = (start + pada) % 12;
  const navDegInSign = (degInSign % (30 / 9)) * 9;
  return navSign * 30 + navDegInSign;
}

export type NavamsaPlacement = {
  name: string;
  rasiSign: string;
  navamsaSign: string;
  navamsaFormatted: string;
  navamsaNakshatra: string;
  houseFromNavLagna: number;
};

export function buildNavamsaTable(
  lagnaLon: number,
  planets: Array<{ name: PlanetKey; longitude: number }>,
): { navLagnaSign: string; placements: NavamsaPlacement[] } {
  const navLagnaLon = siderealToNavamsa(lagnaLon);
  const navLagna = longitudeToSign(navLagnaLon);
  const placements: NavamsaPlacement[] = planets.map((p) => {
    const rasi = longitudeToSign(p.longitude);
    const navLon = siderealToNavamsa(p.longitude);
    const nav = longitudeToSign(navLon);
    const nak = longitudeToNakshatra(navLon);
    return {
      name: p.name,
      rasiSign: rasi.sign,
      navamsaSign: nav.sign,
      navamsaFormatted: `${formatDms(nav.degreeInSign)} ${nav.sign}`,
      navamsaNakshatra: nak.name,
      houseFromNavLagna: wholeSignHouse(navLagna.signIndex, nav.signIndex),
    };
  });
  return { navLagnaSign: navLagna.sign, placements };
}
