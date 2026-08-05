export type FAQ = {
  question: string;
  answer: string;
  category: string;
};

export const faqs: FAQ[] = [
  {
    category: "Booking",
    question: "How do I book DisplayAvenue Studios?",
    answer:
      "Share your date, city and service needs through Book Now or WhatsApp. We confirm availability, recommend a package, collect a booking amount and reserve your date on the production calendar.",
  },
  {
    category: "Booking",
    question: "Do you travel outside Mumbai?",
    answer:
      "Yes. We cover pan-India destination weddings, corporate shoots and commercial productions. Travel and stay for the crew are quoted transparently based on location and team size.",
  },
  {
    category: "Pricing",
    question: "What affects the final price?",
    answer:
      "Pricing depends on shoot duration, crew size, city, travel, deliverables (photos, films, albums), rush editing and add-ons such as drone, live streaming or extra coverage days.",
  },
  {
    category: "Pricing",
    question: "Is the booking amount refundable?",
    answer:
      "Booking amounts secure your date and creative team. Refund terms depend on notice period and are shared in your booking agreement before payment.",
  },
  {
    category: "Delivery",
    question: "How long does delivery take?",
    answer:
      "Social selects can be shared within 24–72 hours. Full wedding galleries typically deliver in 4–8 weeks. Films and commercial projects follow the timeline confirmed in your proposal.",
  },
  {
    category: "Delivery",
    question: "Do you provide raw files?",
    answer:
      "We deliver professionally edited, colour-graded images and films. Raw files are not included by default, as our finish is part of the DisplayAvenue standard.",
  },
  {
    category: "Wedding",
    question: "Can you cover multi-day destination weddings?",
    answer:
      "Absolutely. Our Luxury wedding packages are designed for multi-function and destination celebrations with dedicated photo and film crews.",
  },
  {
    category: "Wedding",
    question: "Do you help with pre-wedding concepts?",
    answer:
      "Yes. We prepare moodboards, suggest locations around Mumbai or your destination city, and guide wardrobe choices for a cohesive story.",
  },
  {
    category: "Corporate",
    question: "Can you shoot inside factories and hospitals?",
    answer:
      "Yes. We plan industrial and healthcare shoots with safety, permissions and operational constraints in mind, coordinating closely with your on-ground teams.",
  },
  {
    category: "Product",
    question: "Do you offer Amazon and Flipkart compliant images?",
    answer:
      "Yes. Our marketplace packages include white-background mains, secondary angles, detail frames and lifestyle options aligned to platform guidelines.",
  },
  {
    category: "Technical",
    question: "What equipment do you use?",
    answer:
      "We shoot on professional full-frame mirrorless and cinema camera systems with cinema lenses, studio lighting, wireless audio and licensed drones where permitted.",
  },
  {
    category: "Technical",
    question: "Do you offer live streaming for weddings?",
    answer:
      "Yes. Multi-camera live streaming is available for destination guests and hybrid events, with branded overlays and a recorded archive.",
  },
];

export const whyChoose = [
  {
    title: "Premium Equipment",
    text: "Cinema cameras, full-frame stills systems, professional lighting and licensed aerial kits on every production.",
  },
  {
    title: "Experienced Team",
    text: "Directors, photographers and editors who understand Indian ceremonies, brand guidelines and commercial deadlines.",
  },
  {
    title: "Creative Storytelling",
    text: "We design narratives — not just coverage — so your film and gallery feel intentional, emotional and premium.",
  },
  {
    title: "Fast Delivery",
    text: "Same-day selects, structured editing pipelines and clear timelines keep families and marketing teams moving.",
  },
  {
    title: "Pan India Coverage",
    text: "From Mira Road headquarters to destination cities across India, one studio standard travels with you.",
  },
  {
    title: "Trusted Process",
    text: "Transparent proposals, written scopes, booking agreements and dedicated coordination from inquiry to delivery.",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Inquiry",
    text: "Tell us your date, city and vision through the website, WhatsApp or phone.",
  },
  {
    step: "02",
    title: "Consultation",
    text: "We discuss style, deliverables, budget and recommend the right package.",
  },
  {
    step: "03",
    title: "Booking",
    text: "Reserve your date with a booking amount and confirmed production plan.",
  },
  {
    step: "04",
    title: "Shoot",
    text: "Our on-ground team arrives prepared — briefed, equipped and directed.",
  },
  {
    step: "05",
    title: "Editing",
    text: "Colour, sound and storytelling are finished in-house to studio standard.",
  },
  {
    step: "06",
    title: "Delivery",
    text: "Receive galleries, films and files through a secure client delivery link.",
  },
];

