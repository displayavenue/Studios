import { ASHTAKOOT_MAX } from "./constants";
import { longitudeToNakshatra, longitudeToSign } from "./placements";

/** Nakshatra → Yoni animal (classical matching list). */
const YONI: string[] = [
  "Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog", "Cat", "Sheep", "Cat",
  "Rat", "Rat", "Cow", "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer", "Deer",
  "Dog", "Monkey", "Mongoose", "Monkey", "Lion", "Horse", "Lion", "Cow", "Elephant",
];

/** Enemy yoni pairs (score 0); same = 4; friendly = 2/3 simplified to classical 4/2/1/0. */
const YONI_ENEMY: Record<string, string> = {
  Cow: "Tiger",
  Tiger: "Cow",
  Horse: "Buffalo",
  Buffalo: "Horse",
  Cat: "Rat",
  Rat: "Cat",
  Dog: "Deer",
  Deer: "Dog",
  Serpent: "Mongoose",
  Mongoose: "Serpent",
  Monkey: "Sheep",
  Sheep: "Monkey",
  Lion: "Elephant",
  Elephant: "Lion",
};

const GANA: Array<"Deva" | "Manushya" | "Rakshasa"> = [
  "Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya", "Deva", "Deva", "Rakshasa",
  "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Deva", "Rakshasa", "Deva", "Rakshasa",
  "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva",
];

const NADI: Array<"Adi" | "Madhya" | "Antya"> = [
  "Adi", "Madhya", "Antya", "Adi", "Madhya", "Antya", "Adi", "Madhya", "Antya",
  "Adi", "Madhya", "Antya", "Adi", "Madhya", "Antya", "Adi", "Madhya", "Antya",
  "Adi", "Madhya", "Antya", "Adi", "Madhya", "Antya", "Adi", "Madhya", "Antya",
];

const VARNA_OF_SIGN = [2, 2, 3, 4, 1, 3, 1, 4, 2, 3, 4, 1]; // Aries..Pisces → Brahmin=1,Kshatriya=2,Vaishya=3,Shudra=4 ranking used for comparison

const VASHYA: number[][] = [
  // simplified classical vashya matrix by moon sign index (0=Aries)
  // values 0–2
  [2, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 1],
  [1, 2, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0],
  [0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 2, 0, 0, 1, 1, 0, 0, 0, 2],
  [2, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 2, 1, 0, 0, 0, 1],
  [0, 0, 0, 1, 0, 0, 1, 2, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1],
  [0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 2, 0],
  [1, 0, 0, 2, 0, 0, 1, 1, 1, 0, 0, 2],
];

/** Planetary friendship for Graha Maitri (moon-sign lords). */
const FRIENDS: Record<string, string[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
};
const ENEMIES: Record<string, string[]> = {
  Sun: ["Venus", "Saturn"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
};

export type KootScore = { name: string; obtained: number; max: number; note: string };

export type AshtakootResult = {
  total: number;
  max: typeof ASHTAKOOT_MAX;
  percent: number;
  koots: KootScore[];
  boyNakshatra: string;
  girlNakshatra: string;
  boyRashi: string;
  girlRashi: string;
};

function grahaMaitri(lordA: string, lordB: string): number {
  if (lordA === lordB) return 5;
  if (FRIENDS[lordA]?.includes(lordB) && FRIENDS[lordB]?.includes(lordA)) return 5;
  if (FRIENDS[lordA]?.includes(lordB) || FRIENDS[lordB]?.includes(lordA)) return 4;
  if (ENEMIES[lordA]?.includes(lordB) || ENEMIES[lordB]?.includes(lordA)) return 0;
  return 3; // neutral
}

function taraScore(boyIdx: number, girlIdx: number): number {
  const count = ((girlIdx - boyIdx + 27) % 27) + 1;
  const group = ((count - 1) % 9) + 1;
  // Janma/Vipat/Pratyak/Vadha (1,3,5,7) are inauspicious → lower
  if ([3, 5, 7].includes(group)) return 0;
  if (group === 1) return 1.5;
  return 3;
}

function yoniScore(a: string, b: string): number {
  if (a === b) return 4;
  if (YONI_ENEMY[a] === b) return 0;
  return 2;
}

function ganaScore(a: string, b: string): number {
  if (a === b) return 6;
  if ((a === "Deva" && b === "Manushya") || (a === "Manushya" && b === "Deva")) return 6;
  if ((a === "Deva" && b === "Rakshasa") || (a === "Rakshasa" && b === "Deva")) return 0;
  if ((a === "Manushya" && b === "Rakshasa") || (a === "Rakshasa" && b === "Manushya")) return 0;
  return 0;
}

function bhakootScore(boySign: number, girlSign: number): number {
  const diff = ((girlSign - boySign + 12) % 12) + 1;
  // Inauspicious: 2/12, 5/9, 6/8
  if ([2, 5, 6, 8, 9, 12].includes(diff)) return 0;
  return 7;
}

/**
 * Classical Ashtakoota (Guna Milan) from both moons' sidereal longitudes.
 * Boy/Girl labels follow traditional table orientation; for same-gender matches
 * treat first chart as "A" and second as "B".
 */
export function ashtakoota(moonA: number, moonB: number): AshtakootResult {
  const aSign = longitudeToSign(moonA);
  const bSign = longitudeToSign(moonB);
  const aNak = longitudeToNakshatra(moonA);
  const bNak = longitudeToNakshatra(moonB);

  const varna =
    VARNA_OF_SIGN[bSign.signIndex] >= VARNA_OF_SIGN[aSign.signIndex] ? 1 : 0;
  const vashya = VASHYA[aSign.signIndex][bSign.signIndex] ?? 0;
  const tara = taraScore(aNak.index, bNak.index);
  const yoni = yoniScore(YONI[aNak.index], YONI[bNak.index]);
  const grah = grahaMaitri(aSign.lord, bSign.lord);
  const gana = ganaScore(GANA[aNak.index], GANA[bNak.index]);
  const bhakoot = bhakootScore(aSign.signIndex, bSign.signIndex);
  const nadi = NADI[aNak.index] === NADI[bNak.index] ? 0 : 8;

  const koots: KootScore[] = [
    { name: "Varna", obtained: varna, max: 1, note: "Spiritual / ego compatibility class" },
    { name: "Vashya", obtained: vashya, max: 2, note: "Mutual influence / control balance" },
    { name: "Tara", obtained: tara, max: 3, note: "Birth-star distance auspiciousness" },
    { name: "Yoni", obtained: yoni, max: 4, note: "Biological / intimate temperament symbol" },
    { name: "Graha Maitri", obtained: grah, max: 5, note: "Moon-sign lord friendship" },
    { name: "Gana", obtained: gana, max: 6, note: "Temperament class (Deva/Manushya/Rakshasa)" },
    { name: "Bhakoot", obtained: bhakoot, max: 7, note: "Moon-sign pair harmony" },
    { name: "Nadi", obtained: nadi, max: 8, note: "Health/lineage nadi — same nadi scores 0" },
  ];

  const total = koots.reduce((s, k) => s + k.obtained, 0);
  return {
    total,
    max: ASHTAKOOT_MAX,
    percent: Math.round((total / ASHTAKOOT_MAX) * 1000) / 10,
    koots,
    boyNakshatra: aNak.name,
    girlNakshatra: bNak.name,
    boyRashi: aSign.sign,
    girlRashi: bSign.sign,
  };
}
