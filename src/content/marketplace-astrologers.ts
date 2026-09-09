/** Demo marketplace experts — clearly sample profiles for UI parity, not live consultants. */
export type MarketplaceAstrologer = {
  slug: string;
  name: string;
  badge: "Celebrity" | "Top Choice" | "Rising Star" | "Verified";
  specialties: string[];
  languages: string[];
  yearsExp: number;
  rating: number;
  /** Display-only sample review count label */
  reviewsLabel: string;
  pricePerMinInr: number;
  online: boolean;
  bio: string;
  categories: Array<"love" | "marriage" | "career" | "women" | "business" | "health" | "vedic" | "tarot" | "numerology">;
  initials: string;
  accent: string;
  /** Circular portrait path under /public (Indian headshot, original asset). */
  photoUrl: string;
};

export function expertPhotoUrl(slug: string, size: "sm" | "lg" = "sm") {
  return size === "lg" ? `/experts/${slug}-lg.jpg` : `/experts/${slug}.jpg`;
}

export const MARKETPLACE_DISCLAIMER =
  "Live verified experts appear after admin approval. Sample profiles are labeled for UI demos. Chat/call rooms are demo-mode (no live telephony). Interpretive guidance only — not medical, legal, or financial advice.";

export const MARKETPLACE_ASTROLOGERS: MarketplaceAstrologer[] = [
  {
    slug: "acharya-meera",
    name: "Acharya Meera",
    badge: "Celebrity",
    specialties: ["Vedic", "Life Coach"],
    languages: ["English", "Hindi"],
    yearsExp: 12,
    rating: 4.9,
    reviewsLabel: "sample",
    pricePerMinInr: 49,
    online: true,
    bio: "Sample Vedic guide focused on calm career and family reflection.",
    categories: ["vedic", "career", "health"],
    initials: "AM",
    accent: "#f59e0b",
    photoUrl: expertPhotoUrl("acharya-meera"),
  },
  {
    slug: "pandit-raghav",
    name: "Pandit Raghav",
    badge: "Top Choice",
    specialties: ["Vedic", "Kundli Matching"],
    languages: ["Hindi", "English"],
    yearsExp: 18,
    rating: 5.0,
    reviewsLabel: "sample",
    pricePerMinInr: 39,
    online: true,
    bio: "Sample matching specialist for Guna Milan-style conversations.",
    categories: ["marriage", "love", "vedic"],
    initials: "PR",
    accent: "#0ea5e9",
    photoUrl: expertPhotoUrl("pandit-raghav"),
  },
  {
    slug: "divya-joshi",
    name: "Divya Joshi",
    badge: "Rising Star",
    specialties: ["Tarot", "Life Coach"],
    languages: ["English", "Hindi"],
    yearsExp: 7,
    rating: 4.8,
    reviewsLabel: "sample",
    pricePerMinInr: 29,
    online: true,
    bio: "Sample tarot-led reflective sessions for relationship themes.",
    categories: ["tarot", "love", "women"],
    initials: "DJ",
    accent: "#ec4899",
    photoUrl: expertPhotoUrl("divya-joshi"),
  },
  {
    slug: "guru-devraj",
    name: "Guru Devraj",
    badge: "Celebrity",
    specialties: ["Vedic", "Career"],
    languages: ["English", "Hindi", "Marathi"],
    yearsExp: 15,
    rating: 4.9,
    reviewsLabel: "sample",
    pricePerMinInr: 59,
    online: false,
    bio: "Sample career-timing coach using dasha storytelling.",
    categories: ["career", "business", "vedic"],
    initials: "GD",
    accent: "#8b5cf6",
    photoUrl: expertPhotoUrl("guru-devraj"),
  },
  {
    slug: "saanvi-sharma",
    name: "Saanvi Sharma",
    badge: "Top Choice",
    specialties: ["Numerology", "Tarot"],
    languages: ["English", "Hindi"],
    yearsExp: 9,
    rating: 5.0,
    reviewsLabel: "sample",
    pricePerMinInr: 35,
    online: true,
    bio: "Sample numerology + tarot blend for name and timing themes.",
    categories: ["numerology", "tarot", "women"],
    initials: "SS",
    accent: "#14b8a6",
    photoUrl: expertPhotoUrl("saanvi-sharma"),
  },
  {
    slug: "jyotishi-neel",
    name: "Jyotishi Neel",
    badge: "Verified",
    specialties: ["Vedic", "Health & Family"],
    languages: ["Hindi", "Bengali"],
    yearsExp: 11,
    rating: 4.7,
    reviewsLabel: "sample",
    pricePerMinInr: 32,
    online: true,
    bio: "Sample family-wellness reflective readings.",
    categories: ["health", "vedic", "marriage"],
    initials: "JN",
    accent: "#f97316",
    photoUrl: expertPhotoUrl("jyotishi-neel"),
  },
  {
    slug: "vastu-ananya",
    name: "Ananya Vastu",
    badge: "Rising Star",
    specialties: ["Vastu", "Business"],
    languages: ["English", "Hindi"],
    yearsExp: 8,
    rating: 4.8,
    reviewsLabel: "sample",
    pricePerMinInr: 45,
    online: false,
    bio: "Sample home/office vastu conversation guide.",
    categories: ["business", "health"],
    initials: "AV",
    accent: "#84cc16",
    photoUrl: expertPhotoUrl("vastu-ananya"),
  },
  {
    slug: "heena-kapoor",
    name: "Heena Kapoor",
    badge: "Celebrity",
    specialties: ["Face Reading", "Life Coach"],
    languages: ["English", "Hindi", "Punjabi"],
    yearsExp: 10,
    rating: 4.9,
    reviewsLabel: "sample",
    pricePerMinInr: 42,
    online: true,
    bio: "Sample self-discovery face-reading entertainment sessions.",
    categories: ["women", "love", "career"],
    initials: "HK",
    accent: "#e11d48",
    photoUrl: expertPhotoUrl("heena-kapoor"),
  },
];

