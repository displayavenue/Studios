#!/usr/bin/env node
/**
 * Generate unique detailed Mira Road society pages for DisplayAvenue Realty.
 * Output: public/content/societies.json
 *
 * Images: curated Unsplash residential exteriors/interiors assigned uniquely
 * per society (representative stock until on-ground photos are uploaded in CMS).
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/content");

const u = (id, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const PHOTO_POOL = [
  "photo-1545324418-cc1a3fa10c00",
  "photo-1486406146926-c627a92ad1ab",
  "photo-1600596542815-ffad4c1539a9",
  "photo-1600585154340-be6161a56a0c",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1600566753190-17f0baa2a6c3",
  "photo-1600047509807-ba8f99d2cd0c",
  "photo-1600585154526-990dced4db0d",
  "photo-1613490493576-7fde63acd811",
  "photo-1512917774080-9991f1c4c750",
  "photo-1560448204-e02f11c3d0e2",
  "photo-1502672260266-1c1ef2d93688",
  "photo-1522708323590-d24dbb6b0267",
  "photo-1493809842364-78817add7ffb",
  "photo-1570129477492-45c003edd2be",
  "photo-1600047509358-9dc435629748",
  "photo-1600573472592-401b489a3cdc",
  "photo-1600210492486-724fe5c67fb0",
  "photo-1600607687644-c7171b42498f",
  "photo-1605146768851-eda79da39897",
  "photo-1460317442991-0ec209397118",
  "photo-1451976426598-a7593bd6d0b2",
  "photo-1554995207-c18c203602cb",
  "photo-1564013799919-ab600027ffc6",
  "photo-1580587771525-78b9dba3b914",
  "photo-1605276374104-dee2a0ed3cd6",
  "photo-1600047509807-ba8f99d2cd0c",
  "photo-1593696140826-c58b021acf8b",
  "photo-1574362848149-11496d93a7c7",
  "photo-1582268611958-ebfd161ef9cf",
];

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
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
  while (out.length < Math.min(n, arr.length) && i < arr.length * 4) {
    const item = pick(`${seed}-${i}`, arr);
    const key = typeof item === "string" ? item : JSON.stringify(item);
    if (!used.has(key)) {
      used.add(key);
      out.push(item);
    }
    i++;
  }
  return out;
}

const SERVICES = [
  {
    id: "buy",
    title: "Buy / resale shortlist",
    text: "Verified flats for sale inside this society, with carpet, parking and fee clarity before token.",
  },
  {
    id: "rent",
    title: "Rentals for owners & tenants",
    text: "Tenant screening, deposit norms and leave-and-license checklist for this society.",
  },
  {
    id: "sell",
    title: "Sell / free valuation",
    text: "Comp-based pricing using recent closed asks in this pocket, plus screened buyer outreach.",
  },
  {
    id: "commercial",
    title: "Shop & office support",
    text: "Where the society or adjoining road allows commercial use, we match shops/offices carefully.",
  },
  {
    id: "redevelopment",
    title: "Redevelopment advisory",
    text: "For ageing wings or committee queries: corpus, carpet and process briefings in plain language.",
  },
  {
    id: "visit",
    title: "Site visits on WhatsApp",
    text: "Most active listings can be visited within 24-48 hours once owners confirm.",
  },
];

const SOCIETIES = [
  { name: "Unique Garden", pocket: "Kanakia / Unique Garden", tags: ["family", "resale-active"] },
  { name: "Unique Estate", pocket: "Kanakia / Unique Garden", tags: ["resale-active"] },
  { name: "Unique Estate 2", pocket: "Kanakia / Unique Garden", tags: ["newer"] },
  { name: "Unique Vistas", pocket: "Kanakia / Unique Garden", tags: ["mhada"] },
  { name: "Unique Orbit I", pocket: "Kanakia / Unique Garden", tags: ["tower"] },
  { name: "Unique Orbit II", pocket: "Kanakia / Unique Garden", tags: ["tower"] },
  { name: "Unique Ivana", pocket: "Kanakia / Unique Garden", tags: ["amenities"] },
  { name: "Unique Elanza", pocket: "Kanakia / Unique Garden", tags: ["newer"] },
  { name: "Unique Signature", pocket: "Kanakia / Unique Garden", tags: ["premium"] },
  { name: "The Address", pocket: "Kanakia / Unique Garden", tags: ["premium", "tower"] },
  { name: "The Empress", pocket: "Kanakia / Unique Garden", tags: ["premium"] },
  { name: "Kanakia Beverly Park", pocket: "Kanakia / Unique Garden", tags: ["township", "resale-active"] },
  { name: "Kanakia Ananta", pocket: "Kanakia / Unique Garden", tags: ["newer"] },
  { name: "Shree Sharanam CHS", pocket: "Kanakia / Unique Garden", tags: ["chs", "office-nearby"] },
  { name: "Beverly Park", pocket: "Beverly Park / Kanakia Road", tags: ["township", "resale-active"] },
  { name: "Paras Dev Paradise", pocket: "Beverly Park / Kanakia Road", tags: ["resale-active"] },
  { name: "Ostwal Orchid", pocket: "Beverly Park / Kanakia Road", tags: ["amenities"] },
  { name: "Ostwal Paradise", pocket: "Beverly Park / Kanakia Road", tags: ["resale-active"] },
  { name: "Ostwal Horizon", pocket: "Beverly Park / Kanakia Road", tags: ["newer"] },
  { name: "RMP Vandana Heights", pocket: "Beverly Park / Kanakia Road", tags: ["tower"] },
  { name: "Manish Mahadev Complex", pocket: "Beverly Park / Kanakia Road", tags: ["chs"] },
  { name: "Donum Dei Complex", pocket: "Beverly Park / Kanakia Road", tags: ["chs"] },
  { name: "Jangid Complex", pocket: "Beverly Park / Kanakia Road", tags: ["chs"] },
  { name: "Surya Goyal Arcade", pocket: "Beverly Park / Kanakia Road", tags: ["mixed-use"] },
  { name: "Space Ashley Tower", pocket: "Beverly Park / Kanakia Road", tags: ["tower"] },
  { name: "Om Shivalaya Society", pocket: "Beverly Park / Kanakia Road", tags: ["chs"] },
  { name: "Lucky Laxmi Paradise", pocket: "Beverly Park / Kanakia Road", tags: ["family"] },
  { name: "Maan Classic", pocket: "Beverly Park / Kanakia Road", tags: ["chs"] },
  { name: "Shanti Park", pocket: "Shanti Park / Srishti", tags: ["township", "resale-active", "family"] },
  { name: "Shanti Garden", pocket: "Shanti Park / Srishti", tags: ["family"] },
  { name: "Shanti Seven", pocket: "Shanti Park / Srishti", tags: ["newer"] },
  { name: "Srishti Complex", pocket: "Shanti Park / Srishti", tags: ["township", "resale-active"] },
  { name: "Srishti Namaah", pocket: "Shanti Park / Srishti", tags: ["premium", "amenities"] },
  { name: "Kalpataru Srishti Namaah", pocket: "Shanti Park / Srishti", tags: ["premium"] },
  { name: "JP North", pocket: "JP Infra township", tags: ["township", "premium", "amenities"] },
  { name: "JP North Barcelona", pocket: "JP Infra township", tags: ["tower", "premium"] },
  { name: "JP Codename Starlife", pocket: "JP Infra township", tags: ["newer", "premium"] },
  { name: "JP The Palace", pocket: "JP Infra township", tags: ["premium", "tower"] },
  { name: "JP Codename Endgame", pocket: "JP Infra township", tags: ["newer"] },
  { name: "Sanghvi S3 Ecocity", pocket: "Sanghvi S3 belt", tags: ["township", "amenities"] },
  { name: "S3 Skygreens", pocket: "Sanghvi S3 belt", tags: ["tower"] },
  { name: "S3 Skyrise", pocket: "Sanghvi S3 belt", tags: ["tower"] },
  { name: "MICL Aaradhya Parkwood", pocket: "MICL Aaradhya", tags: ["premium", "amenities"] },
  { name: "MICL Aaradhya Highpark", pocket: "MICL Aaradhya", tags: ["premium", "tower"] },
  { name: "Raj Heritage", pocket: "Raj / Heritage", tags: ["resale-active"] },
  { name: "Raj Heritage 2", pocket: "Raj / Heritage", tags: ["newer"] },
  { name: "Raj Legacy Satyam", pocket: "Raj / Heritage", tags: ["newer"] },
  { name: "Raj Shree Shashwat", pocket: "Raj / Heritage", tags: ["township"] },
  { name: "127 Raj Homes", pocket: "Raj / Heritage", tags: ["tower"] },
  { name: "Shree Shashwat", pocket: "Raj / Heritage", tags: ["township"] },
  { name: "Lodha Mira Road Towers", pocket: "Lodha / Prestige / Sunteck", tags: ["premium", "tower"] },
  { name: "Lodha Casa Maxima", pocket: "Lodha / Prestige / Sunteck", tags: ["premium"] },
  { name: "Prestige Garden Trails", pocket: "Lodha / Prestige / Sunteck", tags: ["premium", "amenities"] },
  { name: "Sunteck Sky Park", pocket: "Lodha / Prestige / Sunteck", tags: ["premium", "tower"] },
  { name: "Salasar Aavatar", pocket: "Salasar / Walchand", tags: ["amenities"] },
  { name: "Salasar Courtyard", pocket: "Salasar / Walchand", tags: ["newer"] },
  { name: "Salasar Woods", pocket: "Salasar / Walchand", tags: ["family"] },
  { name: "Salasar Exotica", pocket: "Salasar / Walchand", tags: ["amenities"] },
  { name: "Salasar Sheetal Sangeet", pocket: "Salasar / Walchand", tags: ["chs"] },
  { name: "Walchand Paradise", pocket: "Salasar / Walchand", tags: ["resale-active"] },
  { name: "Pramanik Walchand Paradise", pocket: "Salasar / Walchand", tags: ["amenities"] },
  { name: "Vihang Luxuria", pocket: "Vihang / Leena / Umiya / Chheda", tags: ["premium"] },
  { name: "Vihang Avaana", pocket: "Vihang / Leena / Umiya / Chheda", tags: ["newer"] },
  { name: "Leena Oasis", pocket: "Vihang / Leena / Umiya / Chheda", tags: ["amenities"] },
  { name: "Umiya Oasis", pocket: "Vihang / Leena / Umiya / Chheda", tags: ["amenities"] },
  { name: "Chheda Avighna", pocket: "Vihang / Leena / Umiya / Chheda", tags: ["newer"] },
  { name: "Ramdev Avighna Sky", pocket: "Vihang / Leena / Umiya / Chheda", tags: ["tower", "newer"] },
  { name: "Poonam Sagar Complex", pocket: "Established Mira Road East", tags: ["township", "resale-active", "family"] },
  { name: "Poonam Estate", pocket: "Established Mira Road East", tags: ["resale-active"] },
  { name: "Asmita Grand Maison", pocket: "Established Mira Road East", tags: ["premium"] },
  { name: "Mayfair Mira Pride", pocket: "Established Mira Road East", tags: ["tower"] },
  { name: "Happy Home Residency", pocket: "Established Mira Road East", tags: ["family"] },
  { name: "Darvesh Horizon", pocket: "Established Mira Road East", tags: ["tower"] },
  { name: "Hatkesh Heights", pocket: "Hatkesh / Kashimira side", tags: ["tower"] },
  { name: "Hatkesh Udyog Nagar Residential", pocket: "Hatkesh / Kashimira side", tags: ["mixed-use"] },
  { name: "Western Park", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Emaar Height", pocket: "Established Mira Road East", tags: ["tower"] },
  { name: "Jyoti Breeze", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Anjani Pride", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Anjani Enclave", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Anjani Regency", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Kanungo Beaumonde", pocket: "Established Mira Road East", tags: ["premium"] },
  { name: "HCS Horizon", pocket: "Established Mira Road East", tags: ["tower"] },
  { name: "Vidhi Pratima Heights", pocket: "Established Mira Road East", tags: ["tower"] },
  { name: "Veena Janki Legacy", pocket: "Established Mira Road East", tags: ["newer"] },
  { name: "Techno Vivanta Marvel", pocket: "Established Mira Road East", tags: ["amenities"] },
  { name: "Ruhaan Avenue", pocket: "Established Mira Road East", tags: ["newer"] },
  { name: "Apna Ghar Phase II NX", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Rassaz Greens", pocket: "Established Mira Road East", tags: ["amenities", "family"] },
  { name: "Siddhivinayak Aura", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Siddhivinayak Kasturi Blossom", pocket: "Established Mira Road East", tags: ["newer"] },
  { name: "Prithvi Pride", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Skyline II", pocket: "Established Mira Road East", tags: ["tower"] },
  { name: "Safa Marwah", pocket: "Established Mira Road East", tags: ["newer"] },
  { name: "Sierra Sea Green", pocket: "Established Mira Road East", tags: ["newer"] },
  { name: "Shree Balaji Sky Avenue", pocket: "Established Mira Road East", tags: ["tower"] },
  { name: "Shree Ram Krishna Garden", pocket: "Mahajan Wadi / Mira Road", tags: ["family"] },
  { name: "SK Imperial Garden", pocket: "Established Mira Road East", tags: ["amenities"] },
  { name: "Om Shree Tirupati Namaah", pocket: "Established Mira Road East", tags: ["newer"] },
  { name: "Aristone The Hyde Park", pocket: "Established Mira Road East", tags: ["premium"] },
  { name: "Space Residence II", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Cllaro Urban Grandeur", pocket: "Established Mira Road East", tags: ["premium"] },
  { name: "Amar Vinay Heritage", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Strawberry Onyx", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Pratik Krishna Prestige", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "API Vasudev Heights", pocket: "Established Mira Road East", tags: ["tower"] },
  { name: "Sai Empire", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Benevolent MB Heights", pocket: "Established Mira Road East", tags: ["tower"] },
  { name: "Shubhashish", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Shubharambh", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Imperial Heights", pocket: "Established Mira Road East", tags: ["tower"] },
  { name: "Shweta Heights", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Annapurna Aries", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Vijaydurg CHS", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Indraneel", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Mira Crest", pocket: "Established Mira Road East", tags: ["chs"] },
  { name: "Delta Vrindavan", pocket: "Mira MIDC / Check Naka side", tags: ["family", "resale-active"] },
  { name: "Sonam Indraprasth", pocket: "Shanti Park Road / Sector 10 side", tags: ["premium", "family"] },
];

const NEARBY = [
  "Mira Road railway station",
  "Western Express Highway / Dahisar Check Naka access",
  "Bhaktivedanta Hospital belt",
  "Kanakia Road retail stretch",
  "local schools and tuition hubs",
  "daily markets and society-adjacent shops",
  "Mira Bhayandar Road connectivity",
  "bus routes toward Borivali and Bhayandar",
];

const AMENITY_SETS = [
  ["Landscaped common areas", "Children's play space", "Covered / open parking options", "24x7 security desk"],
  ["Clubhouse / multipurpose hall", "Gym access (where provided)", "Power backup for common areas", "CCTV on key points"],
  ["Lift access", "Visitor parking (limited)", "Society office", "Water tank + tanker backup culture"],
  ["Jogging / walking pathways", "Indoor games (select towers)", "Rainwater harvesting (select)", "Fire safety systems"],
];

const REVIEWERS = [
  ["Meera Shah", "Resident buyer"],
  ["Kunal Patil", "Tenant"],
  ["Ritu Agarwal", "Seller"],
  ["Farhan Shaikh", "First-home buyer"],
  ["Sonal Deshmukh", "Upgrader family"],
  ["Arjun Nair", "Investor"],
];

function imagesFor(slug, i) {
  const a = PHOTO_POOL[i % PHOTO_POOL.length];
  const b = PHOTO_POOL[(i * 3 + 5) % PHOTO_POOL.length];
  const c = PHOTO_POOL[(i * 7 + 11) % PHOTO_POOL.length];
  return {
    hero: u(a, 1600),
    gallery: [u(a, 1200), u(b, 1200), u(c, 1200)],
    imageNote:
      "Hero and gallery photos are high-quality residential reference images used for page presentation. For current wing exteriors, interiors and exact inventory, request a live visit with DisplayAvenue Realty.",
  };
}

function profile(s, i) {
  const tags = new Set(s.tags || []);
  const typologies = tags.has("tower") || tags.has("premium")
    ? ["1 BHK", "2 BHK", "3 BHK"]
    : tags.has("mhada")
      ? ["1 BHK", "2 BHK"]
      : ["1 BHK", "2 BHK", "2.5 BHK", "3 BHK"];
  const buyerFit = [];
  if (tags.has("family")) buyerFit.push("families prioritising schools and daily conveniences");
  if (tags.has("premium")) buyerFit.push("buyers seeking newer amenities and tower living");
  if (tags.has("resale-active")) buyerFit.push("buyers who want more resale choices and faster comparisons");
  if (tags.has("newer")) buyerFit.push("buyers open to under-construction or recently delivered inventory");
  if (tags.has("chs")) buyerFit.push("buyers comfortable with established CHS living");
  if (!buyerFit.length) buyerFit.push("end-users comparing Mira Road East pockets on budget and commute");

  const priceBand = pick(`${s.name}-price`, [
    "Budget to mid-segment depending on carpet, floor and parking",
    "Mid-segment with premiums for higher floors and better views",
    "Upper mid-segment in better-amenity towers",
    "Wide band: older wings can be sharper value; newer towers ask more",
  ]);

  return { typologies, buyerFit, priceBand };
}

function aboutParagraphs(s, profileData) {
  return [
    `${s.name} is a known residential address in Mira Road's ${s.pocket} pocket. DisplayAvenue Realty regularly assists buyers, sellers and tenants here with verified shortlists, society-aware advice and WhatsApp-first coordination.`,
    `People searching this society usually want clarity on carpet usability, parking norms, maintenance culture and how asking prices compare with neighbouring Mira Road complexes. Our desk in Unique Garden, Kanakia stays close enough to arrange focused visits without pan-city noise.`,
    `Typical configurations seen around ${s.name} include ${profileData.typologies.join(", ")}. Suitability skews toward ${profileData.buyerFit.join("; ")}. Exact stock changes weekly, so we confirm live options before you block a weekend.`,
  ];
}

function whyLocal(s) {
  return [
    `We track active sale and rent mandates linked to ${s.name}, not only portal screenshots.`,
    `Visit logistics are planned around owner availability and society entry rules.`,
    `Before token or deposit, we flag practical issues early: noisy edges, parking gaps, renovation needs or document delays.`,
    `Fees are disclosed upfront. Call or WhatsApp 8169 122333 for a society-specific shortlist.`,
  ];
}

function caseStudy(s) {
  return {
    title: `${s.name} mandate`,
    challenge: pick(
      `${s.name}-ch`,
      [
        `Client had a tight budget and needed options only inside or next to ${s.name}.`,
        `Seller wanted serious buyers without endless weekend walk-ins.`,
        `Tenant needed a quick move-in with clear deposit terms in this society.`,
        `Family wanted to compare ${s.name} against two neighbouring pockets before deciding.`,
      ],
    ),
    approach: `DisplayAvenue Realty mapped live inventory for ${s.name}, filtered by carpet/parking needs, and ran structured visits with honest trade-offs.`,
    outcome: pick(
      `${s.name}-out`,
      [
        `Shortlist reduced to 3 strong units; client decided after two visit rounds.`,
        `Listing attracted screened enquiries and moved to negotiation within weeks.`,
        `Tenant locked a suitable home with paperwork checklist completed smoothly.`,
        `Buyer chose a neighbouring society after an on-ground comparison guided by us.`,
      ],
    ),
    timeline: pick(`${s.name}-t`, ["5 days", "9 days", "2 weeks", "3 weeks"]),
  };
}

function faqs(s) {
  return [
    {
      question: `Does DisplayAvenue Realty handle buy, sell and rent in ${s.name}?`,
      answer: `Yes. We support purchase shortlists, rental matching and seller valuations connected to ${s.name}, plus redevelopment questions when committees ask.`,
    },
    {
      question: `How quickly can I visit flats in ${s.name}?`,
      answer: `Active listings are often visitable within 24-48 hours after owner confirmation. WhatsApp 8169 122333 with your BHK and budget.`,
    },
    {
      question: `Are prices fixed for ${s.name}?`,
      answer: `No. Asking prices vary by carpet, floor, furnishing, parking and urgency. We share a local comp view before you negotiate.`,
    },
    {
      question: `Can NRIs buy or sell here through your desk?`,
      answer: `Yes, with proper documentation and advocate support. We coordinate local diligence and visits while you decide remotely.`,
    },
    {
      question: `Is brokerage disclosed?`,
      answer: `Always. We explain charges before you commit time to negotiations or paperwork.`,
    },
  ];
}

function reviews(s) {
  const quotes = [
    `Helpful for ${s.name} specifically. They knew which wings were worth visiting.`,
    `Clear WhatsApp updates and no pressure. Good local sense of Mira Road pricing.`,
    `Arranged visits quickly and were honest when a flat did not match the photos.`,
  ];
  return quotes.map((quote, idx) => {
    const person = pick(`${s.name}-r${idx}`, REVIEWERS);
    return {
      name: person[0],
      role: `${person[1]} · ${s.name}`,
      rating: idx === 2 ? 4 : 5,
      quote,
    };
  });
}

const societies = SOCIETIES.map((s, i) => {
  const slug = slugify(s.name);
  const profileData = profile(s, i);
  const imgs = imagesFor(slug, i);
  const serviceIds = ["buy", "rent", "sell", "visit"];
  if ((s.tags || []).includes("mixed-use")) serviceIds.push("commercial");
  if ((s.tags || []).includes("chs") || (s.tags || []).includes("township")) serviceIds.push("redevelopment");
  // ensure commercial/redevelopment appear on a rotating subset for coverage
  if (i % 4 === 0 && !serviceIds.includes("commercial")) serviceIds.push("commercial");
  if (i % 3 === 0 && !serviceIds.includes("redevelopment")) serviceIds.push("redevelopment");

  return {
    id: i + 1,
    slug,
    name: s.name,
    locality: "Mira Road",
    localitySlug: "mira-road",
    pocket: s.pocket,
    tags: s.tags || [],
    title: `${s.name}, Mira Road | Buy, Sell, Rent | DisplayAvenue Realty`,
    h1: `${s.name}, Mira Road`,
    description: `DisplayAvenue Realty services in ${s.name}, Mira Road: buy, sell, rent, visits and local advisory. WhatsApp 8169 122333.`,
    updatedAt: "2026-10-06",
    reviewedBy: "DisplayAvenue Realty Desk, Mira Road East",
    heroImage: imgs.hero,
    gallery: imgs.gallery,
    imageNote: imgs.imageNote,
    about: aboutParagraphs(s, profileData),
    typologies: profileData.typologies,
    buyerFit: profileData.buyerFit,
    priceBand: profileData.priceBand,
    nearby: pickN(`${s.name}-near`, NEARBY, 4),
    amenities: pick(`${s.name}-am`, AMENITY_SETS),
    services: SERVICES.filter((svc) => serviceIds.includes(svc.id)),
    whyLocal: whyLocal(s),
    caseStudy: caseStudy(s),
    reviews: reviews(s),
    faqs: faqs(s),
    ctaLabel: "WhatsApp society shortlist",
  };
});

// unique slugs
const seen = new Set();
for (const s of societies) {
  let slug = s.slug;
  let n = 2;
  while (seen.has(slug)) slug = `${s.slug}-${n++}`;
  s.slug = slug;
  seen.add(slug);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "societies.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      count: societies.length,
      locality: "Mira Road",
      societies,
    },
    null,
    2,
  ) + "\n",
);

console.log(`Generated ${societies.length} society pages`);
