import { computeSiderealLongitudes } from "./ephemeris";
import { longitudeToNakshatra, longitudeToSign } from "./placements";
import { norm360 } from "./math";

const TITHIS = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima / Amavasya",
];

const YOGAS = [
  "Vishkambha",
  "Priti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shoola",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyan",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
];

const KARANAS = [
  "Bava",
  "Balava",
  "Kaulava",
  "Taitila",
  "Garija",
  "Vanija",
  "Vishti",
  "Shakuni",
  "Chatushpada",
  "Nagava",
  "Kimstughna",
];

const VARA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Approximate Hindu day elements from sidereal Sun/Moon for a civil date (IST noon). */
export function computePanchang(dateIso: string, timezone = "Asia/Kolkata") {
  // Use local noon IST for a stable daily snapshot
  const [y, m, d] = dateIso.split("-").map(Number);
  const utcMs = Date.UTC(y, m - 1, d, 12, 0) - 5.5 * 3600 * 1000;
  const date = new Date(utcMs);
  const sid = computeSiderealLongitudes(date);
  const sun = sid.Sun;
  const moon = sid.Moon;
  const elongation = norm360(moon - sun);

  const tithiIndex = Math.min(14, Math.floor(elongation / 12));
  const paksha = elongation < 180 ? "Shukla" : "Krishna";
  const tithiName =
    tithiIndex === 14
      ? paksha === "Shukla"
        ? "Purnima"
        : "Amavasya"
      : TITHIS[tithiIndex];

  const nak = longitudeToNakshatra(moon);
  const sunSign = longitudeToSign(sun);
  const moonSign = longitudeToSign(moon);

  const yogaAngle = norm360(sun + moon);
  const yogaIndex = Math.min(26, Math.floor(yogaAngle / (360 / 27)));

  // Karana: each half-tithi (6°)
  const karanaHalf = Math.floor(elongation / 6) % 60;
  let karanaName: string;
  if (karanaHalf === 0) karanaName = "Kimstughna";
  else if (karanaHalf >= 57) karanaName = KARANAS[7 + (karanaHalf - 57)];
  else karanaName = KARANAS[(karanaHalf - 1) % 7];

  const weekday = VARA[date.getUTCDay()];

  return {
    date: dateIso,
    timezone,
    weekday,
    paksha,
    tithi: { index: tithiIndex + 1, name: tithiName, elongationDeg: Number(elongation.toFixed(4)) },
    nakshatra: { name: nak.name, pada: nak.pada, lord: nak.lord },
    yoga: { index: yogaIndex + 1, name: YOGAS[yogaIndex] },
    karana: { name: karanaName },
    rashi: { sun: sunSign.sign, moon: moonSign.sign },
    disclaimer:
      "Approximate Lahiri-based panchang snapshot at IST noon. Festival muhurat and regional calendars may differ — verify with a local panchang for ritual timing.",
  };
}
