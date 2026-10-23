#!/usr/bin/env python3
"""
Build unique SEO/AEO content for priority services, industries, and justified combos.
Keeps existing catalog items; enriches and adds only high-intent pages.
"""
from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "public" / "content"


def load(name: str) -> dict:
    return json.loads((CONTENT / f"{name}.json").read_text(encoding="utf-8"))


def save(name: str, data: dict) -> None:
    (CONTENT / f"{name}.json").write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )


def upsert(items: list, page: dict) -> None:
    for i, existing in enumerate(items):
        if existing.get("slug") == page["slug"]:
            # Preserve unknown fields; overwrite strategic ones
            merged = {**existing, **page}
            items[i] = merged
            return
    items.append(page)


COMPARISON = {
    "traditional": [
        "Posts and ads without a conversion system",
        "Monthly vanity reports",
        "Leads dumped into a spreadsheet",
        "No CRM or follow-up discipline",
    ],
    "ours": [
        "Strategy → acquisition → qualification",
        "Landing pages and tracking that connect to outcomes",
        "CRM + WhatsApp follow-up workflows",
        "Weekly optimisation against pipeline metrics",
    ],
}

# --- Priority new / enriched SERVICES ---
NEW_SERVICES = [
    {
        "slug": "aeo",
        "kind": "service",
        "title": "AEO Services",
        "category": "Search",
        "icon": "search",
        "color": "#0056ff",
        "eyebrow": "Answer Engine Optimisation",
        "architecture": "aeo",
        "primaryKeyword": "AEO services",
        "searchIntent": "commercial",
        "targetAudience": "Brands that want clear answers cited in AI search and answer engines",
        "decisionMaker": "CMO, Head of Digital, Founder",
        "headline": "Make your expertise easy for answer engines to understand and cite",
        "summary": "DisplayAvenue AEO programmes structure your services, entities, FAQs and proof so AI search and answer engines can surface accurate explanations of what you offer - without fake ranking promises.",
        "quickAnswer": "AEO (Answer Engine Optimisation) improves how clearly your business answers appear in AI-assisted search. We clarify entities, write direct answers, strengthen structured data, and connect proof - so buyers get accurate explanations of your offer.",
        "keyFacts": [
            "Focuses on clarity and citability - not guaranteed AI placements",
            "Works alongside technical SEO and content systems",
            "Best for high-consideration B2B and service brands",
        ],
        "painPoints": [
            "Buyers ask ChatGPT/Gemini/Google AI about your category - and competitors get mentioned",
            "Website content is vague, so answer engines cannot summarise you accurately",
            "Schema and entity signals are incomplete or inconsistent",
        ],
        "whenYouNeedThis": [
            "You sell complex services that need clear explanations",
            "You already invest in SEO and want AI-search readiness",
            "Your category has rising AI-assisted discovery",
        ],
        "uniqueAngle": "We treat AEO as an answer and entity system - not keyword stuffing for AI tools.",
        "ctaLabel": "Get My AEO Plan",
        "secondaryCtaLabel": "Call DisplayAvenue",
        "seoTitle": "AEO Services | Answer Engine Optimisation | DisplayAvenue",
        "seoDescription": "AEO services from DisplayAvenue: entity clarity, answer blocks, schema strategy and AI-search visibility - without fake guarantees.",
        "benefits": [
            {"title": "Direct answers", "desc": "40-80 word answer blocks for the questions buyers actually ask."},
            {"title": "Entity clarity", "desc": "Consistent naming of services, industries, locations and proof."},
            {"title": "Structured data", "desc": "Valid schema where it helps machines understand the page."},
            {"title": "SEO + AEO together", "desc": "Technical SEO foundations support durable discoverability."},
        ],
        "deliverables": [
            "AEO opportunity map for your category",
            "Answer blocks for priority buyer questions",
            "Entity and internal-linking plan",
            "Schema recommendations",
            "Content refresh backlog",
            "Monthly visibility review",
        ],
        "funnelSteps": [
            {"title": "Map questions", "desc": "List commercial questions buyers ask humans and AI tools."},
            {"title": "Clarify entities", "desc": "Align service names, industries, locations and proof points."},
            {"title": "Write answers", "desc": "Publish concise, accurate answer sections and FAQs."},
            {"title": "Structure & measure", "desc": "Add schema, strengthen links, review citations and search shifts."},
        ],
        "process": [
            {"title": "Audit", "desc": "Review how AI tools and search currently describe your category."},
            {"title": "Blueprint", "desc": "Prioritise questions, pages and entity fixes."},
            {"title": "Implement", "desc": "Ship answer blocks, FAQs, schema and internal links."},
            {"title": "Iterate", "desc": "Improve based on query trends and content gaps."},
        ],
        "faqs": [
            {"q": "What is AEO?", "a": "Answer Engine Optimisation improves how clearly your business answers can be extracted and cited by AI-assisted search. It is not a guarantee of inclusion in any AI product."},
            {"q": "How is AEO different from SEO?", "a": "SEO targets classic search rankings and technical discoverability. AEO emphasises clear answers, entities and structured explanations that answer engines can reuse."},
            {"q": "Do you guarantee ChatGPT mentions?", "a": "No. AI systems change often. We improve clarity and authority signals - we do not sell guaranteed placements."},
            {"q": "Who should invest in AEO first?", "a": "Service brands, B2B manufacturers, healthcare providers and education brands with complex offers benefit most."},
        ],
        "objections": [
            {"q": "Is this just renaming SEO?", "a": "No. Classic SEO still matters. AEO adds answer structure, entity consistency and question coverage on top of it."},
        ],
        "comparison": COMPARISON,
        "related": [
            {"label": "SEO Services", "href": "/services/seo"},
            {"label": "AI SEO", "href": "/services/ai-seo"},
            {"label": "Content Marketing", "href": "/services/content-marketing"},
            {"label": "Book consultation", "href": "/contact"},
        ],
        "metrics": [
            {"value": "Q&A", "label": "Answer-first pages"},
            {"value": "Schema", "label": "Valid structured data"},
            {"value": "SEO+", "label": "Works with search"},
        ],
    },
    {
        "slug": "performance-marketing",
        "kind": "service",
        "title": "Performance Marketing",
        "category": "Digital Marketing",
        "icon": "target",
        "color": "#db2777",
        "eyebrow": "Paid acquisition",
        "architecture": "ads",
        "primaryKeyword": "performance marketing agency",
        "headline": "Buy attention that becomes pipeline - not just clicks",
        "summary": "Performance marketing from DisplayAvenue connects Google, Meta and other paid channels to landing pages, CRM and follow-up so spend maps to qualified leads and revenue conversations.",
        "quickAnswer": "Performance marketing is paid acquisition managed against pipeline outcomes. We run ads, improve conversion assets, and connect leads to WhatsApp/CRM follow-up so you see cost per qualified conversation - not only CTR.",
        "ctaLabel": "Get My Performance Plan",
        "seoTitle": "Performance Marketing Agency | DisplayAvenue",
        "seoDescription": "Performance marketing for Indian businesses: Google & Meta ads, landing pages, tracking and CRM follow-up focused on qualified leads.",
        "targetAudience": "Businesses ready to invest in paid acquisition with clear offers",
        "decisionMaker": "Founder, Marketing Head, Growth Lead",
        "painPoints": [
            "Ad spend rises but sales calls stay flat",
            "Leads are unqualified or slow to follow up",
            "Creative and landing pages are not tested systematically",
        ],
        "whenYouNeedThis": [
            "You have a clear offer and can handle enquiries",
            "Organic channels alone are too slow",
            "You need measurable CAC and lead quality",
        ],
        "uniqueAngle": "We manage ads as a system with conversion assets and follow-up - not a disconnected media buy.",
        "benefits": [
            {"title": "Offer-led campaigns", "desc": "Ads start from a specific promise buyers can act on."},
            {"title": "Conversion assets", "desc": "Landing pages and forms designed for mobile enquiry."},
            {"title": "Lead routing", "desc": "WhatsApp, CRM and SLAs so leads do not die in inboxes."},
            {"title": "Transparent reporting", "desc": "Spend, CPL, qualified rate and next experiments."},
        ],
        "deliverables": [
            "Channel and offer plan",
            "Campaign build + tracking",
            "Landing page recommendations",
            "Creative testing backlog",
            "Weekly optimisation notes",
            "Monthly pipeline review",
        ],
        "funnelSteps": [
            {"title": "Offer & audience", "desc": "Define who should convert and what they get."},
            {"title": "Launch", "desc": "Ship campaigns with clean tracking."},
            {"title": "Convert", "desc": "Improve pages, forms and creative."},
            {"title": "Qualify & handoff", "desc": "Route leads into CRM/WhatsApp with clear ownership."},
        ],
        "process": [
            {"title": "Audit", "desc": "Review accounts, offers, tracking and sales capacity."},
            {"title": "Rebuild", "desc": "Structure campaigns for learning speed."},
            {"title": "Scale winners", "desc": "Increase budget only where quality holds."},
            {"title": "Systemise", "desc": "Document playbooks and reporting cadence."},
        ],
        "faqs": [
            {"q": "What channels do you run?", "a": "Primarily Google Ads and Meta Ads, with LinkedIn or YouTube when the audience justifies it."},
            {"q": "Do you guarantee leads?", "a": "No. We target efficient qualified conversations and improve continuously. Guarantees that ignore market conditions are marketing fiction."},
            {"q": "Is ad spend included?", "a": "Management fees and media spend are separate. We recommend budgets based on your offer and capacity."},
            {"q": "How fast can we learn?", "a": "Most accounts produce directional learning within 2-4 weeks if tracking and offer clarity are in place."},
        ],
        "comparison": COMPARISON,
        "related": [
            {"label": "Google Ads", "href": "/services/google-ads"},
            {"label": "Meta Ads", "href": "/services/meta-ads"},
            {"label": "CRO", "href": "/services/cro"},
            {"label": "Contact", "href": "/contact"},
        ],
        "metrics": [
            {"value": "CPL", "label": "Cost per lead focus"},
            {"value": "CRM", "label": "Follow-up connected"},
            {"value": "A/B", "label": "Creative testing"},
        ],
    },
    {
        "slug": "lead-generation",
        "kind": "service",
        "title": "Lead Generation",
        "category": "Digital Marketing",
        "icon": "target",
        "color": "#0284c7",
        "eyebrow": "Pipeline systems",
        "architecture": "lead-gen",
        "primaryKeyword": "lead generation agency",
        "headline": "Generate enquiries - then qualify and follow up like a sales team",
        "summary": "DisplayAvenue lead generation systems combine ads, SEO, landing pages, WhatsApp and CRM so you get fewer wasted leads and more sales conversations.",
        "quickAnswer": "Lead generation here means a full path: attract demand, capture enquiries, qualify them, and route follow-up. We do not stop at form fills.",
        "ctaLabel": "Get My Lead Generation Plan",
        "seoTitle": "Lead Generation Agency | Ads, SEO & CRM Follow-up | DisplayAvenue",
        "seoDescription": "Lead generation systems for Indian businesses: acquisition channels, qualification, WhatsApp and CRM follow-up focused on sales conversations.",
        "targetAudience": "Businesses that need a steady flow of sales conversations",
        "decisionMaker": "Founder, Sales Head, Marketing Head",
        "painPoints": [
            "Leads arrive but nobody follows up in time",
            "Forms collect junk or incomplete data",
            "No shared view of pipeline between marketing and sales",
        ],
        "whenYouNeedThis": [
            "Sales depends on inbound enquiries",
            "You run ads or SEO but conversion is weak",
            "You need qualification before expensive sales time",
        ],
        "uniqueAngle": "We design the handoff to sales - not just the ad click.",
        "benefits": [
            {"title": "Channel mix", "desc": "SEO, ads and content matched to your buyer journey."},
            {"title": "Qualification", "desc": "Forms and scripts that filter tyre-kickers."},
            {"title": "Speed-to-lead", "desc": "WhatsApp/CRM alerts so response time stays short."},
            {"title": "Reporting", "desc": "From spend to qualified conversation."},
        ],
        "deliverables": [
            "Lead system blueprint",
            "Landing page & form plan",
            "Channel launch plan",
            "CRM/WhatsApp routing",
            "Qualification rules",
            "Weekly pipeline review",
        ],
        "funnelSteps": [
            {"title": "Attract", "desc": "Reach buyers searching or scrolling with intent."},
            {"title": "Capture", "desc": "Convert interest into an enquiry on mobile-first pages."},
            {"title": "Qualify", "desc": "Score and route based on fit and urgency."},
            {"title": "Follow up", "desc": "Automate reminders and sales ownership."},
        ],
        "process": [
            {"title": "Map demand", "desc": "Identify where buyers already look for you."},
            {"title": "Build capture", "desc": "Pages, forms, tracking and routing."},
            {"title": "Launch channels", "desc": "SEO and/or paid with clear KPIs."},
            {"title": "Tighten loop", "desc": "Improve quality using sales feedback."},
        ],
        "faqs": [
            {"q": "Can you guarantee a lead volume?", "a": "We set targets and optimise toward them, but markets, offers and capacity affect volume. We avoid hard guarantees."},
            {"q": "Do you only run ads?", "a": "No. Lead systems can include SEO, content, WhatsApp and CRM - ads are one acquisition lever."},
            {"q": "Will this work for B2B?", "a": "Yes. B2B needs longer nurture, clearer qualification and CRM discipline - we design for that."},
            {"q": "What budget do I need?", "a": "It depends on ticket size and channel. We recommend ranges after reviewing your offer and sales capacity."},
        ],
        "comparison": COMPARISON,
        "related": [
            {"label": "Performance Marketing", "href": "/services/performance-marketing"},
            {"label": "Marketing Automation", "href": "/services/marketing-automation"},
            {"label": "CRM", "href": "/services/crm"},
            {"label": "Contact", "href": "/contact"},
        ],
        "metrics": [
            {"value": "SQL", "label": "Sales-qualified focus"},
            {"value": "<5m", "label": "Speed-to-lead goal"},
            {"value": "CRM", "label": "Pipeline visibility"},
        ],
    },
    {
        "slug": "technical-seo",
        "kind": "service",
        "title": "Technical SEO",
        "category": "Search",
        "icon": "gear",
        "color": "#0d9488",
        "eyebrow": "Crawl & index health",
        "architecture": "seo",
        "headline": "Fix the foundations Google needs to crawl, index and trust",
        "summary": "Technical SEO for sites that leak growth through slow pages, broken indexation, weak internal links or messy templates - especially multi-location and ecommerce properties.",
        "quickAnswer": "Technical SEO improves how search engines crawl and understand your site: speed, indexation, structure, redirects, schema and templates. Content still matters - but technical debt can block it.",
        "ctaLabel": "Get My Technical SEO Audit",
        "seoTitle": "Technical SEO Services | DisplayAvenue",
        "seoDescription": "Technical SEO audits and implementation: crawlability, Core Web Vitals, indexation, schema and template fixes.",
        "painPoints": [
            "Important pages are not indexed",
            "Site is slow on mobile",
            "Duplicate or thin template URLs confuse crawlers",
        ],
        "whenYouNeedThis": [
            "You have content but rankings stall",
            "You run ecommerce or large service catalogs",
            "You recently migrated CMS or domains",
        ],
        "benefits": [
            {"title": "Crawl clarity", "desc": "Clean paths for bots to discover money pages."},
            {"title": "Index control", "desc": "Noindex thin pages; protect canonicals."},
            {"title": "Performance", "desc": "Core Web Vitals improvements that help UX and SEO."},
            {"title": "Schema hygiene", "desc": "Valid structured data where it earns its place."},
        ],
        "deliverables": [
            "Technical SEO audit",
            "Priority fix backlog",
            "Robots/sitemap review",
            "Template recommendations",
            "CWV action list",
            "Re-crawl validation",
        ],
        "process": [
            {"title": "Crawl", "desc": "Map indexation, errors and templates."},
            {"title": "Prioritise", "desc": "Rank fixes by business impact."},
            {"title": "Implement", "desc": "Ship with developers or CMS changes."},
            {"title": "Validate", "desc": "Confirm indexation and performance shifts."},
        ],
        "faqs": [
            {"q": "Is technical SEO enough alone?", "a": "Rarely. It unlocks content and authority work. Thin sites still need better pages."},
            {"q": "How long do fixes take?", "a": "Quick wins can ship in days; template and CWV work may take weeks with your engineering capacity."},
            {"q": "Do you work with developers?", "a": "Yes. We provide tickets, acceptance criteria and validation."},
            {"q": "Will this improve rankings immediately?", "a": "Technical fixes remove blockers. Rankings still depend on relevance, content and competition."},
        ],
        "related": [
            {"label": "SEO Services", "href": "/services/seo"},
            {"label": "AEO Services", "href": "/services/aeo"},
            {"label": "Web Development", "href": "/services/web-development"},
            {"label": "Contact", "href": "/contact"},
        ],
        "metrics": [
            {"value": "CWV", "label": "Performance focus"},
            {"value": "Index", "label": "Coverage control"},
            {"value": "Schema", "label": "Valid markup"},
        ],
    },
    {
        "slug": "whatsapp-marketing",
        "kind": "service",
        "title": "WhatsApp Marketing",
        "category": "Digital Marketing",
        "icon": "chat",
        "color": "#16a34a",
        "eyebrow": "Conversation commerce",
        "architecture": "automation",
        "headline": "Turn WhatsApp into a follow-up and booking channel - not inbox chaos",
        "summary": "WhatsApp marketing and automation for Indian businesses: enquiry routing, templates, reminders and CRM sync so conversations become appointments and sales.",
        "quickAnswer": "WhatsApp marketing here means structured conversations: capture enquiries, auto-acknowledge, qualify, remind and hand off to humans. It is not spam blasting.",
        "ctaLabel": "Build My WhatsApp System",
        "seoTitle": "WhatsApp Marketing & Automation | DisplayAvenue",
        "seoDescription": "WhatsApp marketing systems: lead routing, templates, reminders and CRM sync for Indian businesses.",
        "painPoints": [
            "Leads message WhatsApp and wait hours",
            "No templates or ownership rules",
            "Conversations never enter CRM",
        ],
        "whenYouNeedThis": [
            "Most enquiries already arrive on WhatsApp",
            "You need appointment or site-visit reminders",
            "Sales misses follow-ups",
        ],
        "benefits": [
            {"title": "Speed-to-lead", "desc": "Instant acknowledgement and routing."},
            {"title": "Templates", "desc": "Compliant message flows for common journeys."},
            {"title": "CRM sync", "desc": "Conversations become pipeline records."},
            {"title": "Handoff", "desc": "Humans take over when intent is high."},
        ],
        "deliverables": [
            "WhatsApp journey map",
            "Template set",
            "Routing rules",
            "CRM/API integration plan",
            "Training for sales team",
            "Monthly conversation review",
        ],
        "funnelSteps": [
            {"title": "Capture", "desc": "Ads, website and Google push to WhatsApp."},
            {"title": "Acknowledge", "desc": "Auto-reply with next step."},
            {"title": "Qualify", "desc": "Ask fit questions or book a slot."},
            {"title": "Close loop", "desc": "Reminders + CRM notes for humans."},
        ],
        "process": [
            {"title": "Audit chats", "desc": "See where conversations die today."},
            {"title": "Design flows", "desc": "Map templates and ownership."},
            {"title": "Integrate", "desc": "Connect API/CRM tools."},
            {"title": "Train & improve", "desc": "Coach team and tighten scripts."},
        ],
        "faqs": [
            {"q": "Is bulk spam allowed?", "a": "We design opt-in, useful journeys. Spam harms trust and can violate platform rules."},
            {"q": "Do you set up WhatsApp Business API?", "a": "Yes - when volume and use cases justify API vs Business App."},
            {"q": "Can this work with Meta Ads?", "a": "Yes. Click-to-WhatsApp ads pair well with routing and CRM."},
            {"q": "Will this replace my sales team?", "a": "No. Automation handles speed and reminders; humans close."},
        ],
        "related": [
            {"label": "Marketing Automation", "href": "/services/marketing-automation"},
            {"label": "Meta Ads", "href": "/services/meta-ads"},
            {"label": "CRM", "href": "/services/crm"},
            {"label": "Contact", "href": "/contact"},
        ],
        "metrics": [
            {"value": "API", "label": "When volume needs it"},
            {"value": "CRM", "label": "Conversation logging"},
            {"value": "SLA", "label": "Response targets"},
        ],
    },
]

