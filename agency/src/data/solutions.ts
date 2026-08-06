export type SolutionCategory = {
  title: string;
  icon: string;
  color: string;
  links: { label: string; href: string }[];
  viewAll: string;
};

export const solutionCategories: SolutionCategory[] = [
  {
    title: "By Business Goals",
    icon: "target",
    color: "#0056ff",
    links: [
      { label: "Lead Generation", href: "/solutions/lead-generation" },
      { label: "E-commerce Growth", href: "/solutions/ecommerce-growth" },
      { label: "Brand Awareness", href: "/solutions/brand-awareness" },
      { label: "App Installs", href: "/solutions/app-installs" },
      { label: "Revenue Growth", href: "/solutions/revenue-growth" },
    ],
    viewAll: "View All Goal Solutions",
  },
  {
    title: "By Business Size",
    icon: "building",
    color: "#0d9488",
    links: [
      { label: "Startups", href: "/solutions/startups" },
      { label: "Small Business", href: "/solutions/smb" },
      { label: "Medium Business", href: "/solutions/medium" },
      { label: "Enterprises", href: "/solutions/enterprise" },
      { label: "Agencies", href: "/solutions/agencies" },
    ],
    viewAll: "View All Size Solutions",
  },
  {
    title: "By Platform",
    icon: "grid",
    color: "#7c3aed",
    links: [
      { label: "Google Marketing", href: "/solutions/google" },
      { label: "Meta Ads", href: "/solutions/meta" },
      { label: "LinkedIn", href: "/solutions/linkedin" },
      { label: "YouTube", href: "/solutions/youtube" },
      { label: "WhatsApp", href: "/solutions/whatsapp" },
      { label: "Shopify", href: "/solutions/shopify" },
      { label: "WordPress", href: "/solutions/wordpress" },
      { label: "Amazon", href: "/solutions/amazon" },
    ],
    viewAll: "View All Platform Solutions",
  },
  {
    title: "By Technology",
    icon: "chip",
    color: "#f97316",
    links: [
      { label: "AI-Powered Solutions", href: "/ai-platform" },
      { label: "Web & Mobile Apps", href: "/solutions/apps" },
      { label: "Cloud Solutions", href: "/solutions/cloud" },
      { label: "Automation", href: "/solutions/automation" },
      { label: "Cyber Security", href: "/solutions/security" },
    ],
    viewAll: "View All Tech Solutions",
  },
  {
    title: "By Marketing Channel",
    icon: "megaphone",
    color: "#e11d8c",
    links: [
      { label: "SEO", href: "/solutions/seo" },
      { label: "Google Ads", href: "/solutions/google-ads" },
      { label: "Social Media", href: "/solutions/social" },
      { label: "Email Marketing", href: "/solutions/email" },
      { label: "Influencer Marketing", href: "/solutions/influencer" },
    ],
    viewAll: "View All Channel Solutions",
  },
  {
    title: "By Industry Needs",
    icon: "briefcase",
    color: "#0891b2",
    links: [
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "Education", href: "/industries/education" },
      { label: "Real Estate", href: "/industries/real-estate" },
      { label: "Retail", href: "/industries/ecommerce" },
      { label: "Finance", href: "/industries/finance" },
    ],
    viewAll: "View All Industry Solutions",
  },
  {
    title: "By Customer Journey",
    icon: "path",
    color: "#16a34a",
    links: [
      { label: "Awareness", href: "/solutions/awareness" },
      { label: "Consideration", href: "/solutions/consideration" },
      { label: "Conversion", href: "/solutions/conversion" },
      { label: "Retention", href: "/solutions/retention" },
      { label: "Loyalty", href: "/solutions/loyalty" },
    ],
    viewAll: "View All Journey Solutions",
  },
  {
    title: "By Service Type",
    icon: "layers",
    color: "#4f46e5",
    links: [
      { label: "Strategy", href: "/solutions/strategy" },
      { label: "Implementation", href: "/solutions/implementation" },
      { label: "Creative", href: "/solutions/creative" },
      { label: "Development", href: "/solutions/development" },
      { label: "Support", href: "/solutions/support" },
    ],
    viewAll: "View All Service Solutions",
  },
];

export const solutionValues = [
  { title: "Goal-Oriented Strategies", icon: "target" },
  { title: "Data-Driven Decisions", icon: "chart" },
  { title: "End-to-End Execution", icon: "check" },
  { title: "ROI & Growth Focused", icon: "growth" },
];

export const solutionTrustBar = [
  { icon: "brain", label: "AI-Powered Insights" },
  { icon: "layers", label: "Proven Frameworks" },
  { icon: "chart", label: "Measurable Results" },
  { icon: "gear", label: "Scalable Solutions" },
  { icon: "users", label: "Dedicated Support" },
];
