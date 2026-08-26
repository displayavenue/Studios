export type ServiceReview = { name: string; role: string; quote: string; rating?: number; image?: string; };
export type ServiceTip = { title: string; text: string; };
export type Service = {
  slug: string; title: string; short: string; description: string; benefits: string[]; image: string;
  category: "Wedding" | "Pre-Wedding" | "Engagement" | "Maternity" | "Birthday" | "Events";
  related: string[]; youtubeUrl?: string; reviews?: ServiceReview[]; tips?: ServiceTip[];
  priceFrom?: string; priceNote?: string; deliverables?: string[]; equipment?: string[];
};
export const services: Service[] = [
  {
    "slug": "wedding-photography",
    "title": "Wedding Photography",
    "short": "Luxury candid + traditional wedding photography for Indian celebrations.",
    "description": "DisplayAvenue Studios is a premium wedding photographer in Mumbai for Indian weddings — candid emotion, traditional family portraits and heirloom colour grading across pheras, mehendi, sangeet and receptions.",
    "benefits": [
      "Candid + traditional hybrid",
      "Lead + second shooter options",
      "Family group portraits",
      "Pan-India destination travel",
      "Pairs with wedding videography"
    ],
    "image": "/images/indian/wedding-03.jpg",
    "category": "Wedding",
    "related": [
      "wedding-videography",
      "candid-wedding-photography",
      "wedding-films"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹75,000",
    "priceNote": "Starting · single ceremony day",
    "deliverables": [
      "300–1,500+ edited photographs",
      "Private online gallery",
      "48-hour social selects",
      "Optional designer album"
    ],
    "equipment": [
      "Full-frame bodies",
      "Primes & zooms",
      "Off-camera flash",
      "Backup media"
    ]
  },
  {
    "slug": "candid-wedding-photography",
    "title": "Candid Wedding Photography",
    "short": "Hidden-camera emotion for Indian weddings — India’s most searched style.",
    "description": "True candid wedding photography for Indian couples in Mumbai — laughter, tears and ritual details without stiff posing, with Instagram-ready selects.",
    "benefits": [
      "Documentary candid approach",
      "Guided couple moments",
      "Ideal with cinematic film",
      "Low-light specialist crew"
    ],
    "image": "/images/indian/w2-alt.jpg",
    "category": "Wedding",
    "related": [
      "wedding-photography",
      "wedding-films",
      "wedding-videography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹95,000",
    "priceNote": "Starting · full ceremony day",
    "deliverables": [
      "800+ colour-graded candid frames",
      "Instagram shortlist",
      "Optional same-day teaser stills"
    ],
    "equipment": [
      "Fast primes",
      "Silent shutter bodies"
    ]
  },
  {
    "slug": "traditional-wedding-photography",
    "title": "Traditional Wedding Photography",
    "short": "Classic posed family portraits and Indian ritual documentation.",
    "description": "Organised family groups, pheras sequences and formal portraits Indian elders treasure — booked alone or hybrid with candid coverage.",
    "benefits": [
      "Formal family groups",
      "Ritual step documentation",
      "Clear posing for large families"
    ],
    "image": "/images/indian/couple-01.jpg",
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
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
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
      "Studio lights",
      "Wide lenses"
    ]
  },
  {
    "slug": "destination-wedding-photography",
    "title": "Destination Wedding Photography",
    "short": "Udaipur, Goa, Jaipur & beyond — Indian destination wedding stills.",
    "description": "Travel-ready photography for palace, beach and resort Indian weddings with Mumbai HQ craft and golden-hour planning.",
    "benefits": [
      "Travel photo crew",
      "Venue recce",
      "Multi-day coverage",
      "Pairs with destination film"
    ],
    "image": "/images/indian/wedding-04.jpg",
    "category": "Wedding",
    "related": [
      "destination-wedding-videography",
      "wedding-photography",
      "wedding-films"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹2,50,000",
    "priceNote": "Starting · travel production",
    "deliverables": [
      "Full destination gallery",
      "Social selects",
      "Travel planning support"
    ],
    "equipment": [
      "Travel kit",
      "Backup bodies"
    ]
  },
  {
    "slug": "pre-wedding-shoot",
    "title": "Pre Wedding Photography",
    "short": "Cinematic pre-wedding photography for Indian couples — invites & save-the-dates.",
    "description": "Guided candid chemistry shoots for Indian couples across Mumbai, Lonavala and destinations — golden-hour light and invite-ready crops.",
    "benefits": [
      "Guided candid + portraits",
      "Location scouting",
      "Outfit-change guidance",
      "Invite crops"
    ],
    "image": "/images/indian/wedding-07.jpg",
    "category": "Pre-Wedding",
    "related": [
      "pre-wedding-videography",
      "engagement-photography",
      "wedding-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹35,000",
    "priceNote": "Starting · half-day couple shoot",
    "deliverables": [
      "80–200 edited photographs",
      "Social crop set"
    ],
    "equipment": [
      "Portrait primes",
      "Reflectors"
    ]
  },
  {
    "slug": "engagement-photography",
    "title": "Engagement Photography",
    "short": "Ring ceremonies, rokas and engagement parties for Indian families.",
    "description": "Premium engagement photography in Mumbai — ring details, blessings and candid guest stories with same-week galleries.",
    "benefits": [
      "Ring & detail macros",
      "Family blessings",
      "Candid guest storytelling"
    ],
    "image": "/images/indian/engage-01.jpg",
    "category": "Engagement",
    "related": [
      "engagement-videography",
      "pre-wedding-shoot",
      "wedding-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹45,000",
    "priceNote": "Starting · engagement evening",
    "deliverables": [
      "Edited engagement gallery",
      "Invite detail set"
    ],
    "equipment": [
      "Macro + portrait lenses"
    ]
  },
  {
    "slug": "maternity-photography",
    "title": "Maternity Photography",
    "short": "Elegant Indian maternity portraits — weeks 28–34.",
    "description": "Premium maternity photography for Indian parents in Mumbai — soft light, partner frames and heirloom retouching.",
    "benefits": [
      "Best at 28–34 weeks",
      "Guided comfortable posing",
      "Partner & sibling add-ons"
    ],
    "image": "/images/indian/maternity-01.jpg",
    "category": "Maternity",
    "related": [
      "maternity-videography",
      "birthday-photography",
      "pre-wedding-shoot"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹25,000",
    "priceNote": "Starting · studio or outdoor",
    "deliverables": [
      "40–80 edited portraits",
      "Print-ready files"
    ],
    "equipment": [
      "Softbox & natural light"
    ]
  },
  {
    "slug": "birthday-photography",
    "title": "Birthday Photography",
    "short": "First birthdays to milestone celebrations — Indian family candid coverage.",
    "description": "Premium birthday photography in Mumbai for Indian families — cake moments, décor and dance-floor energy with luxury polish.",
    "benefits": [
      "Candid + key groups",
      "Cake & décor details",
      "Kid-friendly approach"
    ],
    "image": "/images/indian/birthday-01.jpg",
    "category": "Birthday",
    "related": [
      "birthday-videography",
      "event-coverage",
      "maternity-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹18,000",
    "priceNote": "Starting · 3-hour coverage",
    "deliverables": [
      "Edited birthday gallery",
      "Social shortlist"
    ],
    "equipment": [
      "Fast low-light lenses"
    ]
  },
  {
    "slug": "event-coverage",
    "title": "Event Photography",
    "short": "All personal Indian event photography — anniversaries, pujas, receptions.",
    "description": "Premium photography for Indian family celebrations beyond weddings — anniversaries, thread ceremonies, housewarmings and cocktail nights.",
    "benefits": [
      "Timeline-led coverage",
      "Discreet guest-friendly team",
      "Fast social delivery"
    ],
    "image": "/images/indian/film-01.jpg",
    "category": "Events",
    "related": [
      "event-videography",
      "reception-photography",
      "birthday-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹22,000",
    "priceNote": "Starting · half-day event",
    "deliverables": [
      "Edited event gallery",
      "Private gallery code"
    ],
    "equipment": [
      "Event hybrid kits"
    ]
  },
  {
    "slug": "haldi-photography",
    "title": "Haldi Photography",
    "short": "Colour, laughter and ritual — Indian Haldi morning coverage.",
    "description": "Vibrant Haldi photography for Indian weddings — turmeric rituals, playful family moments and fashion details.",
    "benefits": [
      "Colour-accurate edits",
      "Ritual + candid balance"
    ],
    "image": "/images/indian/ritual-01.jpg",
    "category": "Wedding",
    "related": [
      "haldi-videography",
      "mehendi-photography",
      "wedding-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹28,000",
    "priceNote": "Starting · Haldi function",
    "deliverables": [
      "Edited Haldi gallery",
      "Social story set"
    ],
    "equipment": [
      "Weather-sealed bodies"
    ]
  },
  {
    "slug": "mehendi-photography",
    "title": "Mehendi Photography",
    "short": "Intricate mehendi detail and Indian guest storytelling.",
    "description": "Mehendi photography with macro detail plates, décor stories and evening ambience for Indian wedding weeks.",
    "benefits": [
      "Macro mehendi plates",
      "Guest lifestyle candids"
    ],
    "image": "/images/indian/mehndi-01.jpg",
    "category": "Wedding",
    "related": [
      "mehendi-videography",
      "sangeet-photography",
      "wedding-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹28,000",
    "priceNote": "Starting · Mehendi function",
    "deliverables": [
      "Edited Mehendi gallery",
      "Detail select set"
    ],
    "equipment": [
      "Macro lenses"
    ]
  },
  {
    "slug": "sangeet-photography",
    "title": "Sangeet Photography",
    "short": "Dance-floor energy and Indian performance nights.",
    "description": "Low-light sangeet photography for choreographed numbers, family dances and fashion at Indian wedding celebrations.",
    "benefits": [
      "Performance peaks",
      "Low-light specialists",
      "Optional multi-cam film pair"
    ],
    "image": "/images/indian/wedding-06.jpg",
    "category": "Wedding",
    "related": [
      "sangeet-videography",
      "wedding-films",
      "reception-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹40,000",
    "priceNote": "Starting · Sangeet night",
    "deliverables": [
      "Edited Sangeet gallery",
      "Performance highlight set"
    ],
    "equipment": [
      "Fast glass",
      "Gimbals"
    ]
  },
  {
    "slug": "reception-photography",
    "title": "Reception Photography",
    "short": "Grand entrances, speeches and the last dance.",
    "description": "Indian wedding reception photography — entrances, cake, speeches and farewells with banquet and outdoor dinner expertise.",
    "benefits": [
      "Entrance & stage",
      "Speech moments",
      "Dance-floor candids"
    ],
    "image": "/images/indian/reception-alt.jpg",
    "category": "Wedding",
    "related": [
      "reception-videography",
      "wedding-photography",
      "event-videography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹45,000",
    "priceNote": "Starting · reception evening",
    "deliverables": [
      "Edited reception gallery",
      "Thank-you selects"
    ],
    "equipment": [
      "Banquet lighting kit"
    ]
  },
  {
    "slug": "wedding-videography",
    "title": "Wedding Videography",
    "short": "Traditional + cinematic wedding videography for Indian celebrations.",
    "description": "Full wedding videography in Mumbai — multi-camera coverage of Indian rituals, vows, speeches and dance floors with colour-graded delivery and optional traditional long-form edits.",
    "benefits": [
      "Multi-camera coverage",
      "Traditional long-form option",
      "Highlight + reels",
      "Wireless audio for vows"
    ],
    "image": "/images/indian/film-01.jpg",
    "category": "Wedding",
    "related": [
      "wedding-films",
      "wedding-photography",
      "candid-wedding-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹95,000",
    "priceNote": "Starting · ceremony film day",
    "deliverables": [
      "Highlight film 3–5 min",
      "Optional traditional edit",
      "Vertical reels",
      "Private streaming link"
    ],
    "equipment": [
      "Cinema / hybrid cameras",
      "Gimbals",
      "Wireless mics"
    ]
  },
  {
    "slug": "wedding-films",
    "title": "Cinematic Wedding Films",
    "short": "Cinematic Indian wedding films — teasers, highlights and feature stories.",
    "description": "Movie-style wedding films for Indian couples: multi-cam, drone where permitted, score and grade. Ideal with photography packages for a complete visual story.",
    "benefits": [
      "Cinematic highlight 3–5 min",
      "Feature film options",
      "Drone plates (permitted)",
      "Same-day teaser available"
    ],
    "image": "/images/indian/film-01.jpg",
    "category": "Wedding",
    "related": [
      "wedding-videography",
      "wedding-photography",
      "destination-wedding-videography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹1,25,000",
    "priceNote": "Starting · highlight film package",
    "deliverables": [
      "Highlight film",
      "Vertical reels",
      "Optional 20–40 min feature"
    ],
    "equipment": [
      "Cinema cameras",
      "Gimbals",
      "DGCA drone"
    ]
  },
  {
    "slug": "destination-wedding-videography",
    "title": "Destination Wedding Videography",
    "short": "Travel film crews for Indian destination weddings.",
    "description": "Cinematic destination wedding videography across Goa, Udaipur, Jaipur and India — travel logistics, venue familiarity and aerial establishes.",
    "benefits": [
      "Travel film crew",
      "Multi-day cinema coverage",
      "Drone establishes",
      "Priority edit timeline"
    ],
    "image": "/images/indian/wedding-04.jpg",
    "category": "Wedding",
    "related": [
      "destination-wedding-photography",
      "wedding-films",
      "wedding-drone-coverage"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹2,75,000",
    "priceNote": "Starting · travel film production",
    "deliverables": [
      "Destination highlight film",
      "Feature option",
      "Reel set"
    ],
    "equipment": [
      "Travel cinema kit",
      "Drone"
    ]
  },
  {
    "slug": "pre-wedding-videography",
    "title": "Pre Wedding Videography",
    "short": "Cinematic pre-wedding films for Indian couples.",
    "description": "Short cinematic pre-wedding films and vertical reels for Indian couples — chemistry-led storytelling for invites, websites and sangeet screens.",
    "benefits": [
      "60–90 sec cinematic film",
      "Vertical reel cuts",
      "Location scouting",
      "Guided movement"
    ],
    "image": "/images/indian/couple-02.jpg",
    "category": "Pre-Wedding",
    "related": [
      "pre-wedding-shoot",
      "engagement-videography",
      "wedding-films"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹45,000",
    "priceNote": "Starting · half-day film",
    "deliverables": [
      "Pre-wedding film",
      "Reel exports",
      "Colour grade"
    ],
    "equipment": [
      "Gimbal + primes",
      "Wireless audio"
    ]
  },
  {
    "slug": "engagement-videography",
    "title": "Engagement Videography",
    "short": "Engagement and roka films for Indian families.",
    "description": "Highlight reels and short films for Indian engagement ceremonies — ring moments, blessings and guest energy.",
    "benefits": [
      "Ceremony highlight reel",
      "Speech audio capture",
      "Same-week social cut"
    ],
    "image": "/images/indian/engage-02.jpg",
    "category": "Engagement",
    "related": [
      "engagement-photography",
      "pre-wedding-videography",
      "wedding-videography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹40,000",
    "priceNote": "Starting · engagement evening film",
    "deliverables": [
      "Highlight reel",
      "Vertical clips"
    ],
    "equipment": [
      "Hybrid camera + gimbal"
    ]
  },
  {
    "slug": "maternity-videography",
    "title": "Maternity Videography",
    "short": "Soft cinematic maternity films for Indian parents-to-be.",
    "description": "Short maternity films capturing bump portraits, partner connection and announcement-ready clips for Indian families.",
    "benefits": [
      "30–60 sec announcement film",
      "Partner frames",
      "Gentle guided direction"
    ],
    "image": "/images/indian/maternity-01.jpg",
    "category": "Maternity",
    "related": [
      "maternity-photography",
      "birthday-videography",
      "pre-wedding-videography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹22,000",
    "priceNote": "Starting · session film",
    "deliverables": [
      "Maternity film",
      "Vertical announcement cut"
    ],
    "equipment": [
      "Portrait cinema kit"
    ]
  },
  {
    "slug": "birthday-videography",
    "title": "Birthday Videography",
    "short": "Birthday films and reels for Indian family celebrations.",
    "description": "Cinematic birthday videography in Mumbai — cake moments, family speeches and highlight reels for first birthdays and milestones.",
    "benefits": [
      "Highlight reel",
      "Speech audio",
      "Kid-friendly crew"
    ],
    "image": "/images/indian/birthday-01.jpg",
    "category": "Birthday",
    "related": [
      "birthday-photography",
      "event-videography",
      "maternity-videography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹20,000",
    "priceNote": "Starting · 3-hour film coverage",
    "deliverables": [
      "Birthday highlight",
      "Vertical reel"
    ],
    "equipment": [
      "Gimbal + low-light glass"
    ]
  },
  {
    "slug": "event-videography",
    "title": "Event Videography",
    "short": "All personal Indian event videography.",
    "description": "Film coverage for Indian anniversaries, pujas, cocktail nights and family celebrations — same luxury standard as our wedding films.",
    "benefits": [
      "Event highlight reel",
      "Speech capture",
      "Social-first cuts"
    ],
    "image": "/images/indian/film-01.jpg",
    "category": "Events",
    "related": [
      "event-coverage",
      "reception-videography",
      "birthday-videography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹25,000",
    "priceNote": "Starting · half-day film",
    "deliverables": [
      "Highlight film",
      "Private stream link"
    ],
    "equipment": [
      "Event cinema kit"
    ]
  },
  {
    "slug": "haldi-videography",
    "title": "Haldi Videography",
    "short": "Colourful Haldi films for Indian wedding mornings.",
    "description": "Short Haldi films capturing turmeric play, music and family joy — perfect social teasers for wedding week.",
    "benefits": [
      "Vibrant colour grade",
      "Music + ambient audio",
      "Vertical social cuts"
    ],
    "image": "/images/indian/ritual-01.jpg",
    "category": "Wedding",
    "related": [
      "haldi-photography",
      "mehendi-videography",
      "wedding-films"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹25,000",
    "priceNote": "Starting · Haldi film",
    "deliverables": [
      "Haldi highlight",
      "Reel set"
    ],
    "equipment": [
      "Gimbal + weather kit"
    ]
  },
  {
    "slug": "mehendi-videography",
    "title": "Mehendi Videography",
    "short": "Mehendi detail films and evening ambience.",
    "description": "Cinematic mehendi coverage — macro henna details, décor reveals and guest storytelling for Indian wedding weeks.",
    "benefits": [
      "Detail macros on film",
      "Ambience + music",
      "Social teasers"
    ],
    "image": "/images/indian/mehndi-01.jpg",
    "category": "Wedding",
    "related": [
      "mehendi-photography",
      "sangeet-videography",
      "wedding-videography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹25,000",
    "priceNote": "Starting · Mehendi film",
    "deliverables": [
      "Mehendi highlight",
      "Detail reel"
    ],
    "equipment": [
      "Macro + gimbal"
    ]
  },
  {
    "slug": "sangeet-videography",
    "title": "Sangeet Videography",
    "short": "Multi-cam sangeet films for Indian dance nights.",
    "description": "Performance-led sangeet videography with multi-camera coverage, audio and cinematic edits for Indian wedding celebrations.",
    "benefits": [
      "Multi-cam performances",
      "Clean audio",
      "Highlight + reels"
    ],
    "image": "/images/indian/wedding-06.jpg",
    "category": "Wedding",
    "related": [
      "sangeet-photography",
      "wedding-films",
      "reception-videography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹55,000",
    "priceNote": "Starting · Sangeet film night",
    "deliverables": [
      "Sangeet highlight film",
      "Performance cuts"
    ],
    "equipment": [
      "Multi-cam + wireless audio"
    ]
  },
  {
    "slug": "reception-videography",
    "title": "Reception Videography",
    "short": "Reception entrance films, speeches and last dance.",
    "description": "Indian wedding reception videography — grand entrances, speeches, cake and dance-floor cinema with banquet expertise.",
    "benefits": [
      "Entrance cinema",
      "Speech audio",
      "Dance-floor coverage"
    ],
    "image": "/images/indian/reception-alt.jpg",
    "category": "Wedding",
    "related": [
      "reception-photography",
      "wedding-videography",
      "event-videography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹55,000",
    "priceNote": "Starting · reception film",
    "deliverables": [
      "Reception highlight",
      "Speech edit option"
    ],
    "equipment": [
      "Banquet cinema kit"
    ]
  },
  {
    "slug": "wedding-drone-coverage",
    "title": "Wedding Drone Coverage",
    "short": "Aerial stills & film plates for Indian destination weddings.",
    "description": "DGCA-compliant drone coverage for Indian palace, beach and estate weddings — establishing aerials for photography and films.",
    "benefits": [
      "Aerial stills + 4K clips",
      "Venue-permitted only",
      "Licensed pilots"
    ],
    "image": "/images/indian/wedding-04.jpg",
    "category": "Wedding",
    "related": [
      "destination-wedding-videography",
      "wedding-films",
      "destination-wedding-photography"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "reviews": [
      {
        "name": "Aanya & Rohan",
        "role": "Wedding · Udaipur",
        "quote": "Photo and film felt like one cinema language. Highlight still gives us chills.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Meera Shah",
        "role": "Bride · Mumbai",
        "quote": "Candid stills + cinematic film — zero stiff posing, pure emotion.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Kabir Malhotra",
        "role": "Groom · Delhi",
        "quote": "Multi-day photo and video never felt intrusive. Elders loved traditional groups.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Sneha & Arjun",
        "role": "Couple · Goa",
        "quote": "Beach reception film looked like a movie. Same-week reels helped every guest post.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Priya Nair",
        "role": "Bride · Bangalore",
        "quote": "From mehendi to pheras, photo and film missed nothing.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ishita & Dev",
        "role": "Pre-wedding · Lonavala",
        "quote": "Pre-wedding film and stills became our entire invite suite.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Ananya Reddy",
        "role": "Maternity · Mumbai",
        "quote": "Bump portraits and a short film felt elegant, never clinical.",
        "rating": 5,
        "image": ""
      },
      {
        "name": "Rohit Desai",
        "role": "Birthday · Mumbai",
        "quote": "First birthday photo + reel looked as polished as our wedding gallery.",
        "rating": 5,
        "image": ""
      }
    ],
    "tips": [
      {
        "title": "Photo + film from one crew",
        "text": "Bundling photography and videography keeps colour language consistent and is usually more cost-effective than hiring separate vendors."
      },
      {
        "title": "Candid vs traditional",
        "text": "Candid captures raw emotion; traditional secures family groups elders expect. Premium albums blend both."
      },
      {
        "title": "Book 6–12 months ahead",
        "text": "Peak Mumbai wedding Saturdays and muhurat dates fill early — hold your photo and film crew with a token."
      },
      {
        "title": "Same-day social selects",
        "text": "Ask for Instagram-ready stills and a vertical reel within 24–48 hours of the function."
      },
      {
        "title": "Brief your must-haves",
        "text": "Share ritual timings, VIP family names and film length preferences before wedding week."
      },
      {
        "title": "Golden hour portraits",
        "text": "Protect 20–30 quiet minutes at sunset for cinematic couple frames."
      },
      {
        "title": "Deliverables in writing",
        "text": "Confirm edited photo count, highlight length, feature film, album credit and timeline in the contract."
      },
      {
        "title": "Drone needs permission",
        "text": "Palace and banquet aerials need venue clearance and DGCA-compliant pilots."
      },
      {
        "title": "Two shooters minimum",
        "text": "Parallel rituals need second photographers so baraat and bride prep are never orphaned."
      },
      {
        "title": "Pre-wedding chemistry",
        "text": "A guided pre-wedding day helps couples relax on camera before the wedding week."
      }
    ],
    "priceFrom": "₹15,000",
    "priceNote": "Add-on · per event day",
    "deliverables": [
      "Aerial still selects",
      "4K plates for film"
    ],
    "equipment": [
      "DGCA drone",
      "ND filters"
    ]
  }
];
export const homeServices: string[] = [
  "wedding-photography",
  "wedding-videography",
  "wedding-films",
  "candid-wedding-photography",
  "pre-wedding-shoot",
  "pre-wedding-videography",
  "engagement-photography",
  "maternity-photography",
  "birthday-photography",
  "event-videography"
];
export const fallbackServices = services;
export const fallbackHomeServices = homeServices;