# --- Industry enrichments (unique IA) ---
INDUSTRY_ENRICH = {
    "manufacturing": {
        "architecture": "manufacturing",
        "headline": "Generate qualified RFQs for manufacturers - then follow them through CRM",
        "summary": "DisplayAvenue helps manufacturers attract procurement searches, capture RFQs, and run sales follow-up systems across India and export markets.",
        "quickAnswer": "Manufacturing marketing here focuses on qualified enquiries from engineers, dealers and purchase teams - via SEO, Google Ads, websites and CRM - not consumer-style vanity campaigns.",
        "ctaLabel": "Build My Manufacturing Lead System",
        "seoTitle": "Manufacturing Digital Marketing | RFQs & B2B Leads | DisplayAvenue",
        "seoDescription": "Digital marketing for manufacturers: industrial SEO, Google Ads, RFQ landing pages and CRM follow-up for qualified B2B enquiries.",
        "targetAudience": "OEMs, machine builders, component makers and industrial brands",
        "decisionMaker": "Owner, Sales Director, Marketing Manager",
        "painPoints": [
            "Website gets traffic but few RFQs",
            "IndiaMART leads are noisy; Google is underused",
            "Quotations stall without CRM follow-up",
        ],
        "whenYouNeedThis": [
            "You sell machinery, components or industrial services",
            "Sales cycles are long and multi-stakeholder",
            "You need domestic and/or export enquiries",
        ],
        "uniqueAngle": "We design for procurement journeys and RFQ quality - not salon-style lead gen.",
        "keyFacts": [
            "Buyer: procurement managers, engineers, dealers",
            "Channels: Google, SEO, catalogs, LinkedIn when fit",
            "Success metric: qualified RFQs and quotation pipeline",
        ],
        "funnelSteps": [
            {"title": "Discover", "desc": "Buyers search for machines, specs and suppliers."},
            {"title": "Enquire", "desc": "RFQ forms capture capacity, specs and location."},
            {"title": "Qualify", "desc": "Sales filters fit and urgency."},
            {"title": "Quote & follow", "desc": "CRM reminders keep long cycles alive."},
        ],
        "comparison": COMPARISON,
        "faqs": [
            {"q": "Can SEO generate B2B manufacturing leads?", "a": "Yes, when product pages, technical content and local/export intent are structured properly. It is slower than ads but compounds."},
            {"q": "Do you work with IndiaMART?", "a": "We can complement marketplace leads with Google/SEO systems that own your brand funnel."},
            {"q": "What about export enquiries?", "a": "We plan English product pages, enquiry forms and follow-up for international buyers when relevant."},
            {"q": "How do you measure success?", "a": "Qualified RFQs, sales-accepted leads, quotation volume and revenue influenced - not just sessions."},
        ],
    },
    "real-estate": {
        "architecture": "real-estate",
        "headline": "Generate qualified real estate enquiries - then automate what happens next",
        "summary": "Acquisition and automation systems for builders, developers and brokers: Meta/Google demand, landing pages, qualification, WhatsApp and CRM for site visits.",
        "quickAnswer": "Real estate digital marketing should connect ads to qualification and site-visit follow-up. DisplayAvenue builds that full path - not just lead dumps.",
        "ctaLabel": "Get a Real Estate Lead Plan",
        "seoTitle": "Real Estate Digital Marketing & Lead Generation | DisplayAvenue",
        "seoDescription": "Real estate marketing systems: Meta Ads, Google Ads, landing pages, WhatsApp qualification and CRM for site visits.",
        "targetAudience": "Builders, developers, channel partners and premium brokers",
        "decisionMaker": "Marketing Head, Sales Head, Developer partner",
        "painPoints": [
            "High CPL with low site-visit show rates",
            "Leads shared across agents with no ownership",
            "Retargeting and nurture are inconsistent",
        ],
        "funnelSteps": [
            {"title": "Demand", "desc": "Reach buyers researching projects and locations."},
            {"title": "Qualify", "desc": "Budget, timeline and intent filters."},
            {"title": "Visit", "desc": "Schedule and remind for site visits."},
            {"title": "Retarget", "desc": "Stay present until booking decisions."},
        ],
        "comparison": COMPARISON,
        "faqs": [
            {"q": "Meta or Google for real estate?", "a": "Often both: Meta for demand creation, Google for high-intent project and locality searches."},
            {"q": "How do you improve site-visit rates?", "a": "Faster WhatsApp response, clearer qualification, reminders and sales SLAs."},
            {"q": "Can you handle multiple projects?", "a": "Yes - with project-specific creatives, landing pages and CRM pipelines."},
            {"q": "Do you guarantee bookings?", "a": "No. We optimise for qualified visits and sales-ready conversations."},
        ],
    },
    "healthcare": {
        "architecture": "healthcare",
        "headline": "Help patients find you - then turn discovery into appointments",
        "summary": "Responsible healthcare marketing for clinics and hospitals: local SEO, Google visibility, appointment funnels and reminder automation - without medical outcome promises.",
        "quickAnswer": "Healthcare marketing should improve discovery and appointment conversion while staying compliant. We focus on local search, trust content and booking follow-up - never treatment guarantees.",
        "ctaLabel": "Get a Healthcare Growth Plan",
        "seoTitle": "Healthcare Digital Marketing | Clinics & Hospitals | DisplayAvenue",
        "seoDescription": "Healthcare digital marketing: local SEO, Google Business Profile, appointment funnels and reminders for clinics and hospitals.",
        "targetAudience": "Clinics, specialty practices and hospitals",
        "decisionMaker": "Clinic owner, Hospital marketing manager",
        "painPoints": [
            "Patients cannot find you on Google Maps",
            "Phone enquiries are missed after hours",
            "Reviews and trust signals are weak",
        ],
        "funnelSteps": [
            {"title": "Discover", "desc": "Local search and Maps visibility."},
            {"title": "Trust", "desc": "Clear service pages and reputation."},
            {"title": "Book", "desc": "Call, form or WhatsApp appointment paths."},
            {"title": "Remind", "desc": "Reduce no-shows with follow-up."},
        ],
        "faqs": [
            {"q": "Do you promise patient outcomes?", "a": "No. We market discovery and appointments responsibly. Clinical claims belong to licensed practitioners."},
            {"q": "Is Meta Ads allowed for healthcare?", "a": "Some categories have ad policy limits. We design compliant campaigns and prefer search/local when safer."},
            {"q": "Can you help multi-location clinics?", "a": "Yes - location pages, GBP optimisation and call tracking per branch."},
            {"q": "What about appointment automation?", "a": "Reminders and WhatsApp confirmations reduce no-shows when integrated carefully."},
        ],
    },
    "education": {
        "architecture": "education",
        "headline": "Fill seats with an admission funnel - not random form fills",
        "summary": "Education marketing for schools, coaching institutes and study-abroad brands: Meta/Google acquisition, counselling qualification and admission follow-up.",
        "quickAnswer": "Education lead gen should follow Ad → Lead → Qualification → Counselling → Demo → Application → Admission. We build that funnel with tracking and CRM discipline.",
        "ctaLabel": "Get an Education Lead Plan",
        "seoTitle": "Education Digital Marketing & Admission Funnels | DisplayAvenue",
        "seoDescription": "Digital marketing for schools and coaching brands: admission funnels, Meta Ads, SEO and counselling follow-up.",
        "targetAudience": "Schools, coaching institutes, EdTech and study-abroad consultants",
        "funnelSteps": [
            {"title": "Attract", "desc": "Reach parents and students with clear offers."},
            {"title": "Capture", "desc": "Mobile forms and WhatsApp enquiries."},
            {"title": "Counsel", "desc": "Qualify and book counselling/demo."},
            {"title": "Admit", "desc": "Nurture until application and fee."},
        ],
        "faqs": [
            {"q": "How do you reduce lead leakage?", "a": "Faster response, CRM stages, counsellor SLAs and reminder automation."},
            {"q": "Which channel works for coaching?", "a": "Often Meta for demand and Google for high-intent course searches - mix depends on city and course."},
            {"q": "Can you support multiple centres?", "a": "Yes, with location-level creatives and call routing."},
            {"q": "Do you guarantee admissions?", "a": "No. We improve qualified counselling volume and funnel conversion."},
        ],
    },
    "ecommerce": {
        "architecture": "ecommerce",
        "headline": "Grow ecommerce revenue across traffic, conversion and retention",
        "summary": "Ecommerce marketing systems for D2C and online stores: SEO, paid social/search, CRO, cart recovery and retention automation.",
        "quickAnswer": "Ecommerce growth needs more than ads. We connect product discovery, conversion rate, abandoned-cart recovery and retention so revenue compounds.",
        "ctaLabel": "Get My Ecommerce Growth Plan",
        "seoTitle": "Ecommerce Marketing Agency | SEO, Ads & CRO | DisplayAvenue",
        "seoDescription": "Ecommerce marketing: Shopify/store growth via SEO, Meta Ads, Google Shopping, CRO and retention automation.",
        "funnelSteps": [
            {"title": "Traffic", "desc": "SEO + paid product discovery."},
            {"title": "Convert", "desc": "CRO on PDP and checkout."},
            {"title": "Recover", "desc": "Abandoned cart and WhatsApp nudges."},
            {"title": "Retain", "desc": "Repeat purchase and LTV flows."},
        ],
        "faqs": [
            {"q": "Shopify or custom - can you help?", "a": "Yes. We work with Shopify, WooCommerce and custom stacks."},
            {"q": "Do you run Google Shopping?", "a": "Yes, when product feeds and margins support it."},
            {"q": "How do you handle low AOV?", "a": "We focus on efficiency, bundles and retention - not blind spend."},
            {"q": "Can you integrate WhatsApp commerce?", "a": "Yes for support, recovery and order updates where appropriate."},
        ],
    },
}