export const MARKETPLACE_CATEGORIES = [
  { key: "love", title: "Love", href: "/chat-with-astrologer?category=love", tint: "bg-rose-100 text-rose-700", icon: "♥" },
  { key: "marriage", title: "Marriage & Kundli", href: "/chat-with-astrologer?category=marriage", tint: "bg-pink-100 text-pink-700", icon: "⚭" },
  { key: "career", title: "Career", href: "/chat-with-astrologer?category=career", tint: "bg-sky-100 text-sky-700", icon: "↑" },
  { key: "women", title: "Women astrologers", href: "/chat-with-astrologer?category=women", tint: "bg-fuchsia-100 text-fuchsia-700", icon: "✧" },
  { key: "business", title: "Business & Money", href: "/chat-with-astrologer?category=business", tint: "bg-amber-100 text-amber-800", icon: "₹" },
  { key: "health", title: "Health & Family", href: "/chat-with-astrologer?category=health", tint: "bg-emerald-100 text-emerald-700", icon: "+" },
] as const;

export const ACTIVITY_TICKER = [
  "Priya from Mumbai started a sample chat with Acharya Meera",
  "Rahul from Pune opened Free Kundli",
  "Neha from Hyderabad viewed Guna Milan",
  "Amit from Delhi browsed career reports",
  "Sneha from Bengaluru checked today's horoscope",
  "Vikram from Chennai opened Call Astrologer demo",
] as const;

export function getAstrologer(slug: string) {
  return MARKETPLACE_ASTROLOGERS.find((a) => a.slug === slug);
}

export function filterAstrologers(opts: {
  category?: string | null;
  q?: string | null;
  onlineOnly?: boolean;
}) {
  const q = (opts.q || "").trim().toLowerCase();
  return MARKETPLACE_ASTROLOGERS.filter((a) => {
    if (opts.onlineOnly && !a.online) return false;
    if (opts.category && opts.category !== "all") {
      if (!a.categories.includes(opts.category as MarketplaceAstrologer["categories"][number])) return false;
    }
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.specialties.some((s) => s.toLowerCase().includes(q)) ||
      a.languages.some((l) => l.toLowerCase().includes(q))
    );
  });
}
