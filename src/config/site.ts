export const BRAND = {
  name: "JyotishKundali",
  tagline: "Know Yourself. Understand Your Path.",
  domain: "jyotishkundali.com",
  currency: "INR",
  timezone: "Asia/Kolkata",
} as const;

export const PRICING = {
  reportPrice: 499,
  membershipYearly: 2999,
} as const;

export const ASTROLOGY_DISCLAIMER =
  "Astrology and face-reading content on this site is for interpretive and entertainment purposes. Mock or demo calculations are not real planetary positions.";

/** AstroTalk-style marketplace navigation (JyotishKundali branded). */
export const MARKETPLACE_NAV = [
  {
    label: "Consultations",
    href: "/chat-with-astrologer",
    children: [
      { href: "/chat-with-astrologer", label: "Chat with Astrologer" },
      { href: "/talk-to-astrologer", label: "Call with Astrologer" },
      { href: "/wallet", label: "Wallet recharge" },
      { href: "/experts", label: "Browse experts" },
    ],
  },
  {
    label: "Horoscope",
    href: "/horoscope",
    children: [
      { href: "/horoscope", label: "Daily Horoscope" },
      { href: "/services?category=daily-astrology", label: "Forecast reports" },
    ],
  },
  {
    label: "Free Services",
    href: "/free-kundli",
    children: [
      { href: "/free-kundli", label: "Free Kundli" },
      { href: "/panchang", label: "Panchang" },
      { href: "/calculators", label: "Calculators" },
      { href: "/services/guna-milan", label: "Kundali Matching" },
    ],
  },
  {
    label: "Shop",
    href: "/shop",
    children: [
      { href: "/shop", label: "AstroMall" },
      { href: "/shop?category=gemstone", label: "Gemstones" },
      { href: "/shop?category=puja", label: "Puja kits" },
    ],
  },
  {
    label: "Reports",
    href: "/services",
    children: [
      { href: "/services?category=kundali", label: "Kundali PDFs" },
      { href: "/services?category=marriage", label: "Marriage & Matching" },
      { href: "/membership", label: "Membership" },
    ],
  },
  { label: "Blog", href: "/blog" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/chat-with-astrologer", label: "Chat" },
  { href: "/shop", label: "Shop" },
  { href: "/free-kundli", label: "Free Kundli" },
  { href: "/panchang", label: "Panchang" },
  { href: "/services", label: "Reports" },
  { href: "/blog", label: "Blog" },
] as const;

export const MOBILE_NAV = [
  { href: "/", label: "Home" },
  { href: "/chat-with-astrologer", label: "Chat" },
  { href: "/talk-to-astrologer", label: "Call" },
  { href: "/shop", label: "Shop" },
  { href: "/wallet", label: "Wallet" },
] as const;

export function useMockProviders() {
  if (process.env.USE_MOCK_PROVIDERS === "false") return false;
  if (process.env.USE_MOCK_PROVIDERS === "true") return true;
  return (
    process.env.JYOTISH_MODE === "development" ||
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_KEY_SECRET
  );
}