# Justified industry × service combos
COMBOS = [
    ("real-estate", "lead-generation", "real-estate", "Generate Qualified Real Estate Enquiries - Then Automate Follow-up",
     "Real estate lead generation systems that connect Meta/Google demand to qualification, WhatsApp and site-visit CRM.",
     "Get a Real Estate Lead Plan"),
    ("real-estate", "meta-ads", "ads", "Meta Ads for Real Estate Projects That Need Site Visits",
     "Meta Ads creative, landing pages and WhatsApp routing for builders and developers focused on qualified visits.",
     "Get My Real Estate Meta Plan"),
    ("real-estate", "seo", "seo", "Real Estate SEO for Project and Locality Demand",
     "SEO for project pages, locality intent and developer brand search - built for long sales cycles.",
     "Get Real Estate SEO Plan"),
    ("real-estate", "marketing-automation", "automation", "Real Estate Marketing Automation for Lead Follow-up",
     "Automate acknowledgements, reminders and CRM stages so real estate leads do not go cold.",
     "Automate My Real Estate Follow-up"),
    ("real-estate", "google-ads", "ads", "Google Ads for High-Intent Real Estate Searches",
     "Search and Performance Max structures for project and locality keywords with conversion tracking.",
     "Get Real Estate Google Ads Plan"),
    ("manufacturing", "lead-generation", "manufacturing", "Manufacturing Lead Generation for Qualified RFQs",
     "B2B lead systems for manufacturers: SEO, Google Ads, RFQ pages and CRM quotation follow-up.",
     "Build My Manufacturing Lead System"),
    ("manufacturing", "seo", "seo", "Manufacturing SEO for Product and Industrial Intent",
     "Industrial SEO for machine, component and capability pages that attract procurement searches.",
     "Get Manufacturing SEO Plan"),
    ("manufacturing", "google-ads", "ads", "Google Ads for Manufacturers Who Need RFQs",
     "Paid search for industrial keywords with RFQ forms and sales handoff.",
     "Get Manufacturing Ads Plan"),
    ("manufacturing", "crm", "automation", "Manufacturing CRM Automation for Quotation Follow-up",
     "CRM stages, reminders and ownership so long manufacturing sales cycles stay organised.",
     "Build My Manufacturing CRM"),
    ("healthcare", "seo", "healthcare", "Healthcare SEO for Clinics and Hospitals",
     "Local and service-page SEO that helps patients find you - without medical outcome claims.",
     "Get Healthcare SEO Plan"),
    ("healthcare", "lead-generation", "healthcare", "Healthcare Lead Generation for Appointments",
     "Responsible patient enquiry systems: local search, landing pages and appointment follow-up.",
     "Get Healthcare Lead Plan"),
    ("healthcare", "local-seo", "seo", "Local SEO for Clinics and Multi-Location Healthcare",
     "Google Business Profile and local pages that improve discovery for nearby patients.",
     "Get Clinic Local SEO Plan"),
    ("education", "meta-ads", "ads", "Meta Ads for Schools and Coaching Admissions",
     "Admission-focused Meta campaigns with counselling qualification and CRM follow-up.",
     "Get Education Meta Ads Plan"),
    ("education", "lead-generation", "education", "Education Lead Generation for Admissions Teams",
     "Admission funnels from ad to counselling to application - with less lead leakage.",
     "Get Education Lead Plan"),
    ("ecommerce", "seo", "ecommerce", "Ecommerce SEO for Product Discovery and Revenue",
     "Category and product SEO plus technical hygiene for online stores.",
     "Get Ecommerce SEO Plan"),
    ("ecommerce", "meta-ads", "ads", "Meta Ads for Ecommerce and D2C Brands",
     "Prospecting and retargeting systems tied to product feed and ROAS discipline.",
     "Get Ecommerce Meta Plan"),
    ("ecommerce", "cro", "ecommerce", "Ecommerce Conversion Rate Optimisation",
     "PDP, cart and checkout experiments that lift revenue without only buying more traffic.",
     "Get Ecommerce CRO Plan"),
    ("automotive", "lead-generation", "lead-gen", "Automotive Lead Generation for Dealers and Workshops",
     "Lead systems for dealerships, EV dealers and detailing studios with WhatsApp follow-up.",
     "Get Automotive Lead Plan"),
    ("hospitality", "seo", "seo", "Hotel and Hospitality SEO for Bookings Discovery",
     "SEO for hotels, resorts and stays focused on discovery and booking intent.",
     "Get Hospitality SEO Plan"),
    ("construction", "lead-generation", "lead-gen", "Construction Lead Generation for Builders and Contractors",
     "B2B and project enquiry systems for construction and contracting businesses.",
     "Get Construction Lead Plan"),
    ("finance", "seo", "seo", "SEO for CAs, Advisors and Financial Services",
     "Compliant SEO for professional finance brands focused on trust and enquiry quality.",
     "Get Finance SEO Plan"),
    ("travel", "lead-generation", "lead-gen", "Travel Lead Generation for Agencies and Tour Operators",
     "Package enquiry systems with WhatsApp qualification and follow-up for travel brands.",
     "Get Travel Lead Plan"),
    ("saas", "lead-generation", "lead-gen", "B2B SaaS Lead Generation Systems",
     "Demo and trial pipelines combining content, ads and CRM nurture for SaaS teams.",
     "Get SaaS Lead Plan"),
    ("b2b", "seo", "seo", "B2B SEO for Professional and Industrial Services",
     "SEO that targets decision-makers researching vendors and service partners.",
     "Get B2B SEO Plan"),
]


