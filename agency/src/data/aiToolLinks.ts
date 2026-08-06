/**
 * Free/public AI tool URLs for the AI Platform mega menu + suite pages.
 * Each tool opens in a new tab. Prefer no/low-signup free utilities.
 */
export const aiToolLinks: Record<string, string> = {
  // AI Marketing Suite
  "Strategy Generator": "https://chatgpt.com/",
  "Content Generation": "https://chatgpt.com/",
  "Ad Copy Writer": "https://ads.google.com/anon/AdPreview",
  "SEO Optimizer": "https://www.seobility.net/en/seocheck/",
  "Campaign Planner": "https://chatgpt.com/",
  "Audience Insights": "https://www.similarweb.com/",
  "Competitor Analysis": "https://www.similarweb.com/",
  "Budget Allocator": "https://www.omnicalculator.com/finance/roi",
  "A/B Test Ideas": "https://chatgpt.com/",
  "Performance Coach": "https://chatgpt.com/",

  // AI Sales & Lead Generation
  "Lead Gen Assistant": "https://chatgpt.com/",
  "Sales Assistant": "https://chatgpt.com/",
  "Email Outreach": "https://subjectline.com/",
  "CRM Intelligence": "https://chatgpt.com/",
  "Lead Scoring": "https://chatgpt.com/",
  "Call Script Writer": "https://chatgpt.com/",
  "Proposal Drafter": "https://www.canva.com/create/proposals/",
  "Follow-up Sequencer": "https://chatgpt.com/",
  "Pipeline Insights": "https://chatgpt.com/",
  "Deal Predictor": "https://chatgpt.com/",

  // AI Content & Creative
  "Blog Writer": "https://chatgpt.com/",
  "Video Script": "https://chatgpt.com/",
  "Image Generator": "https://www.bing.com/images/create",
  "Video Generator": "https://chatgpt.com/",
  "Voiceover": "https://ttsmp3.com/",
  "Social Captions": "https://www.captiongenerator.com/",
  "Product Copy": "https://chatgpt.com/",
  "Brand Voice Trainer": "https://chatgpt.com/",
  "Thumbnail Ideas": "https://www.canva.com/",
  "Storyboard Builder": "https://www.canva.com/",

  // AI Chat & Customer Experience
  "Chatbot Builder": "https://chatgpt.com/",
  "Voice Bot": "https://chatgpt.com/",
  "Ticket Classifier": "https://chatgpt.com/",
  "Sentiment Analysis": "https://chatgpt.com/",
  "FAQ Auto-Reply": "https://chatgpt.com/",
  "Live Chat Assist": "https://chatgpt.com/",
  "NPS Analyzer": "https://chatgpt.com/",
  "Knowledge Base AI": "https://chatgpt.com/",
  "Escalation Router": "https://chatgpt.com/",
  "CX Insights": "https://chatgpt.com/",

  // AI Automation Suite
  "Workflow Automation": "https://zapier.com/",
  "Web Scraper": "https://www.parsehub.com/",
  "Form Processing": "https://www.google.com/forms/about/",
  "RPA Bots": "https://zapier.com/",
  "Data Enrichment": "https://chatgpt.com/",
  "Schedule Triggers": "https://zapier.com/",
  "Zapier-style Flows": "https://zapier.com/",
  "Document Extractor": "https://www.ilovepdf.com/",
  "Email Parser": "https://chatgpt.com/",
  "Task Orchestrator": "https://trello.com/",

  // AI Analytics & Insights
  "Data Analytics": "https://lookerstudio.google.com/",
  "Predictive Analytics": "https://chatgpt.com/",
  "Trend Analysis": "https://trends.google.com/trends/",
  "Marketing Attribution": "https://tagassistant.google.com/",
  "Anomaly Detection": "https://chatgpt.com/",
  "Cohort Insights": "https://chatgpt.com/",
  "Forecast Models": "https://chatgpt.com/",
  "Dashboard AI": "https://lookerstudio.google.com/",
  "KPI Alerts": "https://tagassistant.google.com/",
  "Report Narrator": "https://chatgpt.com/",

  // AI Website & SEO
  "Website Builder": "https://www.canva.com/websites/",
  "SEO Assistant": "https://www.seobility.net/en/seocheck/",
  "Schema Generator": "https://technicalseo.com/tools/schema-markup-generator/",
  "Page Speed Optimizer": "https://pagespeed.web.dev/",
  "Content Gap Finder": "https://chatgpt.com/",
  "Internal Link Mapper": "https://www.brokenlinkcheck.com/",
  "Meta Writer": "https://metatags.io/",
  "Alt Text Generator": "https://chatgpt.com/",
  "Crawl Insights": "https://www.xml-sitemaps.com/",
  "GEO Optimizer": "https://chatgpt.com/",

  // AI Developer Tools
  "Code Generator": "https://chatgpt.com/",
  "Code Review": "https://chatgpt.com/",
  "API Builder": "https://chatgpt.com/",
  "UI/UX Generator": "https://www.figma.com/",
  "Test Writer": "https://chatgpt.com/",
  "Bug Explainer": "https://chatgpt.com/",
  "Docs Generator": "https://chatgpt.com/",
  "SQL Assistant": "https://chatgpt.com/",
  "Migration Helper": "https://chatgpt.com/",
  "Security Scanner": "https://securityheaders.com/",
};

export function getAiToolUrl(name: string): string | undefined {
  return aiToolLinks[name];
}

/** Slugify a tool label for hash anchors on suite pages. */
export function aiToolSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
