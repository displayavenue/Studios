export type ServiceReview = {
  name: string;
  role: string;
  quote: string;
  rating?: number;
  image?: string;
};

export type ServiceTip = {
  title: string;
  text: string;
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  benefits: string[];
  image: string;
  category: "Wedding" | "Pre-Wedding" | "Engagement" | "Maternity" | "Birthday" | "Events";
  related: string[];
  youtubeUrl?: string;
  reviews?: ServiceReview[];
  tips?: ServiceTip[];
  priceFrom?: string;
  priceNote?: string;
  deliverables?: string[];
  equipment?: string[];
};

export const services: Service[] = [
  {
    "slug": "wedding-photography",
    "title": "Wedding Photography",
    "short": "Luxury candid + traditional wedding photography for Mumbai and pan-India celebrations.",
    "description": "DisplayAvenue Studios is a premium wedding photographer in Mumbai trusted for candid storytelling and heirloom traditional portraits. Inspired by the craft standards couples discover on WeddingSutra — spontaneous emotion, ritual clarity, and albums families reopen for decades — we cover pheras, mehendi, sangeet and receptions with a calm, cinema-minded crew.",
    "benefits": [
      "Candid + traditional hybrid coverage",
      "Lead photographer + second shooter options",
      "Family group portraits elders expect",
      "Colour-graded gallery + album design credit",
      "Pan-India destination travel"
    ],
    "image": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=80",
    "category": "Wedding",
    "related": [
      "candid-wedding-photography",
      "wedding-films",
      "pre-wedding-shoot"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹75,000",
    "priceNote": "Starting · single ceremony day",
    "deliverables": [
      "300–1,500+ edited photographs (package dependent)",
      "Private online gallery",
      "Social media selects within 48 hours",
      "Optional designer album"
    ],
    "equipment": [
      "Full-frame mirrorless bodies",
      "Prime & zoom lenses",
      "Off-camera flash & LED",
      "Backup media workflow"
    ]
  },
  {
    "slug": "candid-wedding-photography",
    "title": "Candid Wedding Photography",
    "short": "Hidden-camera emotion, zero stiff posing — India’s most searched wedding photography style.",
    "description": "Candid wedding photography — as WeddingSutra describes it — captures laughter, tears and surprise without staged poses. Couples searching for a candid wedding photographer in Mumbai choose DisplayAvenue for discreet coverage that still delivers the polished frames Instagram demands.",
    "benefits": [
      "True candid documentary approach",
      "Guided couple moments without rigid posing",
      "Ideal for social-first couples",
      "Pairs perfectly with cinematic film",
      "Available across India destinations"
    ],
    "image": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
    "category": "Wedding",
    "related": [
      "wedding-photography",
      "wedding-films",
      "sangeet-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹95,000",
    "priceNote": "Starting · full ceremony day",
    "deliverables": [
      "800+ colour-graded candid frames",
      "Highlight shortlist for Instagram",
      "Optional same-day teaser stills"
    ],
    "equipment": [
      "Fast primes for low light",
      "Silent shutter bodies",
      "Gimbal-friendly coordination with film team"
    ]
  },
  {
    "slug": "traditional-wedding-photography",
    "title": "Traditional Wedding Photography",
    "short": "Classic posed family portraits and ritual documentation elders treasure.",
    "description": "Traditional wedding photography remains essential on Indian wedding days. We create organised family groups, ritual sequences and formal portraits — the cost-effective, timeless layer WeddingSutra notes families still prefer — alongside modern candid coverage when booked as a hybrid.",
    "benefits": [
      "Formal family group portraits",
      "Ritual step documentation",
      "Clear posing direction for large families",
      "Ideal add-on to candid packages",
      "Fast turnaround for thank-you cards"
    ],
    "image": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1400&q=80",
    "category": "Wedding",
    "related": [
      "wedding-photography",
      "reception-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹55,000",
    "priceNote": "Starting · ceremony coverage",
    "deliverables": [
      "Organised group sets",
      "Ritual highlight gallery",
      "Print-ready files"
    ],
    "equipment": [
      "Studio lights for banquet halls",
      "Wide lenses for large groups"
    ]
  },
  {
    "slug": "wedding-films",
    "title": "Cinematic Wedding Films",
    "short": "Cinematic wedding videography — highlight films, teasers and feature-length stories.",
    "description": "Cinematic videography turns your wedding into a movie: multi-camera coverage, drone where permitted, colour grade and score. Searches for cinematic wedding photographer / videographer have surged across Mumbai and India — we deliver 3–5 minute highlights plus longer films for Luxury packages.",
    "benefits": [
      "Multi-camera cinematic coverage",
      "3–5 min highlight + optional feature film",
      "Drone sequences (venue permitting)",
      "Same-day teaser available",
      "Colour-graded, scored delivery"
    ],
    "image": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80",
    "category": "Wedding",
    "related": [
      "wedding-photography",
      "candid-wedding-photography",
      "destination-wedding-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹1,25,000",
    "priceNote": "Starting · highlight film package",
    "deliverables": [
      "Highlight film (3–5 min)",
      "Vertical reels for Instagram",
      "Optional 20–40 min feature film",
      "Private streaming gallery"
    ],
    "equipment": [
      "Cinema cameras / hybrid bodies",
      "Gimbals & wireless audio",
      "Drone (DGCA compliant)"
    ]
  },
  {
    "slug": "destination-wedding-photography",
    "title": "Destination Wedding Photography",
    "short": "Udaipur, Goa, Jaipur & beyond — travel-ready luxury wedding crews from Mumbai.",
    "description": "Destination weddings need production discipline: travel logistics, venue familiarity and golden-hour planning. DisplayAvenue Studios brings Mumbai HQ craft to palace, beach and resort weddings across India — the destination coverage couples research when browsing WeddingSutra favourites.",
    "benefits": [
      "Travel-ready photo + film crew",
      "Venue recce & timeline planning",
      "Drone & low-light specialists",
      "Multi-day coverage options",
      "Guest experience coordination"
    ],
    "image": "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1400&q=80",
    "category": "Wedding",
    "related": [
      "wedding-photography",
      "wedding-films",
      "pre-wedding-shoot"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹2,50,000",
    "priceNote": "Starting · travel production",
    "deliverables": [
      "Full destination gallery",
      "Cinematic highlight film",
      "Travel & stay planning support"
    ],
    "equipment": [
      "Travel cinema kit",
      "Drone + backups",
      "Local fixer network"
    ]
  },
  {
    "slug": "pre-wedding-shoot",
    "title": "Pre Wedding Shoot",
    "short": "Cinematic pre-wedding photography & films for save-the-dates and invitations.",
    "description": "Pre-wedding photography is a rage with millennial couples — picturesque backdrops, guided candid chemistry, golden-hour light. WeddingSutra advises mixing posed elegance with unscripted laughter. We craft Mumbai city, Lonavala, studio and destination pre-wedding shoots that feel like mini films.",
    "benefits": [
      "Guided candid + portrait blend",
      "Location scouting included",
      "Outfit change guidance",
      "Invite & save-the-date crops",
      "Optional cinematic pre-wedding film"
    ],
    "image": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=80",
    "category": "Pre-Wedding",
    "related": [
      "engagement-photography",
      "wedding-photography",
      "wedding-films"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Golden-hour chemistry shots we used on every invite. Soft light, zero stiff poses.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rhea Kapoor",
        "role": "Bride-to-be · Mumbai",
        "quote": "Marine Drive + studio combo felt premium and personal.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Best season Oct–Mar",
        "text": "Pleasant weather and softer sun make October to March ideal for outdoor pre-wedding shoots in India."
      },
      {
        "title": "Golden hour first",
        "text": "Book sunrise or sunset slots — warm tones flatter skin and create cinematic silhouettes."
      },
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      }
    ],
    "priceFrom": "₹35,000",
    "priceNote": "Starting · half-day couple shoot",
    "deliverables": [
      "80–200 edited photographs",
      "Social crop set",
      "Optional 60–90 sec film"
    ],
    "equipment": [
      "Portrait primes",
      "Reflectors & portable light",
      "Drone optional"
    ]
  },
  {
    "slug": "engagement-photography",
    "title": "Engagement Photography",
    "short": "Ring ceremonies, rokas and intimate engagement parties — photographed with luxury calm.",
    "description": "Engagement photography captures the first public celebration of your promise — ring details, family blessings and candid joy. Ideal for couples who want WeddingSutra-level polish before the wedding week begins.",
    "benefits": [
      "Ring & detail macros",
      "Family blessing coverage",
      "Candid guest storytelling",
      "Same-week social gallery",
      "Add film or reel packages"
    ],
    "image": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1400&q=80",
    "category": "Engagement",
    "related": [
      "pre-wedding-shoot",
      "wedding-photography",
      "event-coverage"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Simran & Kabir",
        "role": "Engagement · Mumbai",
        "quote": "Ring close-ups and candid laughter — guests still ask for our photographer.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹45,000",
    "priceNote": "Starting · engagement evening",
    "deliverables": [
      "Edited engagement gallery",
      "Detail set for invites",
      "Optional highlight reel"
    ],
    "equipment": [
      "Macro + portrait lenses",
      "Low-light banquet kit"
    ]
  },
  {
    "slug": "maternity-photography",
    "title": "Maternity Photography",
    "short": "Elegant maternity portraits between weeks 28–34 — soft light, partner frames, heirloom feel.",
    "description": "Maternity photography deserves the same premium craft as wedding work. We specialise in flattering bump silhouettes, partner connection frames and serene studio or outdoor sessions timed for the classic 28–34 week window.",
    "benefits": [
      "Best booked at 28–34 weeks",
      "Guided, comfortable posing",
      "Partner & sibling add-ons",
      "Studio or golden-hour outdoor",
      "Heirloom retouching"
    ],
    "image": "https://images.unsplash.com/photo-1492725764893-90b379c2b6e0?auto=format&fit=crop&w=1400&q=80",
    "category": "Maternity",
    "related": [
      "birthday-photography",
      "pre-wedding-shoot",
      "event-coverage"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits at 32 weeks felt elegant, never clinical. Partner frames are our favourite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kavya Iyer",
        "role": "Mum-to-be · Pune",
        "quote": "Soft indoor light and guided poses made us relax instantly.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Book weeks 28–34",
        "text": "This window balances a defined bump with comfort for posing and travel to the location."
      },
      {
        "title": "Comfort first outfits",
        "text": "Flowing solids in earth or pastel tones photograph cleaner than busy prints."
      },
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      }
    ],
    "priceFrom": "₹25,000",
    "priceNote": "Starting · studio or outdoor session",
    "deliverables": [
      "40–80 edited portraits",
      "Print-ready files",
      "Optional mini-album"
    ],
    "equipment": [
      "Softbox & natural light setups",
      "Flattering portrait primes"
    ]
  },
  {
    "slug": "birthday-photography",
    "title": "Birthday Photography",
    "short": "First birthdays to milestone celebrations — candid party coverage with premium polish.",
    "description": "Birthday photography for DisplayAvenue means editorial candid coverage — cake moments, family groups and dance-floor energy without cheap party-videographer aesthetics. From 1st birthdays to 50th soirées across Mumbai.",
    "benefits": [
      "Candid + key posed groups",
      "Cake & décor detail set",
      "Kid-friendly quiet approach",
      "Same-week gallery",
      "Optional reel for invites/thanks"
    ],
    "image": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1400&q=80",
    "category": "Birthday",
    "related": [
      "event-coverage",
      "maternity-photography",
      "engagement-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Rohit Desai",
        "role": "Parent · Mumbai",
        "quote": "First birthday candid coverage — cake smash and family groups both perfect.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Neha Banerjee",
        "role": "Host · Thane",
        "quote": "Adult milestone birthday film felt luxury, not party-videographer.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹18,000",
    "priceNote": "Starting · 3-hour coverage",
    "deliverables": [
      "Edited birthday gallery",
      "Highlight shortlist",
      "Optional vertical reel"
    ],
    "equipment": [
      "Fast low-light lenses",
      "On-camera & bounce flash"
    ]
  },
  {
    "slug": "event-coverage",
    "title": "Event Coverage",
    "short": "All personal event coverage — anniversaries, pujas, receptions, family celebrations.",
    "description": "Beyond weddings, DisplayAvenue provides all-event coverage for the celebrations that shape a family’s year: anniversaries, thread ceremonies, housewarmings, cocktail nights and receptions. One premium visual language across every milestone.",
    "benefits": [
      "Photo, film or combined crews",
      "Timeline-led coverage",
      "Guest-friendly discreet team",
      "Fast social delivery",
      "Scales from intimate to grand"
    ],
    "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=80",
    "category": "Events",
    "related": [
      "birthday-photography",
      "reception-photography",
      "wedding-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Vikram Joshi",
        "role": "Host · Mumbai",
        "quote": "Anniversary soirée coverage looked editorial. Quiet team, loud results.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹22,000",
    "priceNote": "Starting · half-day event",
    "deliverables": [
      "Edited event gallery",
      "Optional highlight reel",
      "Private client gallery code"
    ],
    "equipment": [
      "Event hybrid kits",
      "Wireless audio for speeches"
    ]
  },
  {
    "slug": "haldi-photography",
    "title": "Haldi Photography",
    "short": "Colour, laughter and ritual — vibrant Haldi morning coverage.",
    "description": "Haldi ceremonies are pure texture and joy. We capture turmeric rituals, playful family moments and fashion details that set the tone for your wedding week.",
    "benefits": [
      "Vibrant colour-accurate edits",
      "Ritual + candid balance",
      "Detail plates of décor & outfits",
      "Pairs with mehendi packages"
    ],
    "image": "https://images.unsplash.com/photo-1587271636175-90d58cdad458?auto=format&fit=crop&w=1400&q=80",
    "category": "Wedding",
    "related": [
      "mehendi-photography",
      "wedding-photography",
      "sangeet-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹28,000",
    "priceNote": "Starting · Haldi function",
    "deliverables": [
      "Edited Haldi gallery",
      "Social story set"
    ],
    "equipment": [
      "Weather-sealed bodies",
      "Fast primes"
    ]
  },
  {
    "slug": "mehendi-photography",
    "title": "Mehendi Photography",
    "short": "Intricate mehendi detail, guest portraits and evening ambience.",
    "description": "Mehendi photography thrives on macro detail and soft candid storytelling — hands, patterns, music and the quiet before the wedding storm.",
    "benefits": [
      "Macro mehendi plates",
      "Guest lifestyle candids",
      "Décor & floral stories",
      "Evening ambient coverage"
    ],
    "image": "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?auto=format&fit=crop&w=1400&q=80",
    "category": "Wedding",
    "related": [
      "haldi-photography",
      "sangeet-photography",
      "wedding-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹28,000",
    "priceNote": "Starting · Mehendi function",
    "deliverables": [
      "Edited Mehendi gallery",
      "Detail select set"
    ],
    "equipment": [
      "Macro lenses",
      "Portable LED"
    ]
  },
  {
    "slug": "sangeet-photography",
    "title": "Sangeet Photography",
    "short": "Dance-floor energy, performances and night-time glamour.",
    "description": "Sangeet nights demand low-light mastery and performance timing. We cover choreographed numbers, family dances and fashion with concert-level clarity.",
    "benefits": [
      "Performance peak moments",
      "Low-light specialist crew",
      "Optional multi-cam film",
      "Guest dance-floor stories"
    ],
    "image": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=80",
    "category": "Wedding",
    "related": [
      "wedding-films",
      "reception-photography",
      "candid-wedding-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹40,000",
    "priceNote": "Starting · Sangeet night",
    "deliverables": [
      "Edited Sangeet gallery",
      "Performance highlight set",
      "Optional reel"
    ],
    "equipment": [
      "Fast f/1.2–f/1.8 glass",
      "Monopods & gimbals"
    ]
  },
  {
    "slug": "reception-photography",
    "title": "Reception Photography",
    "short": "Grand entrances, speeches and the last dance — reception storytelling.",
    "description": "Reception photography closes the wedding arc: couple entrances, cake, speeches and farewells. We keep coverage elegant for banquet halls and outdoor dinners alike.",
    "benefits": [
      "Entrance & stage coverage",
      "Speech & toast moments",
      "Family formal sets",
      "Dance-floor candids"
    ],
    "image": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1400&q=80",
    "category": "Wedding",
    "related": [
      "wedding-photography",
      "wedding-films",
      "event-coverage"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹45,000",
    "priceNote": "Starting · reception evening",
    "deliverables": [
      "Edited reception gallery",
      "Thank-you card selects"
    ],
    "equipment": [
      "Banquet lighting kit",
      "Fast telephoto options"
    ]
  },
  {
    "slug": "wedding-drone-coverage",
    "title": "Wedding Drone Coverage",
    "short": "Aerial establishing shots for destination and resort weddings.",
    "description": "Drone coverage adds the sweeping palace, beach and estate frames cinematic wedding films are known for — always venue-permitted and DGCA compliant.",
    "benefits": [
      "Establishing aerials",
      "Baraat & venue reveals",
      "Safe licensed pilots",
      "Edited stills + film plates"
    ],
    "image": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1400&q=80",
    "category": "Wedding",
    "related": [
      "destination-wedding-photography",
      "wedding-films"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Calm crew, stunning pheras light, and a highlight film our families still replay. Worth every rupee.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid frames felt like a hidden camera — zero awkward poses, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day coverage never felt intrusive. Elders loved the traditional groups; we loved the cinema.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception looked like a movie. Same-week social selects helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, nothing was missed. Album design credit made gifting parents easy.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Candid vs traditional",
        "text": "WeddingSutra notes candid photography captures emotion without staged poses, while traditional coverage keeps family group portraits elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Top Mumbai wedding photographers fill peak season (Nov–Feb & wedding muhurat dates) early. Hold your crew with a token once dates are fixed."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timelines, VIP family members, and Pinterest references before the wedding week so nothing sacred is missed."
      },
      {
        "title": "Same-day social selects",
        "text": "Couples now expect Instagram-ready frames within 24–48 hours. Ask for a same-day edit teaser in your package."
      },
      {
        "title": "Drone needs permissions",
        "text": "Palace, beach and banquet aerials need venue clearance and DGCA-compliant pilots — confirm before promising sky shots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel events (bride prep + baraat) need at least two photographers so no key moment is orphaned."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, film length, album credit, raw delivery and timeline in the contract — WeddingSutra’s hiring tip #1."
      },
      {
        "title": "Golden hour couple portraits",
        "text": "Schedule 20–30 quiet minutes at sunset for cinematic couple frames guests never interrupt."
      },
      {
        "title": "Colour grading consistency",
        "text": "Photo and film from one studio keep skin tones and colour language consistent across Instagram, album and cinema."
      },
      {
        "title": "Destination logistics",
        "text": "For Goa, Udaipur or Jaipur, lock travel, stay and local fixer early — luxury coverage is half planning, half craft."
      }
    ],
    "priceFrom": "₹15,000",
    "priceNote": "Add-on · per event day",
    "deliverables": [
      "Aerial still selects",
      "4K aerial clips for film"
    ],
    "equipment": [
      "DGCA-compliant drone",
      "ND filters & backups"
    ]
  }
];

export const homeServices: string[] = [
  "wedding-photography",
  "candid-wedding-photography",
  "wedding-films",
  "pre-wedding-shoot",
  "engagement-photography",
  "maternity-photography",
  "birthday-photography",
  "event-coverage"
];

export const fallbackServices = services;
export const fallbackHomeServices = homeServices;