def make_combo(industry_slug, service_slug, arch, headline, summary, cta):
    industry_title = industry_slug.replace("-", " ").title()
    service_title = service_slug.replace("-", " ").title()
    title = f"{industry_title} {service_title}"
    slug = f"{industry_slug}-{service_slug}"
    return {
        "slug": slug,
        "kind": "combo",
        "title": title,
        "category": "Industry × Service",
        "icon": "target",
        "color": "#0056ff",
        "eyebrow": f"{industry_title} · {service_title}",
        "architecture": arch,
        "industrySlug": industry_slug,
        "serviceSlug": service_slug,
        "headline": headline,
        "summary": summary,
        "quickAnswer": summary,
        "ctaLabel": cta,
        "secondaryCtaLabel": "WhatsApp Us",
        "secondaryCtaHref": "https://wa.me/919222122333",
        "seoTitle": f"{title} | DisplayAvenue",
        "seoDescription": summary[:155],
        "primaryKeyword": f"{industry_title} {service_title}".lower(),
        "searchIntent": "commercial",
        "targetAudience": f"{industry_title} businesses that need {service_title.lower()}",
        "uniqueAngle": f"Built specifically for {industry_title.lower()} buying journeys - not a generic {service_title.lower()} template.",
        "painPoints": [
            f"Generic {service_title.lower()} agencies ignore {industry_title.lower()} sales reality",
            "Leads arrive without qualification or follow-up ownership",
            "Reporting stops at clicks instead of pipeline",
        ],
        "whenYouNeedThis": [
            f"You sell in {industry_title.lower()} and need a dedicated growth system",
            f"You already tried generic {service_title.lower()} with weak results",
            "You want acquisition connected to CRM/WhatsApp follow-up",
        ],
        "benefits": [
            {"title": "Industry-specific messaging", "desc": f"Copy and offers match how {industry_title.lower()} buyers decide."},
            {"title": "Channel fit", "desc": f"{service_title} executed for this sector's intent patterns."},
            {"title": "Conversion path", "desc": "Landing pages and forms designed for mobile enquiry."},
            {"title": "Follow-up system", "desc": "WhatsApp/CRM routing so sales can act fast."},
        ],
        "deliverables": [
            f"{title} strategy brief",
            "Channel and KPI plan",
            "Landing page / form recommendations",
            "Tracking and attribution setup",
            "Follow-up workflow outline",
            "Weekly optimisation notes",
        ],
        "process": [
            {"title": "Discover", "desc": f"Audit current {industry_title.lower()} acquisition and sales handoff."},
            {"title": "Design", "desc": "Define offer, pages, tracking and qualification."},
            {"title": "Launch", "desc": f"Implement {service_title.lower()} with clear ownership."},
            {"title": "Optimise", "desc": "Improve quality using sales feedback."},
        ],
        "funnelSteps": [
            {"title": "Attract", "desc": "Reach high-intent buyers in this industry."},
            {"title": "Capture", "desc": "Convert to enquiry on a focused page."},
            {"title": "Qualify", "desc": "Filter for fit and urgency."},
            {"title": "Convert", "desc": "Sales follow-up with reminders and CRM."},
        ],
        "faqs": [
            {"q": f"Is this different from your general {service_title} page?", "a": f"Yes. This page and plan are scoped to {industry_title.lower()} buying cycles, objections and channels."},
            {"q": "Do you guarantee results?", "a": "No. We set measurable targets and optimise toward qualified conversations."},
            {"q": "How fast can we start?", "a": "Most engagements kick off within 5-7 business days after scope confirmation."},
            {"q": "Can this connect to our CRM?", "a": "Yes - HubSpot, Zoho, custom CRMs and WhatsApp workflows are common."},
        ],
        "comparison": COMPARISON,
        "related": [
            {"label": f"{industry_title} overview", "href": f"/industries/{industry_slug}"},
            {"label": f"{service_title} service", "href": f"/services/{service_slug}"},
            {"label": "All industries", "href": "/industries"},
            {"label": "Contact", "href": "/contact"},
        ],
        "metrics": [
            {"value": "Intent", "label": "Commercial search"},
            {"value": "CRM", "label": "Follow-up ready"},
            {"value": "Unique", "label": "Industry-specific"},
        ],
        "indexable": True,
    }


