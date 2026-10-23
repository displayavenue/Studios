export type Plan = { name: string; price: string };

export type PackageCategory = {
  title: string;
  desc: string;
  color: string;
  icon: string;
  plans: Plan[];
  href: string;
};

export const packageCategories: PackageCategory[] = [
  {
    title: "Digital Marketing Packages",
    desc: "Full-funnel growth plans for every stage.",
    color: "#0056ff",
    icon: "megaphone",
    plans: [
      { name: "Starter", price: "₹12,000" },
      { name: "Growth", price: "₹20,000" },
      { name: "Pro", price: "₹35,000" },
      { name: "Business", price: "₹60,000" },
      { name: "Enterprise", price: "Custom" },
    ],
    href: "/packages/digital-marketing",
  },
  {
    title: "SEO Packages",
    desc: "Organic visibility that compounds.",
    color: "#16a34a",
    icon: "search",
    plans: [
      { name: "Basic", price: "₹10,000" },
      { name: "Growth", price: "₹18,000" },
      { name: "Advanced", price: "₹30,000" },
      { name: "Premium", price: "₹50,000" },
      { name: "Enterprise", price: "Custom" },
    ],
    href: "/packages/seo",
  },
  {
    title: "Google Ads Packages",
    desc: "Paid search that drives qualified demand.",
    color: "#f97316",
    icon: "ads",
    plans: [
      { name: "Search Ads", price: "₹10,000" },
      { name: "Performance", price: "₹18,000" },
      { name: "Growth", price: "₹30,000" },
      { name: "Pro", price: "₹50,000" },
      { name: "Enterprise", price: "Custom" },
    ],
    href: "/packages/google-ads",
  },
  {
    title: "Social Media Packages",
    desc: "Content, community, and paid social.",
    color: "#e11d8c",
    icon: "share",
    plans: [
      { name: "Starter", price: "₹12,000" },
      { name: "Growth", price: "₹20,000" },
      { name: "Pro", price: "₹35,000" },
      { name: "Business", price: "₹55,000" },
      { name: "Enterprise", price: "Custom" },
    ],
    href: "/packages/social-media",
  },
  {
    title: "Website Development Packages",
    desc: "From landing pages to enterprise sites.",
    color: "#0d9488",
    icon: "code",
    plans: [
      { name: "Basic", price: "₹15,000" },
      { name: "Business", price: "₹25,000" },
      { name: "Premium", price: "₹45,000" },
      { name: "E-commerce", price: "₹75,000" },
      { name: "Enterprise", price: "Custom" },
    ],
    href: "/packages/website",
  },
  {
    title: "E-commerce Packages",
    desc: "Stores built to convert and scale.",
    color: "#7c3aed",
    icon: "bag",
    plans: [
      { name: "Basic Store", price: "₹20,000" },
      { name: "Advanced", price: "₹40,000" },
      { name: "Premium", price: "₹70,000" },
      { name: "Marketplace", price: "₹1,50,000" },
      { name: "Enterprise", price: "Custom" },
    ],
    href: "/packages/ecommerce",
  },
  {
    title: "Branding Packages",
    desc: "Identity systems that feel premium.",
    color: "#4f46e5",
    icon: "brand",
    plans: [
      { name: "Logo Design", price: "₹5,000" },
      { name: "Brand Identity", price: "₹15,000" },
      { name: "Business Branding", price: "₹30,000" },
      { name: "Premium Branding", price: "₹60,000" },
      { name: "Complete Branding", price: "Custom" },
    ],
    href: "/packages/branding",
  },
  {
    title: "Creative & Production Packages",
    desc: "Photo, video, and brand films.",
    color: "#0891b2",
    icon: "camera",
    plans: [
      { name: "Photography", price: "₹5,000" },
      { name: "Videography", price: "₹15,000" },
      { name: "Video Editing", price: "₹8,000" },
      { name: "Brand Film", price: "₹50,000" },
      { name: "Complete Production", price: "Custom" },
    ],
    href: "/packages/creative",
  },
];

export const packageBenefits = [
  { title: "Transparent Pricing", icon: "tag", color: "#0056ff" },
  { title: "Result Oriented", icon: "target", color: "#16a34a" },
  { title: "Scalable Solutions", icon: "puzzle", color: "#7c3aed" },
  { title: "Expert Team", icon: "users", color: "#f97316" },
  { title: "Regular Reporting", icon: "clipboard", color: "#e11d8c" },
];

export const packageIncludes = [
  "Dedicated Account Manager",
  "24/7 Priority Support",
  "Data Security & Compliance",
  "Monthly Performance Reports",
  "Strategy Reviews",
  "Transparent Dashboards",
  "Flexible Upgrades",
];

export const featuredHomePackages = [
  {
    name: "Starter",
    price: "₹12,000",
    period: "/mo",
    features: ["SEO essentials", "Social management", "Monthly report"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "₹24,000",
    period: "/mo",
    badge: "Best Value",
    features: ["SEO + Ads", "Content calendar", "CRO audits", "Bi-weekly calls"],
    highlighted: true,
  },
  {
    name: "Business",
    price: "₹48,000",
    period: "/mo",
    features: ["Full funnel", "AI tools access", "Dedicated strategist"],
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Multi-brand", "Custom SLAs", "On-site workshops"],
    highlighted: false,
  },
];
