export type FAQ = { question: string; answer: string; category: string };
export type BlogPost = { slug: string; title: string; excerpt: string; category: string; date: string; image: string; readTime: string; content?: string };
export type Industry = { slug: string; title: string; text: string; image: string };
export type LocationPage = { slug: string; title: string; city: string; service: string; intro: string };
export type Testimonial = { name: string; role: string; quote: string; image: string };
export type TeamMember = { name: string; role: string; image: string };
export type WhyChoose = { title: string; text: string };
export type ProcessStep = { step: string; title: string; text: string };

export const faqs = [
  {
    "category": "Booking",
    "question": "How early should we book a wedding photographer in Mumbai?",
    "answer": "For peak season (November–February) and popular muhurat dates, book 6–12 months ahead. WeddingSutra also advises shortlisting early so your favourite crew is not already taken."
  },
  {
    "category": "Booking",
    "question": "What is the difference between candid and traditional wedding photography?",
    "answer": "Candid photography captures spontaneous emotion without staged poses. Traditional photography organises family groups and ritual portraits elders expect. DisplayAvenue blends both in Signature and Luxury packages."
  },
  {
    "category": "Pricing",
    "question": "How much does a wedding photographer cost in Mumbai?",
    "answer": "Our wedding packages start at ₹75,000 for Essential single-day coverage. Signature photo + film packages begin at ₹1,85,000. Destination Luxury productions start at ₹3,50,000. Final quotes depend on days, crew size and travel."
  },
  {
    "category": "Pricing",
    "question": "Do you offer combined photography and videography packages?",
    "answer": "Yes. Bundling photo and film from one studio keeps colour language consistent and is typically more cost-effective than hiring separate vendors — the approach most modern couples prefer."
  },
  {
    "category": "Coverage",
    "question": "Can you cover Haldi, Mehendi, Sangeet and Reception separately?",
    "answer": "Absolutely. Each function can be booked à la carte or as part of a multi-day wedding package. Destination crews regularly cover full wedding weeks."
  },
  {
    "category": "Coverage",
    "question": "Do you travel outside Mumbai for destination weddings?",
    "answer": "Yes — pan-India. Popular destinations include Goa, Udaipur, Jaipur, Delhi NCR and Bangalore. Travel and stay are planned into Luxury and destination quotes."
  },
  {
    "category": "Deliverables",
    "question": "What deliverables are included?",
    "answer": "Edited online galleries, social selects, cinematic highlight films (package dependent), optional feature films, drone plates and album design credits. Everything is confirmed in writing before the shoot."
  },
  {
    "category": "Deliverables",
    "question": "How fast do we get photos for Instagram?",
    "answer": "Signature and Luxury packages include same-day or 48-hour social selects so guests and couples can post during the wedding week."
  },
  {
    "category": "Pre-Wedding",
    "question": "When should we do our pre-wedding shoot?",
    "answer": "October–March offers the best outdoor light in India. Golden hour (sunrise/sunset) produces the flattering tones WeddingSutra recommends for couple frames."
  },
  {
    "category": "Maternity",
    "question": "When is the best time for maternity photography?",
    "answer": "Between weeks 28 and 34 — the bump is beautifully defined while you are still comfortable posing and travelling to the studio or location."
  },
  {
    "category": "Events",
    "question": "Do you cover birthdays and non-wedding events?",
    "answer": "Yes. We provide premium birthday photography and all-event coverage for anniversaries, pujas, cocktail nights and family celebrations — same luxury standard as our weddings."
  },
  {
    "category": "Hiring",
    "question": "What should we discuss before sealing the deal?",
    "answer": "Per WeddingSutra guidance: share function timings and venues, must-have shots, key family members, full deliverables, taxes/travel, and whether pre-wedding is bundled for a better package rate."
  }
];

