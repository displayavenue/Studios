/** Classical Vedic astrology constants (Parashari / Lahiri convention). */

export const SIGNS = [
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
] as const;

export type SignName = (typeof SIGNS)[number];

export const SIGN_LORDS: Record<SignName, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

/** 27 Nakshatras, each 13°20' (800'), starting at 0° sidereal Aries. */
export const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras" },
  { name: "Bharani", lord: "Venus", deity: "Yama" },
  { name: "Krittika", lord: "Sun", deity: "Agni" },
  { name: "Rohini", lord: "Moon", deity: "Brahma" },
  { name: "Mrigashira", lord: "Mars", deity: "Soma" },
  { name: "Ardra", lord: "Rahu", deity: "Rudra" },
  { name: "Punarvasu", lord: "Jupiter", deity: "Aditi" },
  { name: "Pushya", lord: "Saturn", deity: "Brihaspati" },
  { name: "Ashlesha", lord: "Mercury", deity: "Nagas" },
  { name: "Magha", lord: "Ketu", deity: "Pitris" },
  { name: "Purva Phalguni", lord: "Venus", deity: "Bhaga" },
  { name: "Uttara Phalguni", lord: "Sun", deity: "Aryaman" },
  { name: "Hasta", lord: "Moon", deity: "Savitar" },
  { name: "Chitra", lord: "Mars", deity: "Tvashtar" },
  { name: "Swati", lord: "Rahu", deity: "Vayu" },
  { name: "Vishakha", lord: "Jupiter", deity: "Indra-Agni" },
  { name: "Anuradha", lord: "Saturn", deity: "Mitra" },
  { name: "Jyeshtha", lord: "Mercury", deity: "Indra" },
  { name: "Mula", lord: "Ketu", deity: "Nirriti" },
  { name: "Purva Ashadha", lord: "Venus", deity: "Apas" },
  { name: "Uttara Ashadha", lord: "Sun", deity: "Vishvedevas" },
  { name: "Shravana", lord: "Moon", deity: "Vishnu" },
  { name: "Dhanishta", lord: "Mars", deity: "Vasus" },
  { name: "Shatabhisha", lord: "Rahu", deity: "Varuna" },
  { name: "Purva Bhadrapada", lord: "Jupiter", deity: "Aja Ekapada" },
  { name: "Uttara Bhadrapada", lord: "Saturn", deity: "Ahir Budhnya" },
  { name: "Revati", lord: "Mercury", deity: "Pushan" },
] as const;

/** Vimshottari Mahadasha lengths in years (sum = 120). */
export const VIMSHOTTARI_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

export const VIMSHOTTARI_ORDER = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
] as const;

export const NAKSHATRA_SPAN = 360 / 27; // 13°20'
export const PADA_SPAN = NAKSHATRA_SPAN / 4;

/** Ashtakoota max points. */
export const ASHTAKOOT_MAX = 36;

export const ENGINE_META = {
  ayanamsa: "Lahiri (Chitrapaksha)",
  houseSystem: "Whole sign (from Lagna)",
  nodeType: "Mean lunar nodes (Rahu/Ketu)",
  zodiac: "Sidereal",
  authorityNotes:
    "Positions from astronomy-engine geocentric ecliptic longitudes; Lahiri ayanamsa; classical Parashari mapping for nakshatra, Vimshottari, Ashtakoota, and common Manglik/Sade Sati checks. Interpretive text remains reflective, not predictive certainty.",
} as const;
