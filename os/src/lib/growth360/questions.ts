export type QuestionOption = {
  value: string;
  label: string;
  icon?: string;
};

export type Question = {
  key: string;
  title: string;
  explanation: string;
  icon: string;
  type: "single" | "text" | "number" | "multi";
  options?: QuestionOption[];
  placeholder?: string;
  field?: string;
};

export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    key: "growthGoal",
    title: "What's your biggest goal?",
    explanation: "Tell us what you want to improve.",
    icon: "🎯",
    type: "single",
    field: "growthGoal",
    options: [
      { value: "more-leads", label: "More Leads" },
      { value: "more-sales", label: "More Sales" },
      { value: "new-markets", label: "New Markets" },
      { value: "brand-growth", label: "Brand Growth" },
    ],
  },
  {
    key: "industry",
    title: "Which industry are you in?",
    explanation: "This helps us match relevant competitors and strategy.",
    icon: "🏭",
    type: "single",
    field: "industry",
    options: [
      { value: "Manufacturing", label: "Manufacturing" },
      { value: "Healthcare", label: "Healthcare" },
      { value: "Education", label: "Education" },
      { value: "Real Estate", label: "Real Estate" },
      { value: "Retail", label: "Retail" },
      { value: "SaaS / Software", label: "SaaS / Software" },
      { value: "Professional Services", label: "Professional Services" },
      { value: "Hospitality", label: "Hospitality" },
    ],
  },
  {
    key: "location",
    title: "Where do you operate?",
    explanation: "Location shapes local competition and demand.",
    icon: "📍",
    type: "single",
    field: "location",
    options: [
      { value: "Mumbai", label: "Mumbai" },
      { value: "Delhi NCR", label: "Delhi NCR" },
      { value: "Bengaluru", label: "Bengaluru" },
      { value: "Hyderabad", label: "Hyderabad" },
      { value: "Chennai", label: "Chennai" },
      { value: "Pune", label: "Pune" },
      { value: "Ahmedabad", label: "Ahmedabad" },
      { value: "Kolkata", label: "Kolkata" },
    ],
  },
  {
    key: "businessType",
    title: "What best describes your business?",
    explanation: "We'll tailor channel recommendations to your model.",
    icon: "🏢",
    type: "single",
    field: "businessType",
    options: [
      { value: "B2B", label: "B2B" },
      { value: "B2C", label: "B2C" },
      { value: "Both", label: "Both B2B & B2C" },
      { value: "Marketplace", label: "Marketplace Seller" },
    ],
  },
  {
    key: "product",
    title: "What do you sell?",
    explanation: "A short description is enough.",
    icon: "📦",
    type: "text",
    field: "product",
    placeholder: "e.g. Industrial fasteners, dental clinic, coaching courses",
  },
  {
    key: "targetCustomer",
    title: "Who is your ideal customer?",
    explanation: "Think of the buyer you want more of.",
    icon: "👤",
    type: "text",
    field: "targetCustomer",
    placeholder: "e.g. Factory owners, parents of grade 10 students",
  },
  {
    key: "avgCustomerValue",
    title: "Average value per customer?",
    explanation: "Used for ROI projections — not shared publicly.",
    icon: "₹",
    type: "single",
    field: "avgCustomerValue",
    options: [
      { value: "5000", label: "Under ₹10,000" },
      { value: "25000", label: "₹10,000 – ₹50,000" },
      { value: "75000", label: "₹50,000 – ₹1 Lakh" },
      { value: "200000", label: "₹1 Lakh+" },
    ],
  },
  {
    key: "marketingBudget",
    title: "Monthly marketing budget?",
    explanation: "Helps size a realistic starting investment.",
    icon: "📊",
    type: "single",
    field: "marketingBudget",
    options: [
      { value: "10000", label: "Under ₹25,000" },
      { value: "40000", label: "₹25,000 – ₹75,000" },
      { value: "100000", label: "₹75,000 – ₹1.5 Lakh" },
      { value: "200000", label: "₹1.5 Lakh+" },
    ],
  },
  {
    key: "currentChannels",
    title: "What are you using today?",
    explanation: "Select all that apply — we'll find the gaps.",
    icon: "📡",
    type: "multi",
    field: "currentChannels",
    options: [
      { value: "google-ads", label: "Google Ads" },
      { value: "meta-ads", label: "Meta Ads" },
      { value: "seo", label: "SEO" },
      { value: "whatsapp", label: "WhatsApp" },
      { value: "cold-calling", label: "Cold Calling" },
      { value: "offline", label: "Offline / Referrals" },
      { value: "none", label: "Nothing consistent yet" },
    ],
  },
  {
    key: "company",
    title: "What's your company name?",
    explanation: "So we can personalize your Growth360 report.",
    icon: "✨",
    type: "text",
    field: "company",
    placeholder: "Your company name",
  },
];

export const CONTACT_FIELDS = [
  { key: "contactName", label: "Your name", placeholder: "Full name" },
  { key: "contactWhatsapp", label: "WhatsApp number", placeholder: "10-digit mobile" },
  { key: "contactEmail", label: "Work email", placeholder: "you@company.com" },
] as const;