export const blogs = [
  {
    "slug": "how-to-hire-wedding-photographer-mumbai",
    "title": "How to Hire the Best Wedding Photographer in Mumbai (2026 Guide)",
    "excerpt": "Budget, style, shortlist and questions — a WeddingSutra-informed checklist for couples booking DisplayAvenue or any premium studio.",
    "category": "Planning",
    "date": "2026-03-01",
    "image": "/images/indian/wedding-04.jpg",
    "readTime": "8 min read",
    "content": "Finalize budget first, study candid vs traditional styles, shortlist 4–5 studios, request full galleries (not only highlights), and book 6–12 months ahead. Discuss deliverables, taxes, travel and pre-wedding bundling before you pay a token."
  },
  {
    "slug": "candid-vs-traditional-wedding-photography",
    "title": "Candid vs Traditional Wedding Photography: Which Do You Need?",
    "excerpt": "WeddingSutra breaks down both styles — here’s how Mumbai couples combine them for heirloom albums.",
    "category": "Education",
    "date": "2026-02-18",
    "image": "/images/indian/wedding-03.jpg",
    "readTime": "6 min read",
    "content": "Candid captures raw emotion; traditional secures family groups. The premium choice is a hybrid crew that delivers both without making elders or couples compromise."
  },
  {
    "slug": "pre-wedding-shoot-ideas-mumbai",
    "title": "Pre-Wedding Shoot Ideas in Mumbai & Lonavala",
    "excerpt": "Golden hour locations, outfit tips and guided candid prompts for cinematic chemistry frames.",
    "category": "Pre-Wedding",
    "date": "2026-02-05",
    "image": "/images/indian/couple-02.jpg",
    "readTime": "7 min read",
    "content": "Marine Drive, Bandra sea face, heritage hotels and Lonavala hills remain classics. Shoot at golden hour, pack two outfits, and prioritise movement prompts over stiff poses."
  },
  {
    "slug": "wedding-photography-packages-cost-india",
    "title": "Wedding Photography Packages & Cost in India 2026",
    "excerpt": "What Essential, mid-tier and luxury wedding photo-film packages usually include — and how DisplayAvenue prices Mumbai coverage.",
    "category": "Pricing",
    "date": "2026-01-22",
    "image": "/images/indian/film-01.jpg",
    "readTime": "9 min read",
    "content": "India packages range from budget single-shooter days to celebrity-tier multi-crew productions. Our Essential starts at ₹75,000; Signature photo+film at ₹1,85,000; Luxury destination from ₹3,50,000."
  },
  {
    "slug": "maternity-photoshoot-tips",
    "title": "Maternity Photoshoot Tips: Timing, Outfits & Poses",
    "excerpt": "Book weeks 28–34, choose flowing solids, and use partner connection poses for heirloom frames.",
    "category": "Maternity",
    "date": "2026-01-10",
    "image": "/images/indian/maternity-01.jpg",
    "readTime": "5 min read",
    "content": "Comfort is everything. Soft light, gentle bump cradles, forehead touches and profile silhouettes create elegant maternity galleries without stress."
  },
  {
    "slug": "destination-wedding-photography-checklist",
    "title": "Destination Wedding Photography Checklist (Goa, Udaipur, Jaipur)",
    "excerpt": "Permissions, drone rules, golden-hour slots and crew travel — plan like a production, not a guest.",
    "category": "Destination",
    "date": "2025-12-12",
    "image": "/images/indian/wedding-05.jpg",
    "readTime": "8 min read",
    "content": "Confirm venue drone policy, share full multi-day run-of-show, lock crew stay near the venue, and protect 20–30 minutes for couple portraits at sunset."
  },
  {
    "slug": "cinematic-wedding-films-what-to-expect",
    "title": "Cinematic Wedding Films: What Couples Should Expect",
    "excerpt": "Highlight length, feature films, reels and audio — demystifying wedding videography for 2026 couples.",
    "category": "Films",
    "date": "2025-11-28",
    "image": "/images/indian/film-01.jpg",
    "readTime": "6 min read",
    "content": "Most couples love a 3–5 minute highlight for sharing plus a longer film for family. Vertical reels are now standard for Instagram within the wedding week."
  },
  {
    "slug": "birthday-and-event-photography-mumbai",
    "title": "Birthday & Event Photography in Mumbai Worth Booking",
    "excerpt": "Why milestone birthdays and family events deserve the same premium crew as weddings.",
    "category": "Events",
    "date": "2025-11-10",
    "image": "/images/indian/birthday-01.jpg",
    "readTime": "5 min read",
    "content": "First birthdays, 50ths and anniversaries deserve calm, luxury coverage — not rushed party shooters. Ask for social selects and a short reel."
  }
];

