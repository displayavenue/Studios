import { img } from "./images";

export const whyChoose = [
  {
    title: "Hyperlocal focus",
    text: "We specialise in Dahisar, Mira Road and Bhayandar — not pan-India noise. Local pricing sense, local societies, local visits.",
  },
  {
    title: "Clear communication",
    text: "WhatsApp-first updates, honest gaps in listings, and no last-minute surprises on paperwork expectations.",
  },
  {
    title: "End-to-end help",
    text: "Buy, sell, rent, commercial and redevelopment — one team that understands how deals actually close in these suburbs.",
  },
  {
    title: "Serious matchmaking",
    text: "We qualify budgets and timelines so owners meet real buyers/tenants, and seekers don’t waste weekends.",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Tell us what you need",
    text: "Budget, BHK, locality preference, sale or rent — via form, call or WhatsApp.",
  },
  {
    step: "02",
    title: "Get a shortlist",
    text: "We share verified options with photos, key facts and honest trade-offs.",
  },
  {
    step: "03",
    title: "Visit & decide",
    text: "Accompanied site visits, society checks, and negotiation support.",
  },
  {
    step: "04",
    title: "Close with clarity",
    text: "Token, agreement checklist, and coordination until keys change hands.",
  },
];

export const testimonials = [
  {
    name: "Rahul M.",
    role: "Bought 2BHK · Mira Road East",
    quote:
      "DisplayAvenue shortlisted three societies that actually matched our commute and budget. Visit to token in under three weeks.",
  },
  {
    name: "Sneha & Amit",
    role: "Rented 2BHK · Dahisar West",
    quote:
      "No spam listings. They knew which societies allow families and coordinated visits around our work timings.",
  },
  {
    name: "Kiran Patel",
    role: "Shop owner · Bhayandar",
    quote:
      "Found a corner shop with real footfall. Lease terms were explained simply before we committed.",
  },
  {
    name: "Society committee · Mira Road",
    role: "Redevelopment enquiry",
    quote:
      "They walked our committee through the process without pushing a single builder on day one. Refreshing.",
  },
];

export const faqs = [
  {
    question: "Which areas do you cover?",
    answer:
      "Our primary focus is Dahisar (East & West), Mira Road (mainly East) and Bhayandar (East & West). We also advise on nearby pockets when it helps your brief.",
  },
  {
    question: "Do you charge buyers or tenants a fee?",
    answer:
      "Brokerage depends on the transaction type and who engages us. We disclose fees upfront before you commit to visits or negotiations — no hidden surprises.",
  },
  {
    question: "Can I list my flat or shop with you?",
    answer:
      "Yes. Use the Sell / List page or WhatsApp us photos, society name, carpet area and expected price. We’ll advise on pricing and buyer/tenant outreach.",
  },
  {
    question: "Do you help with home loans and legal checks?",
    answer:
      "We guide you on typical documents and can introduce trusted loan and legal partners. Final due diligence remains with your advocate and lender.",
  },
  {
    question: "How does society redevelopment advisory work?",
    answer:
      "We start with a consultation on your society’s stage, plot realities and owner questions. Then we outline next steps and, if relevant, introduce builder options — without forcing a decision.",
  },
  {
    question: "How fast can I schedule a site visit?",
    answer:
      "Often within 24–48 hours for active listings, subject to owner/society permissions. WhatsApp is the fastest way to lock a slot.",
  },
];

export const blogs = [
  {
    slug: "mira-road-vs-dahisar-vs-bhayandar-2026",
    title: "Mira Road vs Dahisar vs Bhayandar — where should you buy in 2026?",
    excerpt:
      "A practical comparison of budgets, commute, society stock and rental demand across the three localities we know best.",
    category: "Locality guide",
    date: "2026-09-12",
    image: img.blogCompare,
    content: [
      "If you are shortlisting Western suburb homes, the choice often collapses to Dahisar, Mira Road and Bhayandar. Each rewards a different buyer profile.",
      "Mira Road East offers dense society inventory and strong rental absorption — ideal for first homes and investors who want liquidity.",
      "Dahisar appeals to buyers who want municipal-limit familiarity, WEH access, and a mix of older plus upgraded stock. Redevelopment conversations are more common in ageing societies.",
      "Bhayandar frequently wins on carpet-for-budget, especially for growing families, with newer amenity-led towers and practical commercial demand.",
      "The right answer depends on commute, school belt, and whether you prioritise resale liquidity or space. Tell us your constraints — we’ll map societies accordingly.",
    ],
  },
  {
    slug: "documents-checklist-resale-flat-mumbai",
    title: "Documents checklist for buying a resale flat in Mumbai suburbs",
    excerpt:
      "Title chain, society NOC, occupancy certificate and more — a plain-English starter list before you pay token.",
    category: "Buyer guide",
    date: "2026-08-28",
    image: img.blogDocs,
    content: [
      "Resale purchases move smoothly when documents are reviewed early. Your advocate should lead, but knowing the basics helps you ask better questions.",
      "Typically expect: title documents / previous agreements, share certificate & society records, occupancy certificate where applicable, property tax receipts, and NOCs required for transfer.",
      "For loan cases, your bank’s legal and technical valuation adds another layer — build that timeline into your negotiation.",
      "We help coordinate what sellers usually need ready so visits convert into serious offers faster.",
    ],
  },
  {
    slug: "redevelopment-basics-for-society-owners",
    title: "Redevelopment basics for society owners in Mira Road & Dahisar",
    excerpt:
      "What committees should clarify before inviting builder presentations — consent, corpus, carpet and timelines.",
    category: "Redevelopment",
    date: "2026-07-20",
    image: img.redevelopment,
    content: [
      "Redevelopment is a multi-year journey. Owners should align on goals: extra carpet, corpus, rent during construction, and quality of the incoming developer.",
      "Committees benefit from a clear process: feasibility mindset, member education, professional advice, then shortlisting — not the other way around.",
      "DisplayAvenue Real Estate supports early-stage consultations so societies ask sharper questions before signing anything.",
    ],
  },
];

export const team = [
  {
    name: "DisplayAvenue Desk",
    role: "Local property advisors",
    bio: "Based in Mira Road East — helping families and businesses across Dahisar, Mira Road and Bhayandar.",
    image: img.teamOffice,
  },
];

export type BlogPost = (typeof blogs)[number];
