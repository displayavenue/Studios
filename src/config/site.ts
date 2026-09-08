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
  { href: "/services?category=marriage", label: "Matching" },
  { href: "/services?category=daily-astrology", label: "Horoscopes" },
  { href: "/stories", label: "Sample Stories" },
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
  // Explicit flag wins so production can disable mocks while keeping other env defaults.
  if (process.env.USE_MOCK_PROVIDERS === "false") return false;
  if (process.env.USE_MOCK_PROVIDERS === "true") return true;
  return (
    process.env.JYOTISH_MODE === "development" ||
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_KEY_SECRET
  );
}