def enrich_existing_services(items: list) -> None:
    """Add AEO fields to key existing services without wiping them."""
    patches = {
        "seo": {
            "architecture": "seo",
            "quickAnswer": "SEO improves how buyers find you on Google through technical health, content and authority. DisplayAvenue ties SEO to enquiries - not only rankings.",
            "ctaLabel": "Get My SEO Audit",
            "seoTitle": "SEO Services | Technical, Content & Local | DisplayAvenue",
            "comparison": COMPARISON,
        },
        "google-ads": {
            "architecture": "ads",
            "quickAnswer": "Google Ads captures high-intent searches. We connect campaigns to landing pages, tracking and follow-up so spend maps to qualified conversations.",
            "ctaLabel": "Get My Google Ads Plan",
        },
        "meta-ads": {
            "architecture": "ads",
            "quickAnswer": "Meta Ads create demand and retarget interest. We pair creative testing with conversion assets and WhatsApp/CRM routing.",
            "ctaLabel": "Get My Meta Ads Plan",
        },
        "ai-automation": {
            "architecture": "automation",
            "quickAnswer": "AI automation removes repetitive marketing and sales busywork - lead routing, follow-ups, content assists - while humans keep judgement calls.",
            "ctaLabel": "Build My Automation System",
        },
        "marketing-automation": {
            "architecture": "automation",
            "quickAnswer": "Marketing automation connects forms, email, WhatsApp and CRM so leads get timely follow-up without manual chaos.",
            "ctaLabel": "Build My Marketing Automation",
        },
        "cro": {
            "architecture": "web",
            "quickAnswer": "CRO improves the percentage of visitors who enquire or buy - through page structure, offers, forms and experiments.",
            "ctaLabel": "Get a CRO Plan",
        },
        "local-seo": {
            "architecture": "seo",
            "quickAnswer": "Local SEO helps nearby customers find you on Google Search and Maps via Google Business Profile, local pages and reviews.",
            "ctaLabel": "Get Local SEO Plan",
        },
        "ai-seo": {
            "architecture": "aeo",
            "quickAnswer": "AI SEO / GEO work strengthens how your brand is represented in AI-assisted search - alongside classic SEO foundations.",
            "ctaLabel": "Get AI SEO Plan",
            "related": [
                {"label": "AEO Services", "href": "/services/aeo"},
                {"label": "SEO Services", "href": "/services/seo"},
                {"label": "Contact", "href": "/contact"},
            ],
        },
    }
    for item in items:
        patch = patches.get(item.get("slug"))
        if patch:
            item.update(patch)


