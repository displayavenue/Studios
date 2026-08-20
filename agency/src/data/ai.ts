export type AiSuite = {
  title: string;
  icon: string;
  color: string;
  tools: string[];
  href: string;
};

export const aiSuites: AiSuite[] = [
  {
    title: "AI Marketing Suite",
    icon: "megaphone",
    color: "#7c3aed",
    tools: [
      "Strategy Generator",
      "Content Generation",
      "Ad Copy Writer",
      "SEO Optimizer",
      "Campaign Planner",
      "Audience Insights",
      "Competitor Analysis",
      "Budget Allocator",
      "A/B Test Ideas",
      "Performance Coach",
    ],
    href: "/ai-platform/marketing",
  },
  {
    title: "AI Sales & Lead Generation",
    icon: "growth",
    color: "#16a34a",
    tools: [
      "Lead Gen Assistant",
      "Sales Assistant",
      "Email Outreach",
      "CRM Intelligence",
      "Lead Scoring",
      "Call Script Writer",
      "Proposal Drafter",
      "Follow-up Sequencer",
      "Pipeline Insights",
      "Deal Predictor",
    ],
    href: "/ai-platform/sales",
  },
  {
    title: "AI Content & Creative",
    icon: "doc",
    color: "#0891b2",
    tools: [
      "Blog Writer",
      "Video Script",
      "Image Generator",
      "Video Generator",
      "Voiceover",
      "Social Captions",
      "Product Copy",
      "Brand Voice Trainer",
      "Thumbnail Ideas",
      "Storyboard Builder",
    ],
    href: "/ai-platform/content",
  },
  {
    title: "AI Chat & Customer Experience",
    icon: "chat",
    color: "#e11d8c",
    tools: [
      "Chatbot Builder",
      "Voice Bot",
      "Ticket Classifier",
      "Sentiment Analysis",
      "FAQ Auto-Reply",
      "Live Chat Assist",
      "NPS Analyzer",
      "Knowledge Base AI",
      "Escalation Router",
      "CX Insights",
    ],
    href: "/ai-platform/cx",
  },
  {
    title: "AI Automation Suite",
    icon: "bolt",
    color: "#f97316",
    tools: [
      "Workflow Automation",
      "Web Scraper",
      "Form Processing",
      "RPA Bots",
      "Data Enrichment",
      "Schedule Triggers",
      "Zapier-style Flows",
      "Document Extractor",
      "Email Parser",
      "Task Orchestrator",
    ],
    href: "/ai-platform/automation",
  },
  {
    title: "AI Analytics & Insights",
    icon: "chart",
    color: "#0056ff",
    tools: [
      "Data Analytics",
      "Predictive Analytics",
      "Trend Analysis",
      "Marketing Attribution",
      "Anomaly Detection",
      "Cohort Insights",
      "Forecast Models",
      "Dashboard AI",
      "KPI Alerts",
      "Report Narrator",
    ],
    href: "/ai-platform/analytics",
  },
  {
    title: "AI Website & SEO",
    icon: "globe",
    color: "#0d9488",
    tools: [
      "Website Builder",
      "SEO Assistant",
      "Schema Generator",
      "Page Speed Optimizer",
      "Content Gap Finder",
      "Internal Link Mapper",
      "Meta Writer",
      "Alt Text Generator",
      "Crawl Insights",
      "GEO Optimizer",
    ],
    href: "/ai-platform/seo",
  },
  {
    title: "AI Developer Tools",
    icon: "code",
    color: "#1e3a8a",
    tools: [
      "Code Generator",
      "Code Review",
      "API Builder",
      "UI/UX Generator",
      "Test Writer",
      "Bug Explainer",
      "Docs Generator",
      "SQL Assistant",
      "Migration Helper",
      "Security Scanner",
    ],
    href: "/ai-platform/developer",
  },
];

export const aiValues = [
  {
    title: "Built for Businesses",
    desc: "AI solutions designed to drive real business impact.",
    icon: "robot",
  },
  {
    title: "Secure & Reliable",
    desc: "Enterprise-grade security and data protection.",
    icon: "shield",
  },
  {
    title: "Smart Automation",
    desc: "Automate tasks, save time, and boost productivity.",
    icon: "bolt",
  },
  {
    title: "Measurable Results",
    desc: "Track performance and maximize ROI.",
    icon: "chart",
  },
];

export const aiStats = [
  { value: "100+", label: "AI Tools", icon: "grid" },
  { value: "5000+", label: "Businesses Empowered", icon: "handshake" },
  { value: "1M+", label: "Tasks Automated", icon: "nodes" },
  { value: "98%", label: "Customer Satisfaction", icon: "users" },
];

export const aiPartners = [
  "OpenAI",
  "Gemini",
  "Claude",
  "Meta",
  "Google",
  "Microsoft",
  "HubSpot",
  "Zapier",
  "Salesforce",
  "WhatsApp",
  "Shopify",
];