export const industries = [
  {
    "slug": "hindu-weddings",
    "title": "Hindu Weddings",
    "text": "Pheras, kanyadaan, saptapadi and multi-day rituals documented with candid emotion and traditional clarity — the coverage Hindu families expect from a WeddingSutra-calibre studio.",
    "image": "/images/indian/wedding-04.jpg"
  },
  {
    "slug": "destination-weddings",
    "title": "Destination Weddings",
    "text": "Palace, beach and resort weddings across Udaipur, Goa, Jaipur and beyond with travel-ready photo and film crews from Mumbai.",
    "image": "/images/indian/wedding-05.jpg"
  },
  {
    "slug": "intimate-weddings",
    "title": "Intimate Weddings",
    "text": "Small guest lists, big emotion — discreet coverage for micro-weddings, court marriages and close-family celebrations.",
    "image": "/images/indian/wedding-03.jpg"
  },
  {
    "slug": "christian-weddings",
    "title": "Christian Weddings",
    "text": "Church ceremonies, aisle moments and reception storytelling with quiet reverence and cinematic polish.",
    "image": "/images/indian/couple-01.jpg"
  },
  {
    "slug": "muslim-weddings",
    "title": "Muslim Weddings",
    "text": "Nikaah, mehendi and walima coverage with cultural sensitivity and luxurious visual craft.",
    "image": "/images/indian/engage-01.jpg"
  },
  {
    "slug": "sikh-weddings",
    "title": "Sikh Weddings",
    "text": "Anand Karaj, baraat and reception documented with respect for ritual timing and joyful candid frames.",
    "image": "/images/indian/wedding-02.jpg"
  }
];

export const locations = [
  {
    "slug": "wedding-photographer-mumbai",
    "title": "Wedding Photographer in Mumbai",
    "city": "Mumbai",
    "service": "Wedding Photography",
    "intro": "Looking for a wedding photographer in Mumbai? DisplayAvenue Studios in Mira Road East delivers candid + traditional coverage and cinematic films for banquets, hotels and destination send-offs across the city."
  },
  {
    "slug": "candid-wedding-photographer-mumbai",
    "title": "Candid Wedding Photographer in Mumbai",
    "city": "Mumbai",
    "service": "Candid Wedding Photography",
    "intro": "Hire a candid wedding photographer in Mumbai who captures emotion without stiff posing — the style couples research most on WeddingSutra and Google."
  },
  {
    "slug": "pre-wedding-shoot-mumbai",
    "title": "Pre Wedding Shoot in Mumbai",
    "city": "Mumbai",
    "service": "Pre Wedding Shoot",
    "intro": "Book a cinematic pre-wedding shoot in Mumbai — Marine Drive, Bandra, studio and Lonavala day trips with guided candid chemistry."
  },
  {
    "slug": "wedding-photographer-delhi",
    "title": "Wedding Photographer in Delhi NCR",
    "city": "Delhi",
    "service": "Wedding Photography",
    "intro": "DisplayAvenue travels to Delhi NCR for luxury weddings — farmhouses, hotels and destination-ready crews with Mumbai cinema standards."
  },
  {
    "slug": "wedding-photographer-goa",
    "title": "Wedding Photographer in Goa",
    "city": "Goa",
    "service": "Destination Wedding Photography",
    "intro": "Beach and resort wedding photography in Goa with drone-ready cinematic films and golden-hour couple portraits."
  },
  {
    "slug": "wedding-photographer-udaipur",
    "title": "Wedding Photographer in Udaipur",
    "city": "Udaipur",
    "service": "Destination Wedding Photography",
    "intro": "Palace and lakeside wedding photography in Udaipur — multi-day destination productions with aerial establishes."
  },
  {
    "slug": "wedding-photographer-jaipur",
    "title": "Wedding Photographer in Jaipur",
    "city": "Jaipur",
    "service": "Wedding Photography",
    "intro": "Fort, palace and heritage wedding coverage in Jaipur with candid storytelling and traditional family portraits."
  },
  {
    "slug": "wedding-photographer-bangalore",
    "title": "Wedding Photographer in Bangalore",
    "city": "Bangalore",
    "service": "Wedding Photography",
    "intro": "Premium wedding photography and films for Bangalore celebrations — gardens, banquet halls and destination extensions."
  },
  {
    "slug": "wedding-photographer-pune",
    "title": "Wedding Photographer in Pune",
    "city": "Pune",
    "service": "Wedding Photography",
    "intro": "Wedding photographer for Pune and Lonavala celebrations with Mumbai-based luxury craft."
  },
  {
    "slug": "maternity-photographer-mumbai",
    "title": "Maternity Photographer in Mumbai",
    "city": "Mumbai",
    "service": "Maternity Photography",
    "intro": "Elegant maternity photography in Mumbai — best booked between weeks 28–34 for flattering, comfortable sessions."
  },
  {
    "slug": "birthday-photographer-mumbai",
    "title": "Birthday Photographer in Mumbai",
    "city": "Mumbai",
    "service": "Birthday Photography",
    "intro": "Premium birthday photography in Mumbai for first birthdays and adult milestone celebrations."
  },
  {
    "slug": "engagement-photographer-mumbai",
    "title": "Engagement Photographer in Mumbai",
    "city": "Mumbai",
    "service": "Engagement Photography",
    "intro": "Engagement and roka photography in Mumbai — ring details, blessings and candid guest stories."
  }
];