def build_registry(services, industries, combos) -> list:
    rows = []
    for s in services:
        rows.append({
            "url": f"/services/{s['slug']}/",
            "type": "service",
            "title": s["title"],
            "intent": s.get("searchIntent") or "commercial",
            "status": "published",
            "indexable": s.get("indexable", True),
            "primaryCTA": s.get("ctaLabel") or "Get Free Proposal",
            "architecture": s.get("architecture") or "default",
        })
    for s in industries:
        rows.append({
            "url": f"/industries/{s['slug']}/",
            "type": "industry",
            "title": s["title"],
            "intent": "commercial",
            "status": "published",
            "indexable": True,
            "primaryCTA": s.get("ctaLabel") or "Get Free Proposal",
            "architecture": s.get("architecture") or "industry",
        })
    for s in combos:
        rows.append({
            "url": f"/industries/{s['industrySlug']}/{s['serviceSlug']}/",
            "type": "industry-service",
            "industry": s.get("industrySlug"),
            "service": s.get("serviceSlug"),
            "title": s["title"],
            "intent": "commercial",
            "status": "published",
            "indexable": True,
            "canonical": f"/industries/{s['industrySlug']}/{s['serviceSlug']}/",
            "primaryCTA": s.get("ctaLabel"),
            "architecture": s.get("architecture"),
        })
    return rows


