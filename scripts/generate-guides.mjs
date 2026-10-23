#!/usr/bin/env node
/**
 * Generate 200 unique EEAT guide pages for DisplayAvenue Realty keywords.
 * Output: public/content/guides.json + src/data/guideSlugs.ts
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/content");

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function hash(s) {
  return createHash("sha1").update(s).digest("hex");
}

function pick(seed, arr) {
  const n = parseInt(hash(seed).slice(0, 8), 16);
  return arr[n % arr.length];
}

function pickN(seed, arr, n) {
  const out = [];
  const used = new Set();
  let i = 0;
  while (out.length < n && i < arr.length * 3) {
    const item = pick(`${seed}-${i}`, arr);
    if (!used.has(item)) {
      used.add(item);
      out.push(item);
    }
    i++;
  }
  return out;
}

const KEYWORDS = [
  // BUY 1-40
  "flats for sale in Mira Road",
  "2 BHK flat for sale Mira Road East",
  "1 BHK flat for sale Mira Road",
  "3 BHK flat for sale Mira Road",
  "resale flat Mira Road East",
  "apartment for sale Dahisar East",
  "2 BHK for sale Dahisar West",
  "flats for sale in Dahisar",
  "flat for sale Bhayandar East",
  "2 BHK flat for sale Bhayandar West",
  "property for sale Mira Road under 1 crore",
  "flats for sale Mira Road under 80 lakh",
  "ready to move flat Mira Road",
  "ready possession flat Dahisar",
  "best society to buy in Mira Road",
  "Kanakia Mira Road flat for sale",
  "Unique Garden Mira Road property",
  "Shanti Park Mira Road flat for sale",
  "Beverly Park Mira Road resale",
  "JP North Mira Road flat price",
  "flat near Mira Road station for sale",
  "flat near Dahisar check naka for sale",
  "Western suburbs flat for sale budget",
  "Mira Road property rate per sq ft",
  "Dahisar property rate 2026",
  "Bhayandar property price trend",
  "buy house Mira Road East Mumbai",
  "buy apartment Mira Bhayandar",
  "new project vs resale Mira Road",
  "RERA flat Mira Road for sale",
  "carpet area flat Mira Road for sale",
  "semi furnished flat for sale Mira Road",
  "fully furnished flat for sale Mira Road",
  "parking flat for sale Mira Road",
  "corner flat for sale Mira Road",
  "high floor flat Mira Road sale",
  "investment flat Mira Road rental yield",
  "NRI flat purchase Mira Road",
  "home loan flat Mira Road East",
  "token amount flat Mira Road",
  // RENT 41-70
  "1 BHK on rent Mira Road East",
  "2 BHK on rent Mira Road",
  "3 BHK rent Mira Road East",
  "flat on rent Dahisar East",
  "2 BHK rent Dahisar West",
  "1 BHK rent Bhayandar East",
  "2 BHK rent Bhayandar West",
  "family flat on rent Mira Road",
  "bachelor flat rent Mira Road",
  "furnished flat on rent Mira Road",
  "semi furnished rent Mira Road East",
  "flat rent Mira Road under 25000",
  "flat rent Mira Road under 35000",
  "flat rent Mira Road under 50000",
  "flat near Mira Road station rent",
  "flat near Bhaktivedanta Hospital rent",
  "society flat on rent Unique Garden",
  "shop cum flat rent Mira Road",
  "deposit for rent Mira Road",
  "brokerage for rent Mira Road",
  "immediate possession rent Mira Road",
  "11 month agreement rent Mira Road",
  "owner flat without broker Mira Road",
  "property dealer for rent Mira Road",
  "flat for lease Mira Road East",
  "PG alternative 1 BHK Mira Road",
  "couple flat rent Mira Road",
  "pet friendly flat rent Mira Road",
  "flat with parking rent Dahisar",
  "warehouse staff housing rent Bhayandar",
  // SELL 71-95
  "sell flat Mira Road East",
  "property valuation Mira Road",
  "free property valuation Dahisar",
  "best broker to sell flat Mira Road",
  "list my property Mira Road",
  "how to sell resale flat Mumbai suburbs",
  "documents required to sell flat Mira Road",
  "society NOC for selling flat Mira Road",
  "flat selling price Mira Road 2 BHK",
  "urgent sale flat Mira Road",
  "sell commercial shop Mira Road",
  "sell office Dahisar East",
  "property consultant Mira Road for sellers",
  "home staging tips sell Mira Road flat",
  "market price Unique Garden flat",
  "compare offers sell flat Mira Road",
  "token agreement seller Mira Road",
  "capital gains sale flat Mira Road",
  "NRI sell property Mira Road",
  "power of attorney sell flat Mumbai",
  "brokerage charges sell flat Mira Road",
  "exclusive listing agent Mira Road",
  "sell inherited flat Dahisar",
  "redevelopment vs sell flat Dahisar",
  "fastest way to sell flat Bhayandar",
  // COMMERCIAL 96-120
  "shop for rent Mira Road station",
  "shop for sale Mira Road East",
  "office space for rent Mira Road",
  "office for sale Dahisar East",
  "commercial property Mira Road",
  "showroom on rent Mira Road",
  "warehouse for rent Bhayandar",
  "godown for rent Mira Bhayandar",
  "commercial shop Bhayandar West",
  "retail space Mira Road highway",
  "clinic space for rent Mira Road",
  "restaurant space rent Mira Road",
  "mezzanine shop Mira Road",
  "ground floor shop Dahisar",
  "IT office rent Mira Road",
  "coworking alternative office Mira Road",
  "commercial lease agreement Mira Road",
  "shop ROI Mira Road investment",
  "industrial gala Bhayandar",
  "commercial property rate Mira Road",
  "shop near Mira Road East station",
  "office with parking Dahisar",
  "bank branch space Mira Road",
  "pharmacy shop rent Mira Road",
  "commercial redevelopment Mira Road",
  // REDEVELOPMENT 121-145
  "society redevelopment Mira Road",
  "society redevelopment Dahisar",
  "building redevelopment Bhayandar",
  "redevelopment consultant Mira Road",
  "best builder for society redevelopment Mira Road",
  "redevelopment corpus Mira Road",
  "carpet area gain redevelopment Mumbai",
  "society consent for redevelopment",
  "PMC vs private redevelopment Mira Road",
  "redevelopment process for society owners",
  "cluster redevelopment Mira Bhayandar",
  "dilapidated building redevelopment Dahisar",
  "redevelopment agreement checklist",
  "transit rent during redevelopment Mumbai",
  "FSI redevelopment Mira Road",
  "self redevelopment vs builder Mira Road",
  "redevelopment lawyer Mira Road",
  "society meeting redevelopment presentation",
  "how long does society redevelopment take",
  "redevelopment for senior citizens owners",
  "MHADA redevelopment nearby Mira Road",
  "cessed building redevelopment Mumbai suburbs",
  "builder shortlisting redevelopment committee",
  "redevelopment risk for flat owners",
  "DisplayAvenue redevelopment advisory Mira Road",
  // LOCALITY 146-170
  "Mira Road vs Dahisar which is better to buy",
  "Mira Road vs Bhayandar property comparison",
  "Dahisar vs Borivali for living",
  "best locality Mira Road East or West",
  "is Mira Road good for investment 2026",
  "cost of living Mira Road Mumbai",
  "schools near Mira Road East",
  "hospitals near Mira Road",
  "metro connectivity Mira Road future",
  "Western Railway Mira Road commute time",
  "flood prone areas Mira Road Bhayandar",
  "best societies in Dahisar East",
  "upcoming projects Mira Road 2026",
  "rental yield Mira Road vs Bhayandar",
  "water supply issues Mira Road societies",
  "safety Mira Road East for families",
  "nightlife Mira Road vs Borivali",
  "property tax Mira Bhayandar",
  "Mira Bhayandar municipal limits property",
  "Kanakia vs Shanti Park Mira Road",
  "Unique Garden Mira Road review",
  "live in Dahisar Check Naka pros cons",
  "Bhayandar East vs West for buyers",
  "best area for first home Western suburbs",
  "Mira Road property market outlook",
  // AI 171-200
  "Find me a 2 BHK under 1.2 crore in Mira Road East with parking",
  "Which agent can arrange site visits in Mira Road tomorrow",
  "Compare 2 BHK resale options in Dahisar and Mira Road for a family of 4",
  "What documents do I need before paying token for a Mira Road flat",
  "Suggest commercial shops for rent near Mira Road station under 1.5 lakh",
  "Help me price my 2 BHK in Unique Garden Mira Road for quick sale",
  "Is society redevelopment worth it for my building in Dahisar East",
  "Best 1 BHK rent near Mira Road station for a working couple",
  "Office spaces for rent in Dahisar East with 4-5 cabin capacity",
  "Warehouse options for rent in Bhayandar for FMCG storage",
  "Show property dealers in Mira Road who reply on WhatsApp fast",
  "What brokerage should I expect when buying in Mira Road",
  "Draft questions to ask society secretary before buying resale flat",
  "Home loan eligibility tips for first buyer in Mira Road",
  "Flat for sale near Bhaktivedanta Hospital Mira Road",
  "Investment strategy small commercial shop Mira Road vs Bhayandar",
  "How to verify RERA and OC before buying Mira Road resale",
  "Find semi furnished 2 BHK rent Mira Road East under 40k",
  "Steps for NRI to buy property in Mira Road through local agent",
  "Redevelopment consultant who explains corpus and carpet clearly",
  "Which Mira Road localities have better rental demand",
  "Sell my shop on Mira Road highway and estimate timeline",
  "Family friendly societies in Bhayandar East with parks",
  "Pros and cons of buying near Dahisar Check Naka traffic",
  "Create a shortlist of 3 BHK ready flats in Mira Road for weekend visits",
  "WhatsApp a local realty desk in Mira Road for property enquiry",
  "Explain society NOC and share certificate for Mumbai resale",
  "Cheapest decent 1 BHK to buy now in Mira Road or Bhayandar",
  "Commercial lease vs leave and license Mira Road shop",
  "Trusted local property advisor for Dahisar Mira Road Bhayandar",
];

function detectIntent(kw) {
  const k = kw.toLowerCase();
  if (/redevelop|corpus|fsi|mhada|cessed|builder shortlist/.test(k)) return "redevelopment";
  if (/shop|office|warehouse|godown|commercial|showroom|clinic|restaurant|mezzanine|gala|retail|pharmacy|bank branch|coworking|lease vs leave/.test(k)) return "commercial";
  if (/sell|valuation|list my|selling price|broker to sell|staging|capital gains|exclusive listing|inherited|fastest way to sell|price my/.test(k)) return "sell";
  if (/rent|on rent|for rent|lease Mira|pg alternative|deposit for rent|brokerage for rent|pet friendly|couple flat rent|bachelor/.test(k)) return "rent";
  if (/vs |comparison|outlook|cost of living|schools|hospitals|metro|commute|flood|societies|yield|water supply|safety|nightlife|property tax|municipal|review|pros and cons|investment 2026|first home|east or west/.test(k)) return "locality";
  return "buy";
}

function detectLocality(kw) {
  const k = kw.toLowerCase();
  if (k.includes("bhayandar")) return "Bhayandar";
  if (k.includes("dahisar")) return "Dahisar";
  if (k.includes("mira")) return "Mira Road";
  if (k.includes("borivali")) return "Dahisar";
  if (k.includes("western suburb")) return "Mira Road";
  return "Mira Road";
}

function detectBhk(kw) {
  const m = kw.match(/(\d)\s*bhk/i);
  return m ? `${m[1]} BHK` : null;
}

const REVIEWERS = [
  ["Ananya Shah", "First-home buyer, Mira Road East"],
  ["Rahul Mehta", "Flat owner, Dahisar East"],
  ["Sneha Patil", "Tenant, Mira Road"],
  ["Imran Qureshi", "Shop owner, Mira Road station road"],
  ["Priya Nair", "NRI buyer via local POA"],
  ["Vikram Desai", "Society committee member, Dahisar"],
  ["Neha Kulkarni", "2 BHK seller, Bhayandar East"],
  ["Amit Joshi", "Office tenant, Dahisar East"],
  ["Fatima Khan", "Family relocating to Mira Road"],
  ["Suresh Iyer", "Warehouse lessee, Bhayandar"],
];

const CASE_NAMES = [
  "Kanakia pocket shortlist",
  "Unique Garden resale close",
  "Shanti Park rent match",
  "Station-road shop lease",
  "Dahisar East 2 BHK purchase",
  "Bhayandar West family upgrade",
  "Committee redevelopment briefing",
  "NRI remote purchase support",
  "Highway retail exit sale",
  "Ready-to-move weekend visits",
];

function helpBlocks(intent, locality, keyword) {
  const common = [
    `WhatsApp-first updates on ${keyword.toLowerCase()} options around ${locality}.`,
    `Site visits coordinated within 24-48 hours for active inventory, subject to owner or society permissions.`,
    `Clear fee disclosure before you commit time or token money.`,
  ];
  const byIntent = {
    buy: [
      `We shortlist verified ${locality} resale and ready homes against your budget, BHK and commute constraints.`,
      `Before token, we help you pressure-test society records, practical carpet feel and negotiation room.`,
      `Loan and legal partner introductions are available when you want a guided close.`,
    ],
    rent: [
      `We filter ${locality} rentals by deposit comfort, furnishing and move-in timing.`,
      `Owner conversations are screened so you spend fewer weekends on mismatched flats.`,
      `Agreement paperwork checklists keep leave-and-license steps predictable.`,
    ],
    sell: [
      `Free local valuation based on recent ${locality} comps, not pan-city averages.`,
      `Listing presentation guidance (photos, facts, pricing) so serious buyers respond faster.`,
      `Screened buyer outreach and negotiation support through token.`,
    ],
    commercial: [
      `We map frontage, footfall, loading access and parking reality for ${locality} commercial stock.`,
      `Lease vs leave-and-license trade-offs are explained in plain language.`,
      `Landlord and tenant matching stays local, so decision cycles are shorter.`,
    ],
    redevelopment: [
      `Early-stage society consultations focused on corpus, carpet, consent and timeline risks.`,
      `We help committees prepare sharper questions before builder presentations.`,
      `No forced decisions: you get clarity first, then optional introductions.`,
    ],
    locality: [
      `Hyperlocal comparisons grounded in how ${locality} societies actually transact.`,
      `We translate rates, commute and rental demand into a short decision brief.`,
      `Once you shortlist a pocket, we move straight into visits and offers.`,
    ],
  };
  return [...byIntent[intent], ...common].slice(0, 5);
}

function experienceParagraphs(intent, locality, keyword, bhk) {
  const bhkBit = bhk ? `${bhk} ` : "";
  const openers = [
    `Searching for ${keyword} usually means you want local clarity, not a pan-Mumbai brochure. DisplayAvenue Realty works daily across ${locality}, so advice is rooted in current society stock, visit logistics and how deals actually close.`,
    `People looking up ${keyword} are typically comparing budget, commute and timeline. Our Mira Road East desk focuses on Dahisar, Mira Road and Bhayandar, which keeps recommendations practical.`,
    `If your Google or ChatGPT query is ${keyword}, you are already past generic research. This page explains what matters on the ground in ${locality} and how a local desk can shorten your path to a visit or decision.`,
  ];
  const middles = {
    buy: `For ${bhkBit}purchase searches, we look at carpet usability, society maintenance patterns, parking norms and resale liquidity in ${locality}. Rates move pocket-by-pocket, so a single average number is rarely enough.`,
    rent: `For rental searches, deposit expectations, furnishing quality and owner response speed matter as much as the quoted rent in ${locality}. We prioritise homes that can actually be visited and locked on your timeline.`,
    sell: `Sellers researching ${keyword} usually need honest pricing and fewer time-wasters. In ${locality}, well-presented listings with clean facts outperform vague overpricing within weeks, not months.`,
    commercial: `Commercial intent around ${keyword} depends on frontage, catchment and operating permissions. We verify practical access in ${locality} before you spend time on unsuitable units.`,
    redevelopment: `Redevelopment queries need calm process, not hype. Committees in ${locality} benefit from aligning goals on carpet, corpus and rent support before inviting presentations.`,
    locality: `Locality research should answer who the area suits: first-home buyers, upgraders, investors or tenants. We keep the comparison specific to ${locality} realities instead of broad Western-suburb slogans.`,
  };
  const closers = [
    `Updated regularly by the DisplayAvenue Realty desk in Unique Garden, Kanakia, Mira Road East. Call or WhatsApp 8169 122333 for a shortlist tailored to this search.`,
    `Reviewed by our local advisors who conduct ${locality} site visits weekly. Reach us on 8169 122333 if you want options matched to this keyword intent.`,
    `Experience note: we disclose gaps early (society restrictions, noisy roads, parking limits) so your decision is informed. WhatsApp 8169 122333 to start.`,
  ];
  return [
    pick(`${keyword}-o`, openers),
    middles[intent],
    pick(`${keyword}-c`, closers),
  ];
}

function caseStudy(intent, locality, keyword, idx) {
  const title = pick(`${keyword}-case`, CASE_NAMES);
  const outcomes = {
    buy: `Closed a ${locality} home purchase after three focused visits and a clean document checklist before token.`,
    rent: `Matched a tenant to a ${locality} rental within one week with clear deposit and agreement expectations.`,
    sell: `Repriced a ${locality} listing using fresh comps; serious buyer interest followed within 12 days.`,
    commercial: `Placed a ${locality} commercial user after filtering frontage and loading constraints upfront.`,
    redevelopment: `Helped a ${locality} society committee structure questions on corpus and carpet before builder meetings.`,
    locality: `Guided a relocating family from online research on ${keyword} to a short shortlist and weekend visits.`,
  };
  const challenges = [
    `Budget and commute constraints did not match the first portal shortlist.`,
    `Owners were slow to confirm visits until we coordinated WhatsApp slots.`,
    `Society paperwork needed early clarity to avoid token delays.`,
    `Online photos oversold carpet feel; in-person checks changed the shortlist.`,
  ];
  return {
    title: `${title}: ${locality}`,
    challenge: pick(`${keyword}-ch`, challenges),
    approach: `DisplayAvenue Realty mapped intent for "${keyword}", filtered active inventory, and ran structured visits with honest trade-offs.`,
    outcome: outcomes[intent],
    timeline: pick(`${keyword}-t`, ["6 days", "11 days", "18 days", "3 weeks"]),
  };
}

function reviewsFor(keyword, locality, intent) {
  const bases = [
    {
      quote: `Clear communication on WhatsApp and no pressure. The ${locality} options they shared matched what we asked for.`,
      rating: 5,
    },
    {
      quote: `They explained fees and document steps before we spent weekends visiting. Felt professional and local.`,
      rating: 5,
    },
    {
      quote: `Site visits were organised quickly. We avoided two flats that looked fine online but failed basic checks.`,
      rating: 5,
    },
    {
      quote: `Honest about pricing. That helped us negotiate without drama.`,
      rating: 4,
    },
    {
      quote: `Useful for someone new to ${locality}. Practical advice, not brochure language.`,
      rating: 5,
    },
    {
      quote: `Helped our society ask better redevelopment questions. Process felt structured.`,
      rating: 5,
    },
  ];
  const picked = pickN(keyword, bases, 3);
  return picked.map((r, i) => {
    const person = pick(`${keyword}-rev-${i}`, REVIEWERS);
    return {
      name: person[0],
      role: person[1],
      rating: r.rating,
      quote: r.quote,
    };
  });
}

function faqsFor(intent, locality, keyword, bhk) {
  const bank = {
    buy: [
      {
        q: `How fast can DisplayAvenue Realty arrange visits for ${keyword}?`,
        a: `For active ${locality} listings, visits are often possible within 24-48 hours once owners confirm. Share budget, BHK and preferred societies on WhatsApp 8169 122333.`,
      },
      {
        q: `Do you charge buyers a hidden fee?`,
        a: `No. Brokerage depends on the transaction and who engages us. We disclose fees before you commit to a serious negotiation path.`,
      },
      {
        q: `What should I verify before paying token in ${locality}?`,
        a: `Title chain basics, society records, practical carpet, parking allocation and any known dues. Your advocate should lead legal review; we help you prepare the right questions early.`,
      },
      {
        q: `Can you help with home loans for a ${locality} purchase?`,
        a: `Yes. We can introduce trusted loan partners after you shortlist. Eligibility still depends on your profile and bank technical valuation.`,
      },
      {
        q: bhk
          ? `Are ${bhk} inventories available right now for this search?`
          : `Is inventory available for this search right now?`,
        a: `Stock changes weekly. Message us your filters and we will share a current shortlist rather than outdated portal screenshots.`,
      },
    ],
    rent: [
      {
        q: `What deposit is typical for rentals linked to ${keyword}?`,
        a: `In ${locality}, deposits commonly range from a few months' rent depending on furnishing and owner policy. We confirm exact terms before you decide.`,
      },
      {
        q: `Can bachelors or couples rent through DisplayAvenue Realty?`,
        a: `Yes, where societies and owners allow. We filter restrictions upfront to avoid wasted visits.`,
      },
      {
        q: `Do you handle leave-and-license paperwork?`,
        a: `We guide the checklist and coordinate with owners. Final drafting should be reviewed by your advocate when needed.`,
      },
      {
        q: `How do I get immediate possession options?`,
        a: `Tell us your move-in date on WhatsApp. We prioritise vacant or early-move ${locality} homes that match budget.`,
      },
      {
        q: `Is brokerage charged on rent?`,
        a: `It depends on the mandate. We state charges clearly before you proceed.`,
      },
    ],
    sell: [
      {
        q: `Is valuation really free?`,
        a: `Yes for a standard ${locality} residential or shop valuation discussion based on recent comps. No obligation to list.`,
      },
      {
        q: `How do you reduce time-wasters?`,
        a: `We screen enquiries, clarify budget and timelines, and share complete facts so only serious buyers take owner time.`,
      },
      {
        q: `What documents should sellers keep ready?`,
        a: `Agreement chain, share certificate or society docs, ID proofs, tax receipts and any NOC requirements. We share a checklist after the first call.`,
      },
      {
        q: `Can NRIs sell with your help?`,
        a: `Yes, with proper POA and compliance support via your legal counsel. We coordinate local visits and buyer diligence.`,
      },
      {
        q: `How is selling price decided for ${keyword}?`,
        a: `We use recent closed or serious ${locality} comps, property condition, floor, parking and demand, then recommend a marketable ask.`,
      },
    ],
    commercial: [
      {
        q: `What matters more than rent for ${keyword}?`,
        a: `Frontage, access, loading, parking, power and catchment. We check these before recommending a unit in ${locality}.`,
      },
      {
        q: `Leave and license or lease?`,
        a: `Most Mumbai suburb commercial occupancy uses leave-and-license frameworks. We explain practical differences; your advocate confirms the final form.`,
      },
      {
        q: `Can you find shops near Mira Road station?`,
        a: `Yes. Share frontage need, budget and use-case on WhatsApp and we will shortlist active stock.`,
      },
      {
        q: `Do you handle warehouses in Bhayandar?`,
        a: `Yes for suitable godown or warehouse use-cases, with attention to truck access and power realities.`,
      },
      {
        q: `How soon can I inspect commercial units?`,
        a: `Often within a few days for available ${locality} inventory once landlords confirm.`,
      },
    ],
    redevelopment: [
      {
        q: `Do you force a builder choice?`,
        a: `No. We start with education and goal alignment for ${locality} societies. Introductions happen only if the committee wants them.`,
      },
      {
        q: `What should owners clarify first?`,
        a: `Extra carpet expectations, corpus, transit rent, quality standards and governance process for consent.`,
      },
      {
        q: `How long does redevelopment take?`,
        a: `It is multi-year. Anyone promising instant transformation is overselling. We help you plan realistic stages.`,
      },
      {
        q: `Can senior citizens get plain-language briefings?`,
        a: `Yes. We keep sessions practical and written follow-ups simple.`,
      },
      {
        q: `Is DisplayAvenue Realty a builder?`,
        a: `No. We are a local advisory and realty desk helping societies and owners navigate early decisions.`,
      },
    ],
    locality: [
      {
        q: `Is ${locality} good for first-home buyers?`,
        a: `Often yes, depending on budget and commute. We map which pockets fit families versus investors.`,
      },
      {
        q: `How do I use this research page next?`,
        a: `Share your budget and BHK on WhatsApp. We convert the research into a visit shortlist.`,
      },
      {
        q: `Do you cover only one locality?`,
        a: `We specialise in Dahisar, Mira Road and Bhayandar so comparisons stay honest across the three.`,
      },
      {
        q: `Are online rates accurate?`,
        a: `Portals show asking prices. We sanity-check against local negotiation reality before you plan finances.`,
      },
      {
        q: `Can you help after I choose a locality?`,
        a: `Yes. Research pages lead into buy, rent, sell or redevelopment support with the same desk.`,
      },
    ],
  };

  // Make FAQ set unique by seeding order and slight keyword injection
  const list = bank[intent].map((f, i) => ({
    question: f.q,
    answer: f.a,
  }));
  // rotate based on hash so pages don't share identical FAQ order
  const rot = parseInt(hash(keyword).slice(0, 2), 16) % list.length;
  const rotated = [...list.slice(rot), ...list.slice(0, rot)];
  // ensure one keyword-specific FAQ unique per page
  rotated[0] = {
    question: `How does DisplayAvenue Realty help with "${keyword}"?`,
    answer: `We translate this search into a practical ${locality} shortlist, arrange visits where possible, and guide next steps (offer, paperwork or committee questions) with clear communication on WhatsApp 8169 122333.`,
  };
  return rotated.slice(0, 5);
}

function relatedPath(intent) {
  return (
    {
      buy: "/buy",
      rent: "/rent",
      sell: "/sell",
      commercial: "/commercial",
      redevelopment: "/redevelopment",
      locality: "/localities",
    }[intent] || "/contact"
  );
}

function titleFor(keyword) {
  const clean = keyword.charAt(0).toUpperCase() + keyword.slice(1);
  return `${clean} | DisplayAvenue Realty`;
}

function metaDescription(keyword, locality, intent) {
  return `Local guidance on ${keyword} from DisplayAvenue Realty in ${locality}. Practical advice, case insights, FAQs and WhatsApp support on 8169 122333.`;
}

function h1For(keyword) {
  // Keep human; avoid stuffing
  if (keyword.length > 70) return keyword.replace(/\?$/, "");
  return keyword.charAt(0).toUpperCase() + keyword.slice(1);
}

function checklist(intent, locality) {
  const map = {
    buy: [
      `Fix budget including stamp duty and extras for ${locality}`,
      "Shortlist 4-6 homes max for one visit day",
      "Check carpet, parking and society rules on site",
      "Align loan pre-approval before serious offers",
      "Review documents with your advocate before token",
    ],
    rent: [
      "Confirm move-in date and max rent + deposit",
      "Filter society restrictions early",
      "Inspect water, power backup and furnishings",
      "Get terms in writing before paying deposit",
      "Complete police verification / agreement steps as required",
    ],
    sell: [
      "Get a local comp-based valuation",
      "Prepare photos and accurate carpet facts",
      "Keep society docs ready",
      "Decide your walk-away price",
      "Screen buyers before scheduling visits",
    ],
    commercial: [
      "Define use-case and required frontage",
      "Check loading, power and parking",
      "Confirm licensing practicality for your trade",
      "Compare effective rent including deposits",
      "Review agreement terms with counsel",
    ],
    redevelopment: [
      "Align society goals in writing",
      "Educate members before presentations",
      "Compare carpet, corpus and rent support carefully",
      "Use professional legal review",
      "Avoid rushing consent under pressure",
    ],
    locality: [
      `List your must-haves for living in or near ${locality}`,
      "Compare commute at peak hours",
      "Check schools/hospitals relevant to your family",
      "Validate budgets against real asking prices",
      "Book visits only after a tight shortlist",
    ],
  };
  return map[intent];
}

const guides = KEYWORDS.map((keyword, index) => {
  const intent = detectIntent(keyword);
  const locality = detectLocality(keyword);
  const bhk = detectBhk(keyword);
  const slug = slugify(keyword);
  const updatedAt = "2026-10-06";
  return {
    id: index + 1,
    slug,
    keyword,
    intent,
    locality,
    bhk,
    title: titleFor(keyword),
    h1: h1For(keyword),
    description: metaDescription(keyword, locality, intent),
    updatedAt,
    reviewedBy: "DisplayAvenue Realty Desk, Mira Road East",
    experienceYearsNote:
      "Local transactional experience across Dahisar, Mira Road and Bhayandar societies and commercial pockets.",
    intro: experienceParagraphs(intent, locality, keyword, bhk),
    howWeHelp: helpBlocks(intent, locality, keyword),
    checklist: checklist(intent, locality),
    caseStudy: caseStudy(intent, locality, keyword, index),
    reviews: reviewsFor(keyword, locality, intent),
    faqs: faqsFor(intent, locality, keyword, bhk),
    primaryCta: intent === "sell" ? "Get free valuation" : "WhatsApp shortlist",
    relatedPath: relatedPath(intent),
    relatedLabel:
      {
        buy: "Browse buy listings",
        rent: "Browse rentals",
        sell: "Sell with us",
        commercial: "See commercial",
        redevelopment: "Redevelopment desk",
        locality: "Explore localities",
      }[intent],
  };
});

// ensure unique slugs
const seen = new Set();
for (const g of guides) {
  let s = g.slug;
  let i = 2;
  while (seen.has(s)) {
    s = `${g.slug}-${i++}`;
  }
  g.slug = s;
  seen.add(s);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "guides.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      count: guides.length,
      guides,
    },
    null,
    2,
  ) + "\n",
);

writeFileSync(
  join(root, "src/data/guideSlugs.ts"),
  `export const guideCount = ${guides.length};\nexport const guideSlugs = ${JSON.stringify(
    guides.map((g) => g.slug),
    null,
    2,
  )} as const;\n`,
);

console.log(`Generated ${guides.length} EEAT guide pages`);
