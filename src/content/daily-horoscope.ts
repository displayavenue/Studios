/** Sample daily rashi blurbs — labeled entertainment content, not personalized predictions. */
export const ZODIAC_SIGNS = [
  { key: "aries", name: "Aries", hindi: "Mesh", range: "Mar 21 – Apr 19" },
  { key: "taurus", name: "Taurus", hindi: "Vrishabh", range: "Apr 20 – May 20" },
  { key: "gemini", name: "Gemini", hindi: "Mithun", range: "May 21 – Jun 20" },
  { key: "cancer", name: "Cancer", hindi: "Kark", range: "Jun 21 – Jul 22" },
  { key: "leo", name: "Leo", hindi: "Singh", range: "Jul 23 – Aug 22" },
  { key: "virgo", name: "Virgo", hindi: "Kanya", range: "Aug 23 – Sep 22" },
  { key: "libra", name: "Libra", hindi: "Tula", range: "Sep 23 – Oct 22" },
  { key: "scorpio", name: "Scorpio", hindi: "Vrishchik", range: "Oct 23 – Nov 21" },
  { key: "sagittarius", name: "Sagittarius", hindi: "Dhanu", range: "Nov 22 – Dec 21" },
  { key: "capricorn", name: "Capricorn", hindi: "Makar", range: "Dec 22 – Jan 19" },
  { key: "aquarius", name: "Aquarius", hindi: "Kumbh", range: "Jan 20 – Feb 18" },
  { key: "pisces", name: "Pisces", hindi: "Meen", range: "Feb 19 – Mar 20" },
] as const;

export type ZodiacKey = (typeof ZODIAC_SIGNS)[number]["key"];

const BLURBS: Record<ZodiacKey, string> = {
  aries:
    "Sample reading: pause before reacting, rebuild one healthy habit, and keep love expectations realistic. Entertainment only.",
  taurus:
    "Sample reading: steady progress in work beats rushing; money themes favor patience. Entertainment only.",
  gemini:
    "Sample reading: conversations open doors — clarify one message before sending. Entertainment only.",
  cancer:
    "Sample reading: home and mood need softness today; career waits for emotional clarity. Entertainment only.",
  leo:
    "Sample reading: lead with warmth, not pressure; creative pride helps, ego friction does not. Entertainment only.",
  virgo:
    "Sample reading: tidy one system — inbox, budget, or desk — then decide. Entertainment only.",
  libra:
    "Sample reading: partnership balance matters more than winning an argument. Entertainment only.",
  scorpio:
    "Sample reading: depth over drama; one honest talk beats three assumptions. Entertainment only.",
  sagittarius:
    "Sample reading: expand carefully — travel or learning themes, not reckless spend. Entertainment only.",
  capricorn:
    "Sample reading: structure your day; long goals reward small consistent steps. Entertainment only.",
  aquarius:
    "Sample reading: community ideas spark, but finish one commitment first. Entertainment only.",
  pisces:
    "Sample reading: intuition is loud — write it down, then verify with facts. Entertainment only.",
};

export function getDailyHoroscope(sign: ZodiacKey) {
  const meta = ZODIAC_SIGNS.find((z) => z.key === sign)!;
  return {
    ...meta,
    body: BLURBS[sign],
    pillars: {
      love: "Steady",
      career: "Strong",
      health: "Good",
      money: "Careful",
    },
    disclaimer:
      "Generic rashi sample text for UI — not a calculated transit forecast for your birth chart.",
  };
}
