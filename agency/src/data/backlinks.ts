export type BacklinkStatus =
  | "prospect"
  | "outreach-sent"
  | "in-progress"
  | "live"
  | "lost"
  | "rejected";

export type BacklinkItem = {
  id: string;
  domain: string;
  url: string;
  targetUrl: string;
  type: "Citation" | "Guest post" | "Resource" | "Directory" | "PR" | "Partner" | "Other";
  status: BacklinkStatus;
  contactEmail: string;
  daEstimate: string;
  anchor: string;
  notes: string;
  nextAction: string;
  lastTouched: string;
};

export type BacklinksCms = {
  title: string;
  notes: string;
  sheetUrl: string;
  workflow: string[];
  items: BacklinkItem[];
};

export const fallbackBacklinks: BacklinksCms = {
  title: "Backlink & outreach tracker",
  notes:
    "Track legitimate outreach only. Prefer citations, partner pages, resource mentions, and earned PR. Avoid PBNs and paid spam networks.",
  sheetUrl: "",
  workflow: [
    "1. Add prospect domains from the citation kit or partner list",
    "2. Send outreach using a template (mark outreach-sent)",
    "3. Follow up once after 5-7 days",
    "4. When live, paste the URL, set status=live, and note the anchor",
    "5. Re-check quarterly; mark lost if the link disappears",
  ],
  items: [
    {
      id: "ex-gmb",
      domain: "business.google.com",
      url: "https://business.google.com/",
      targetUrl: "https://displayavenue.com/",
      type: "Citation",
      status: "live",
      contactEmail: "",
      daEstimate: "N/A",
      anchor: "Display Avenue",
      notes: "Google Business Profile - keep NAP synced",
      nextAction: "Monthly photo + Q&A refresh",
      lastTouched: "2026-08-10",
    },
    {
      id: "ex-clutch",
      domain: "clutch.co",
      url: "",
      targetUrl: "https://displayavenue.com/",
      type: "Directory",
      status: "prospect",
      contactEmail: "",
      daEstimate: "90+",
      anchor: "DisplayAvenue",
      notes: "Claim agency profile + request client reviews",
      nextAction: "Submit profile + ask 3 clients for reviews",
      lastTouched: "2026-08-10",
    },
    {
      id: "ex-report",
      domain: "partner-blog.example",
      url: "",
      targetUrl: "https://displayavenue.com/resources/india-sme-digital-growth-report",
      type: "Resource",
      status: "outreach-sent",
      contactEmail: "editor@example.com",
      daEstimate: "40-60",
      anchor: "India SME Digital Growth Report 2026",
      notes: "Sent report citation template",
      nextAction: "Follow up in 5 days",
      lastTouched: "2026-08-10",
    },
  ],
};