def main():
    services_doc = load("services")
    industries_doc = load("industries")
    services = services_doc["items"]
    industries = industries_doc["items"]

    # Add / refresh priority services
    for page in NEW_SERVICES:
        upsert(services, page)
    enrich_existing_services(services)

    # Enrich priority industries
    for ind in industries:
        slug = ind.get("slug")
        if slug in INDUSTRY_ENRICH:
            ind.update(INDUSTRY_ENRICH[slug])
            # Link to relevant combos
            related = list(ind.get("related") or [])
            for industry_slug, service_slug, *_rest in COMBOS:
                if industry_slug == slug:
                    label = service_slug.replace("-", " ").title()
                    href = f"/industries/{industry_slug}/{service_slug}"
                    if not any(r.get("href") == href for r in related):
                        related.append({"label": f"{ind['title']} {label}", "href": href})
            ind["related"] = related[:10]

    # Combos
    combo_items = [make_combo(*row) for row in COMBOS]
    combos_doc = {"items": combo_items}

    # Cross-link services to combos
    for s in services:
        slug = s.get("slug")
        related = list(s.get("related") or [])
        for industry_slug, service_slug, *_ in COMBOS:
            if service_slug == slug:
                href = f"/industries/{industry_slug}/{service_slug}"
                label = f"{industry_slug.replace('-', ' ').title()} {s['title']}"
                if not any(r.get("href") == href for r in related):
                    related.append({"label": label, "href": href})
        s["related"] = related[:10]

    save("services", {"items": services})
    save("industries", {"items": industries})
    save("combos", combos_doc)

    registry = {
        "generatedAt": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "counts": {
            "services": len(services),
            "industries": len(industries),
            "combos": len(combo_items),
        },
        "pages": build_registry(services, industries, combo_items),
    }
    save("page-registry", registry)
    print(
        "OK",
        "services", len(services),
        "industries", len(industries),
        "combos", len(combo_items),
        "registry", len(registry["pages"]),
    )


if __name__ == "__main__":
    main()