export const testimonials = [
  {
    "name": "Aanya & Rohan",
    "role": "Destination Wedding · Udaipur",
    "quote": "Our WeddingSutra-worthy week was captured with cinema calm — pheras light, family groups, and a film we still cry watching.",
    "image": ""
  },
  {
    "name": "Meera & Kabir",
    "role": "Candid Wedding · Mumbai",
    "quote": "True candid photography. No stiff posing, just emotion — exactly what we searched for in a Mumbai wedding photographer.",
    "image": ""
  },
  {
    "name": "Ishita & Dev",
    "role": "Pre-Wedding · Lonavala",
    "quote": "Golden-hour pre-wedding frames became our entire invite suite. Premium from inquiry to gallery.",
    "image": ""
  },
  {
    "name": "Ananya Reddy",
    "role": "Maternity · Mumbai",
    "quote": "Week-32 session felt elegant and safe. Partner portraits are framed in our nursery.",
    "image": ""
  },
  {
    "name": "Rohit & Neha",
    "role": "First Birthday · Thane",
    "quote": "Birthday coverage looked as polished as our friends’ wedding galleries. Guests still ask who shot it.",
    "image": ""
  },
  {
    "name": "Simran Kapoor",
    "role": "Engagement · Mumbai",
    "quote": "Ring macros and candid blessings — engagement night felt like a luxury editorial.",
    "image": ""
  }
];

export const team = [
  {
    "name": "Arjun Mehta",
    "role": "Lead Wedding Photographer",
    "image": ""
  },
  {
    "name": "Diya Sharma",
    "role": "Cinematic Filmmaker",
    "image": ""
  },
  {
    "name": "Kabir Khan",
    "role": "Candid Second Shooter",
    "image": ""
  },
  {
    "name": "Anaya Patel",
    "role": "Producer & Client Experience",
    "image": ""
  }
];

export const whyChoose = [
  {
    "title": "WeddingSutra-calibre craft",
    "text": "Candid emotion, traditional clarity and cinematic films — the three pillars couples research before they book."
  },
  {
    "title": "Mumbai HQ, pan-India travel",
    "text": "Based in Mira Road East with destination crews for Goa, Udaipur, Jaipur, Delhi and beyond."
  },
  {
    "title": "Transparent packages",
    "text": "Essential, Signature and Luxury tiers with written deliverables — no surprise add-ons on wedding week."
  },
  {
    "title": "Life’s full chapter",
    "text": "Weddings, pre-weddings, engagements, maternity, birthdays and all personal event coverage under one premium studio."
  }
];

export const processSteps = [
  {
    "step": "01",
    "title": "Enquiry & date check",
    "text": "Share your city, functions and date. We confirm availability on WhatsApp within hours."
  },
  {
    "step": "02",
    "title": "Style consult",
    "text": "Review galleries, discuss candid vs traditional balance, film length and must-have rituals."
  },
  {
    "step": "03",
    "title": "Package & token",
    "text": "Choose Essential, Signature or Luxury. Pay a booking token to reserve your crew."
  },
  {
    "step": "04",
    "title": "Wedding-week plan",
    "text": "Run-of-show, shot list, family VIPs and venue logistics locked before the first function."
  },
  {
    "step": "05",
    "title": "Coverage & cinema",
    "text": "Calm on-ground crew for every ritual — stills, film, drone where permitted."
  },
  {
    "step": "06",
    "title": "Gallery & film delivery",
    "text": "Social selects fast; full gallery and films on your agreed timeline with private access codes."
  }
];

