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

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Astrology" },
  { href: "/services?category=self-discovery", label: "Self Discovery" },
  { href: "/services?category=marriage", label: "Compatibility" },
  { href: "/services?category=daily-astrology", label: "Daily Horoscope" },
  { href: "/services", label: "Free Tools" },
  { href: "/experts", label: "Experts" },
  { href: "/blog", label: "Blog" },
] as const;

export const MOBILE_NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/dashboard", label: "Reports" },
  { href: "/dashboard/ai", label: "AI" },
  { href: "/dashboard", label: "Account" },
] as const;

export function useMockProviders() {
  return (
    process.env.USE_MOCK_PROVIDERS === "true" ||
    process.env.JYOTISH_MODE === "development"
  );
}