export const testimonials = [
  {
    name: "Aanya & Rohan Mehta",
    role: "Destination Wedding · Udaipur",
    quote:
      "DisplayAvenue felt like a luxury film crew, not just photographers. Every ritual was covered with calm precision and the highlight film still gives us chills.",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Neha Kapoor",
    role: "Marketing Head · Consumer Brand",
    quote:
      "Our product launch assets were delivered on time, on brand and conversion-ready for Amazon and Instagram. The team understands both aesthetics and business.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Vikram Shah",
    role: "Hotel General Manager · Goa",
    quote:
      "From drone approaches to suite interiors, the hospitality imagery elevated our OTA listings immediately. Guests now mention the photos when they book.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },
];

export const blogs = [
  {
    slug: "how-to-choose-wedding-photographer-mumbai",
    title: "How to Choose a Wedding Photographer in Mumbai",
    excerpt:
      "A practical guide to evaluating portfolios, packages, contracts and chemistry before you book your wedding visual team.",
    category: "Weddings",
    date: "15 Mar 2026",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
    readTime: "7 min read",
  },
  {
    slug: "product-photography-tips-ecommerce-india",
    title: "Product Photography Tips for Ecommerce Brands in India",
    excerpt:
      "Marketplace rules, lighting basics and lifestyle framing ideas that help listings convert on Amazon, Flipkart and D2C sites.",
    category: "Product",
    date: "02 Mar 2026",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    readTime: "6 min read",
  },
  {
    slug: "destination-wedding-film-checklist",
    title: "Destination Wedding Film Checklist for Couples",
    excerpt:
      "From permits to playlist references — everything couples should align with their cinematographer before a destination wedding.",
    category: "Films",
    date: "18 Feb 2026",
    image:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1000&q=80",
    readTime: "8 min read",
  },
  {
    slug: "corporate-brand-film-brief",
    title: "How to Brief a Corporate Brand Film Production",
    excerpt:
      "A conversion-focused brief template covering audience, message, usage channels and success metrics for brand films.",
    category: "Corporate",
    date: "05 Feb 2026",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80",
    readTime: "5 min read",
  },
  {
    slug: "drone-rules-wedding-india",
    title: "Drone Rules Couples Should Know for Indian Weddings",
    excerpt:
      "An accessible overview of permissions, safety and creative possibilities when adding aerial cinema to your wedding film.",
    category: "Aerial",
    date: "22 Jan 2026",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80",
    readTime: "6 min read",
  },
  {
    slug: "real-estate-photography-sells-faster",
    title: "Why Professional Real Estate Photography Sells Faster",
    excerpt:
      "Listing data-backed reasons bright, accurate property imagery improves inquiries for brokers and developers.",
    category: "Real Estate",
    date: "10 Jan 2026",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
    readTime: "5 min read",
  },
];

export const industries = [
  {
    slug: "manufacturing",
    title: "Manufacturing",
    text: "Plant tours, process films and capability photography for industrial brands winning B2B buyers.",
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    text: "Hospital, clinic and medical brand imagery created with sensitivity, permissions and patient-care protocols.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "hotels",
    title: "Hotels",
    text: "OTA-ready hospitality photography, lifestyle films and drone approaches for resorts and city hotels.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "restaurants",
    title: "Restaurants",
    text: "Food, ambience and launch coverage for restaurants, cafés and cloud kitchens across India.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "education",
    title: "Education",
    text: "School and college event coverage, campus films and admission campaign visuals.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "construction",
    title: "Construction",
    text: "Progress documentation, site aerials and project marketing visuals for developers and contractors.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "automobile",
    title: "Automobile",
    text: "Vehicle hero films, dealership events and launch content for automotive brands and showrooms.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "fashion",
    title: "Fashion",
    text: "Lookbooks, campaign stills and reel content for apparel, jewellery and lifestyle labels.",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "government",
    title: "Government",
    text: "Event documentation, conference films and institutional photography with formal delivery standards.",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "ngos",
    title: "NGOs",
    text: "Impact storytelling, field documentation and fundraising films for non-profits and social enterprises.",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "real-estate",
    title: "Real Estate",
    text: "Listing photography, walkthroughs and aerials that help properties attract serious inquiries faster.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
  },
];

export const locations = [
  {
    slug: "wedding-photographer-mumbai",
    title: "Wedding Photographer in Mumbai",
    city: "Mumbai",
    service: "Wedding Photography",
    intro:
      "Luxury wedding photography across Mumbai — from intimate ceremonies in heritage venues to grand receptions in luxury hotels.",
  },
  {
    slug: "wedding-photographer-delhi",
    title: "Wedding Photographer in Delhi",
    city: "Delhi",
    service: "Wedding Photography",
    intro:
      "Destination-ready wedding photography for Delhi NCR celebrations, farmhouses and luxury hotel weddings.",
  },
  {
    slug: "wedding-photographer-bangalore",
    title: "Wedding Photographer in Bangalore",
    city: "Bangalore",
    service: "Wedding Photography",
    intro:
      "Elegant wedding photography for Bangalore couples seeking editorial stills and warm documentary coverage.",
  },
  {
    slug: "wedding-photographer-pune",
    title: "Wedding Photographer in Pune",
    city: "Pune",
    service: "Wedding Photography",
    intro:
      "Wedding photography in Pune for city venues, hill-station getaways and multi-day family celebrations.",
  },
  {
    slug: "corporate-photographer-hyderabad",
    title: "Corporate Photographer in Hyderabad",
    city: "Hyderabad",
    service: "Corporate Photography",
    intro:
      "Corporate photography and brand films for Hyderabad’s technology, pharma and enterprise companies.",
  },
  {
    slug: "product-photographer-ahmedabad",
    title: "Product Photographer in Ahmedabad",
    city: "Ahmedabad",
    service: "Product Photography",
    intro:
      "Product and catalogue photography for Ahmedabad manufacturers, jewellery houses and ecommerce brands.",
  },
  {
    slug: "wedding-videographer-goa",
    title: "Wedding Videographer in Goa",
    city: "Goa",
    service: "Wedding Videography",
    intro:
      "Cinematic beach and resort wedding films for destination celebrations across North and South Goa.",
  },
  {
    slug: "drone-photographer-jaipur",
    title: "Drone Photographer in Jaipur",
    city: "Jaipur",
    service: "Drone Photography",
    intro:
      "Licensed aerial photography for Jaipur palace weddings, heritage hotels and real estate projects.",
  },
];

export const team = [
  {
    name: "Arjun Desai",
    role: "Creative Director",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Meera Iyer",
    role: "Lead Photographer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Kabir Khan",
    role: "Cinematographer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sara Pinto",
    role: "Post Production Lead",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
  },
];
