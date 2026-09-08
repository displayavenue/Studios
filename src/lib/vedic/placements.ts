import { NAKSHATRAS, NAKSHATRA_SPAN, PADA_SPAN, SIGNS, SIGN_LORDS, type SignName } from "./constants";
import { formatDms, norm360 } from "./math";

export function longitudeToSign(lon: number): {
  sign: SignName;
  signIndex: number;
  degreeInSign: number;
  lord: string;
  formatted: string;
} {
  const L = norm360(lon);
  const signIndex = Math.floor(L / 30);
  const degreeInSign = L % 30;
  const sign = SIGNS[signIndex];
  return {
    sign,
    signIndex,
    degreeInSign,
    lord: SIGN_LORDS[sign],
    formatted: `${formatDms(degreeInSign)} ${sign}`,
  };
}

export function longitudeToNakshatra(lon: number): {
  name: string;
  index: number;
  lord: string;
  deity: string;
  pada: number;
  degreeInNakshatra: number;
} {
  const L = norm360(lon);
  const index = Math.min(26, Math.floor(L / NAKSHATRA_SPAN));
  const meta = NAKSHATRAS[index];
  const degreeInNakshatra = L - index * NAKSHATRA_SPAN;
  const pada = Math.min(4, Math.floor(degreeInNakshatra / PADA_SPAN) + 1);
  return {
    name: meta.name,
    index,
    lord: meta.lord,
    deity: meta.deity,
    pada,
    degreeInNakshatra,
  };
}

/** Whole-sign house number (1–12) from Lagna sign and planet sign. */
export function wholeSignHouse(lagnaSignIndex: number, planetSignIndex: number): number {
  return ((planetSignIndex - lagnaSignIndex + 12) % 12) + 1;
}
