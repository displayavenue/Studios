export type LinkItem = { label: string; href: string };

export type ServiceColumn = {
  title: string;
  icon: string;
  color: string;
  links: LinkItem[];
  cta: { label: string; href: string };
};

export type NestedGroup = {
  title: string;
  links: LinkItem[];
};

export const marketingServices: LinkItem[] = [
  { label: "SEO Services", href: "/services/seo" },
  { label: "AI SEO (GEO)", href: "/services/ai-seo" },
  { label: "Local SEO", href: "/services/local-seo" },
  { label: "Google Ads", href: "/services/google-ads" },
  { label: "Meta Ads", href: "/services/meta-ads" },
  { label: "LinkedIn Ads", href: "/services/linkedin-ads" },
  { label: "Email Marketing", href: "/services/email-marketing" },
  { label: "Social Media Marketing", href: "/services/social-media" },
  { label: "Content Marketing", href: "/services/content-marketing" },
  { label: "Influencer Marketing", href: "/services/influencer-marketing" },
  { label: "Marketing Automation", href: "/services/marketing-automation" },
  { label: "CRO & Landing Pages", href: "/services/cro" },
  { label: "Analytics & Tracking", href: "/services/analytics" },
  { label: "Reputation Management", href: "/services/reputation" },
];

export const webDevGroups: NestedGroup[] = [
  {
    title: "Business Websites",
    links: [
      { label: "Corporate Websites", href: "/services/corporate-websites" },
      { label: "Startup Websites", href: "/services/startup-websites" },
      { label: "Landing Pages", href: "/services/landing-pages" },
    ],
  },
  {
    title: "Ecommerce Development",
    links: [
      { label: "Shopify", href: "/services/shopify" },
      { label: "WooCommerce", href: "/services/woocommerce" },
      { label: "Magento", href: "/services/magento" },
      { label: "Custom Ecommerce", href: "/services/custom-ecommerce" },
    ],
  },
  {
    title: "CMS Development",
    links: [
      { label: "WordPress", href: "/services/wordpress" },
      { label: "Webflow", href: "/services/webflow" },
      { label: "Wix", href: "/services/wix" },
      { label: "Framer", href: "/services/framer" },
      { label: "Drupal", href: "/services/drupal" },
    ],
  },
  {
    title: "Custom Development",
    links: [
      { label: "CRM Systems", href: "/services/crm" },
      { label: "ERP Solutions", href: "/services/erp" },
      { label: "SaaS Products", href: "/services/saas" },
      { label: "Admin Dashboards", href: "/services/dashboards" },
    ],
  },
];

export const designMobile = [
  {
    title: "Mobile Development",
    icon: "phone",
    color: "#0056ff",
    links: [
      { label: "Android Apps", href: "/services/android" },
      { label: "iOS Apps", href: "/services/ios" },
      { label: "Flutter", href: "/services/flutter" },
      { label: "React Native", href: "/services/react-native" },
      { label: "PWA", href: "/services/pwa" },
    ],
    viewAll: { label: "View All", href: "/services/mobile" },
  },
  {
    title: "UI/UX Design",
    icon: "layers",
    color: "#7c3aed",
    links: [
      { label: "UI/UX Design", href: "/services/ui-ux" },
      { label: "Wireframing", href: "/services/wireframing" },
      { label: "Prototyping", href: "/services/prototyping" },
      { label: "Design Systems", href: "/services/design-systems" },
    ],
    viewAll: { label: "View All", href: "/services/design" },
  },
  {
    title: "Branding Services",
    icon: "brand",
    color: "#e11d8c",
    links: [
      { label: "Logo Design", href: "/services/logo" },
      { label: "Brand Identity", href: "/services/brand-identity" },
      { label: "Packaging Design", href: "/services/packaging" },
      { label: "Brand Guidelines", href: "/services/brand-guidelines" },
    ],
    viewAll: { label: "View All", href: "/services/branding" },
  },
];

export const aiSoftware = [
  {
    title: "AI Solutions",
    icon: "brain",
    color: "#16a34a",
    links: [
      { label: "AI Chatbots", href: "/services/ai-chatbots" },
      { label: "AI Agents", href: "/services/ai-agents" },
      { label: "AI Automation", href: "/services/ai-automation" },
      { label: "AI Workflows", href: "/services/ai-workflows" },
    ],
    viewAll: { label: "View All", href: "/ai-platform" },
  },
  {
    title: "Software Development",
    icon: "code",
    color: "#f97316",
    links: [
      { label: "CRM", href: "/services/crm" },
      { label: "ERP", href: "/services/erp" },
      { label: "HRMS", href: "/services/hrms" },
      { label: "POS", href: "/services/pos" },
      { label: "SaaS", href: "/services/saas" },
    ],
    viewAll: { label: "View All", href: "/services/software" },
  },
  {
    title: "Cloud & DevOps",
    icon: "cloud",
    color: "#7c3aed",
    links: [
      { label: "AWS", href: "/services/aws" },
      { label: "Azure", href: "/services/azure" },
      { label: "GCP", href: "/services/gcp" },
      { label: "Docker", href: "/services/docker" },
      { label: "Server Management", href: "/services/server-management" },
    ],
    viewAll: { label: "View All", href: "/services/cloud" },
  },
];

export const creativeStudio: LinkItem[] = [
  { label: "Photography", href: "/services/photography" },
  { label: "Videography", href: "/services/videography" },
  { label: "Drone Photography", href: "/services/drone" },
  { label: "Video Editing", href: "/services/video-editing" },
  { label: "Animation", href: "/services/animation" },
  { label: "Motion Graphics", href: "/services/motion-graphics" },
  { label: "Product Shoots", href: "/services/product-shoots" },
  { label: "Brand Films", href: "/services/brand-films" },
];

export const whyChoose = [
  "500+ Projects Delivered",
  "150+ Happy Clients",
  "8+ Years Experience",
  "AI-Powered Delivery",
  "ROI-Driven Strategy",
  "24/7 Support",
];

export const trustBar = [
  { icon: "clock", label: "On-Time Delivery" },
  { icon: "tag", label: "Transparent Pricing" },
  { icon: "users", label: "Dedicated Team" },
  { icon: "shield", label: "Data Security" },
  { icon: "gear", label: "Scalable Solutions" },
  { icon: "chat", label: "Long-Term Support" },
];

export const homeServices = [
  {
    title: "Digital Marketing",
    desc: "SEO, ads, social, and growth campaigns that convert.",
    icon: "megaphone",
    color: "#0056ff",
    href: "/services/digital-marketing",
  },
  {
    title: "Web Development",
    desc: "High-performance websites and custom web apps.",
    icon: "code",
    color: "#0d9488",
    href: "/services/web-development",
  },
  {
    title: "E-commerce",
    desc: "Stores that sell - Shopify, WooCommerce, custom.",
    icon: "bag",
    color: "#f97316",
    href: "/services/ecommerce",
  },
  {
    title: "AI Solutions",
    desc: "Chatbots, agents, automation, and AI workflows.",
    icon: "brain",
    color: "#7c3aed",
    href: "/ai-platform",
  },
  {
    title: "Branding & Design",
    desc: "Identity, UI/UX, and brand systems that stand out.",
    icon: "brand",
    color: "#e11d8c",
    href: "/services/branding",
  },
  {
    title: "Content & Creative",
    desc: "Photo, video, copy, and production under one roof.",
    icon: "camera",
    color: "#0891b2",
    href: "/services/creative",
  },
];
