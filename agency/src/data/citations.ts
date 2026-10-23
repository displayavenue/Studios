export type CitationEntry = {
  id: string;
  name: string;
  url: string;
  category: "General" | "India" | "Local" | "Industry" | "Review" | "Startup";
  daHint: string;
  napFields: string;
  notes: string;
  priority: "High" | "Medium" | "Low";
};

export type OutreachTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

export type CitationsCms = {
  title: string;
  lead: string;
  sheetUrl: string;
  directories: CitationEntry[];
  templates: OutreachTemplate[];
};

export const fallbackCitations: CitationsCms = {
  title: "Citation & directory outreach kit",
  lead: "Submit consistent NAP (name, address, phone) to legitimate directories. Use the templates below - never spam, never buy fake DA80 links.",
  sheetUrl: "",
  directories: [
    {
      id: "gmb",
      name: "Google Business Profile",
      url: "https://business.google.com/",
      category: "Local",
      daHint: "Critical",
      napFields: "Name, address, phone, hours, categories, photos",
      notes: "Primary local ranking signal. Keep hours and categories exact.",
      priority: "High",
    },
    {
      id: "bing-places",
      name: "Bing Places",
      url: "https://www.bingplaces.com/",
      category: "Local",
      daHint: "High",
      napFields: "Name, address, phone, website",
      notes: "Import from Google where possible.",
      priority: "High",
    },
    {
      id: "apple-business",
      name: "Apple Business Connect",
      url: "https://businessconnect.apple.com/",
      category: "Local",
      daHint: "High",
      napFields: "Name, address, phone, website",
      notes: "Important for Apple Maps and Siri.",
      priority: "High",
    },
    {
      id: "justdial",
      name: "Justdial",
      url: "https://www.justdial.com/",
      category: "India",
      daHint: "High",
      napFields: "Name, city, phone, category",
      notes: "Strong India local citation. Match GMB category closely.",
      priority: "High",
    },
    {
      id: "sulekha",
      name: "Sulekha",
      url: "https://www.sulekha.com/",
      category: "India",
      daHint: "Medium",
      napFields: "Name, city, phone, services",
      notes: "Good for service businesses.",
      priority: "Medium",
    },
    {
      id: "indiamart",
      name: "IndiaMART",
      url: "https://www.indiamart.com/",
      category: "India",
      daHint: "High",
      napFields: "Company, city, phone, products/services",
      notes: "Essential for B2B / manufacturing / wholesale.",
      priority: "High",
    },
    {
      id: "tradeindia",
      name: "TradeIndia",
      url: "https://www.tradeindia.com/",
      category: "India",
      daHint: "Medium",
      napFields: "Company, city, phone",
      notes: "B2B directory companion to IndiaMART.",
      priority: "Medium",
    },
    {
      id: "clutch",
      name: "Clutch",
      url: "https://clutch.co/",
      category: "Industry",
      daHint: "High",
      napFields: "Agency profile, services, reviews",
      notes: "High-trust agency listing. Collect client reviews.",
      priority: "High",
    },
    {
      id: "goodfirms",
      name: "GoodFirms",
      url: "https://www.goodfirms.co/",
      category: "Industry",
      daHint: "Medium",
      napFields: "Agency profile, services",
      notes: "Agency / software directory.",
      priority: "Medium",
    },
    {
      id: "designrush",
      name: "DesignRush",
      url: "https://www.designrush.com/",
      category: "Industry",
      daHint: "Medium",
      napFields: "Agency profile, niches",
      notes: "Apply for relevant categories only.",
      priority: "Medium",
    },
    {
      id: "sortlist",
      name: "Sortlist",
      url: "https://www.sortlist.com/",
      category: "Industry",
      daHint: "Medium",
      napFields: "Agency profile",
      notes: "Useful for agency discovery.",
      priority: "Low",
    },
    {
      id: "capterra",
      name: "Capterra (if SaaS product)",
      url: "https://www.capterra.com/",
      category: "Industry",
      daHint: "High",
      napFields: "Product listing",
      notes: "Only if you have a software product.",
      priority: "Low",
    },
    {
      id: "yelp",
      name: "Yelp",
      url: "https://biz.yelp.com/",
      category: "Review",
      daHint: "High",
      napFields: "Name, address, phone",
      notes: "Claim and close if not relevant for your market.",
      priority: "Medium",
    },
    {
      id: "facebook",
      name: "Facebook Business Page",
      url: "https://www.facebook.com/business",
      category: "General",
      daHint: "High",
      napFields: "Name, address, phone, website",
      notes: "Keep NAP identical to GMB.",
      priority: "High",
    },
    {
      id: "linkedin-company",
      name: "LinkedIn Company Page",
      url: "https://www.linkedin.com/company/setup/new/",
      category: "General",
      daHint: "High",
      napFields: "Company name, website, about",
      notes: "Strong brand + backlink signal.",
      priority: "High",
    },
    {
      id: "crunchbase",
      name: "Crunchbase",
      url: "https://www.crunchbase.com/",
      category: "Startup",
      daHint: "High",
      napFields: "Company, website, HQ",
      notes: "Claim existing profile if present.",
      priority: "Medium",
    },
    {
      id: "angel",
      name: "AngelList / Wellfound",
      url: "https://wellfound.com/",
      category: "Startup",
      daHint: "Medium",
      napFields: "Company, website",
      notes: "Optional for hiring/brand.",
      priority: "Low",
    },
    {
      id: "bbb",
      name: "Better Business Bureau (if US clients)",
      url: "https://www.bbb.org/",
      category: "Review",
      daHint: "Medium",
      napFields: "Business profile",
      notes: "Skip unless you serve US customers.",
      priority: "Low",
    },
    {
      id: "yellowpages-in",
      name: "India Yellow Pages / regional dirs",
      url: "https://www.indianyellowpages.com/",
      category: "India",
      daHint: "Low-Medium",
      napFields: "Name, city, phone",
      notes: "Pick 2-3 quality regional dirs; skip spam farms.",
      priority: "Low",
    },
    {
      id: "chamber",
      name: "Local chamber of commerce / association",
      url: "https://www.ficci.in/",
      category: "Local",
      daHint: "Medium",
      napFields: "Member listing",
      notes: "Industry associations often give dofollow member pages.",
      priority: "Medium",
    },
  ],
  templates: [
    {
      id: "directory-claim",
      name: "Directory profile claim / update",
      subject: "Claim / update listing for {{business_name}}",
      body: `Hi {{directory_team}},

Please claim or update our business listing on {{directory_name}}.

Business name: {{business_name}}
Website: {{website}}
Phone: {{phone}}
Email: {{email}}
Address: {{address}}
Category: {{category}}

NAP should match our Google Business Profile exactly. Happy to provide verification docs if needed.

Thanks,
{{your_name}}
{{your_title}}
{{business_name}}`,
    },
    {
      id: "guest-resource",
      name: "Resource / tool mention outreach",
      subject: "Free {{tool_name}} for your {{audience}} readers",
      body: `Hi {{name}},

I noticed your guide on {{their_topic}} at {{their_url}}.

We published a free {{tool_name}} that helps Indian businesses {{benefit}}:
{{tool_url}}

If it is useful for your readers, feel free to mention or link it. No payment or obligation - just a practical resource.

Happy to share a short blurb or screenshot if helpful.

Best,
{{your_name}}
DisplayAvenue`,
    },
    {
      id: "report-cite",
      name: "Industry report citation ask",
      subject: "Data point from India SME Digital Growth Report 2026",
      body: `Hi {{name}},

I am sharing our India SME Digital Growth Report 2026 - benchmarks on Google / Instagram / WhatsApp enquiry mix for Indian SMEs:

{{report_url}}

You are welcome to cite any chart or stat with attribution. If you publish a roundup or newsletter, I can send a quote or graphic.

Thanks,
{{your_name}}
DisplayAvenue`,
    },
    {
      id: "partner-listing",
      name: "Partner / association listing",
      subject: "Member listing request - {{business_name}}",
      body: `Hi {{association_team}},

{{business_name}} would like to be listed in your member / partner directory.

Website: {{website}}
Contact: {{email}} / {{phone}}
Short description: {{one_liner}}

Please share the submission form or next steps.

Regards,
{{your_name}}`,
    },
  ],
};
