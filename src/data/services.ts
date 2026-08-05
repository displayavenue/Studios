export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  benefits: string[];
  image: string;
  category: "Wedding" | "Corporate" | "Product" | "Events" | "Aerial" | "Post";
  related: string[];
  /** Optional YouTube watch / share / embed URL — shown on the service page when set */
  youtubeUrl?: string;
};

export const services: Service[] = [
  {
    slug: "wedding-photography",
    title: "Wedding Photography",
    short: "Timeless frames from every ritual, emotion and quiet moment.",
    description:
      "From intimate mehendi gatherings to grand receptions, our wedding photography captures the soul of your celebration with editorial elegance and documentary honesty.",
    benefits: [
      "Full coverage of pre-wedding, ceremony and reception",
      "Two lead photographers with luxury lighting setups",
      "Same-day preview gallery for social sharing",
      "Heirloom-ready album design options",
    ],
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    category: "Wedding",
    related: ["wedding-videography", "pre-wedding-shoot", "destination-weddings"],
  },
  {
    slug: "wedding-videography",
    title: "Wedding Videography",
    short: "Cinematic wedding films crafted like feature storytelling.",
    description:
      "We produce cinematic wedding films that blend emotion, culture and craft — from highlight reels to full ceremony documentation worthy of the big screen.",
    benefits: [
      "4K cinematic production with dual camera coverage",
      "Drone sequences for venue and baraat moments",
      "Color-graded highlight film and ceremony edit",
      "Music licensing and optional teaser for socials",
    ],
    image:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80",
    category: "Wedding",
    related: ["wedding-photography", "drone-videography", "wedding-film-editing"],
  },
  {
    slug: "pre-wedding-shoot",
    title: "Pre Wedding Shoot",
    short: "Styled love stories shot at iconic and intimate locations.",
    description:
      "Romantic, fashion-forward pre-wedding sessions designed around your chemistry — city skylines, heritage venues or destination escapes.",
    benefits: [
      "Concept moodboard and location scouting",
      "Wardrobe and styling guidance",
      "Golden-hour and blue-hour coverage",
      "Reel-ready vertical cuts included",
    ],
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
    category: "Wedding",
    related: ["engagement-photography", "destination-weddings", "wedding-photography"],
  },
  {
    slug: "engagement-photography",
    title: "Engagement Photography",
    short: "Elegant coverage of rings, rituals and first celebrations.",
    description:
      "Celebrate your engagement with refined photography that honours tradition and personality — perfect for announcements and wedding invitations.",
    benefits: [
      "Ceremony and family portrait coverage",
      "Natural light and controlled flash setups",
      "48-hour teaser delivery",
      "Print-ready high-resolution files",
    ],
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
    category: "Wedding",
    related: ["haldi-photography", "mehendi-photography", "wedding-photography"],
  },
  {
    slug: "haldi-photography",
    title: "Haldi Photography",
    short: "Vibrant, joyful documentation of colour and celebration.",
    description:
      "Haldi is pure energy. We capture the laughter, turmeric and tradition with warm tones and candid storytelling.",
    benefits: [
      "Colour-accurate editing for vibrant rituals",
      "Candid and posed family moments",
      "Detail shots of décor and rituals",
      "Same-day social selects available",
    ],
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80",
    category: "Wedding",
    related: ["mehendi-photography", "sangeet-photography", "wedding-photography"],
  },
  {
    slug: "mehendi-photography",
    title: "Mehendi Photography",
    short: "Artful frames of henna, music and intimate gatherings.",
    description:
      "From intricate henna patterns to lively guest moments, our mehendi photography preserves every detail of this intimate celebration.",
    benefits: [
      "Macro detail photography of mehendi art",
      "Guest candid storytelling",
      "Soft natural lighting techniques",
      "Coordinated couple portraits",
    ],
    image:
      "https://images.unsplash.com/photo-1708963738411-74ab1cd5eafb?auto=format&fit=crop&w=1200&q=80",
    category: "Wedding",
    related: ["haldi-photography", "sangeet-photography", "wedding-photography"],
  },
  {
    slug: "sangeet-photography",
    title: "Sangeet Photography",
    short: "High-energy coverage of performances, lights and dance.",
    description:
      "Sangeet nights demand rhythm. We photograph performances, stage design and guest energy with concert-grade lighting technique.",
    benefits: [
      "Low-light performance photography",
      "Stage and décor documentation",
      "Family dance and group moments",
      "Fast turnaround for overnight sharing",
    ],
    image:
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
    category: "Wedding",
    related: ["reception-photography", "event-photography", "wedding-videography"],
  },
  {
    slug: "reception-photography",
    title: "Reception Photography",
    short: "Grand entrances, portraits and celebration coverage.",
    description:
      "Reception photography that balances glamorous couple portraits with lively guest interactions and elegant venue storytelling.",
    benefits: [
      "Red-carpet style couple portraits",
      "Guest table and interaction coverage",
      "Cake cutting and key rituals",
      "Luxury album-ready image set",
    ],
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    category: "Wedding",
    related: ["wedding-photography", "wedding-videography", "album-design"],
  },
  {
    slug: "destination-weddings",
    title: "Destination Weddings",
    short: "Pan-India and international destination wedding teams.",
    description:
      "Whether Goa, Udaipur, Jaipur or overseas, our destination wedding crews travel with full production kits and local coordination support.",
    benefits: [
      "Travel-ready multi-day production teams",
      "Venue and light scouting before the event",
      "Drone and cinematic film packages",
      "Coordinated stills and motion delivery",
    ],
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
    category: "Wedding",
    related: ["wedding-photography", "wedding-videography", "drone-photography"],
  },
  {
    slug: "corporate-photography",
    title: "Corporate Photography",
    short: "Executive portraits, office culture and brand imagery.",
    description:
      "Professional corporate photography for leadership portraits, workplace storytelling, annual reports and employer branding.",
    benefits: [
      "On-location studio lighting setups",
      "Leadership and team portrait sessions",
      "Brand-consistent colour grading",
      "Usage-ready web and print assets",
    ],
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate",
    related: ["corporate-videography", "event-photography", "interview-videos"],
  },
  {
    slug: "corporate-videography",
    title: "Corporate Videography",
    short: "Brand films, company profiles and leadership messages.",
    description:
      "From founder stories to internal communications, we create polished corporate films that elevate brand trust and clarity.",
    benefits: [
      "Scripted and documentary approaches",
      "Multi-camera interview setups",
      "Motion graphics and lower-thirds",
      "Delivery for web, LinkedIn and events",
    ],
    image:
      "https://images.unsplash.com/photo-1573164713714-d95e4367658e?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate",
    related: ["brand-story-videos", "commercial-ad-films", "interview-videos"],
  },
  {
    slug: "industrial-photography",
    title: "Industrial Photography",
    short: "Factories, plants and operations captured with precision.",
    description:
      "Safety-aware industrial photography that showcases scale, process and craftsmanship for manufacturers and B2B brands.",
    benefits: [
      "Plant and process documentation",
      "Safety-compliant shoot planning",
      "Detail and wide establishing frames",
      "Assets for websites and catalogues",
    ],
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate",
    related: ["factory-photography", "manufacturing-videos", "corporate-photography"],
  },
  {
    slug: "factory-photography",
    title: "Factory Photography",
    short: "Facility tours and production-line visual documentation.",
    description:
      "Highlight your manufacturing excellence with clean, professional imagery of facilities, machinery and workforce.",
    benefits: [
      "Full facility walkthrough coverage",
      "Worker and process storytelling",
      "HDR techniques for mixed lighting",
      "Optional aerial context shots",
    ],
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112c4e5190?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate",
    related: ["industrial-photography", "manufacturing-videos", "drone-photography"],
  },
  {
    slug: "manufacturing-videos",
    title: "Manufacturing Videos",
    short: "Process films that explain quality, scale and capability.",
    description:
      "Manufacturing videos that help buyers understand your process, certifications and capacity — ideal for B2B sales and websites.",
    benefits: [
      "Process storytelling scripts",
      "Safety-first filming protocols",
      "Voiceover and motion graphics options",
      "Multi-language delivery available",
    ],
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate",
    related: ["industrial-photography", "corporate-videography", "brand-story-videos"],
  },
  {
    slug: "product-photography",
    title: "Product Photography",
    short: "Catalogue, lifestyle and packshot imagery that sells.",
    description:
      "Premium product photography for e-commerce, lookbooks and campaigns — crisp packshots and lifestyle scenes that convert.",
    benefits: [
      "Studio packshots on white and custom sets",
      "Lifestyle and flat-lay compositions",
      "Colour-accurate retouching",
      "Marketplace-ready file exports",
    ],
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    category: "Product",
    related: ["amazon-product-photography", "product-videography", "fashion-photography"],
  },
  {
    slug: "product-videography",
    title: "Product Videography",
    short: "Dynamic product films for ads, reels and launches.",
    description:
      "Motion that makes products irresistible — from 360 spins to cinematic launch films for digital and retail campaigns.",
    benefits: [
      "360° and hero product videos",
      "Social-first vertical formats",
      "Lighting designed for material detail",
      "Music and text overlay packages",
    ],
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    category: "Product",
    related: ["product-photography", "social-media-reels", "commercial-ad-films"],
  },
  {
    slug: "amazon-product-photography",
    title: "Amazon Product Photography",
    short: "Marketplace-compliant images engineered for conversions.",
    description:
      "Amazon-ready photography including main image, lifestyle, infographics and A+ content visuals that meet platform guidelines.",
    benefits: [
      "White-background main image compliance",
      "Infographic and feature frames",
      "Lifestyle and scale reference shots",
      "Batch pricing for SKU catalogues",
    ],
    image:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1200&q=80",
    category: "Product",
    related: ["flipkart-product-photography", "product-photography", "photo-editing"],
  },
  {
    slug: "flipkart-product-photography",
    title: "Flipkart Product Photography",
    short: "Platform-optimised visuals for Flipkart listings.",
    description:
      "Flipkart listing photography with correct framing, background standards and detail shots that improve click-through and trust.",
    benefits: [
      "Guideline-compliant framing",
      "Multi-angle product sets",
      "Detail and packaging shots",
      "Bulk catalogue workflows",
    ],
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    category: "Product",
    related: ["amazon-product-photography", "product-photography", "product-videography"],
  },
  {
    slug: "food-photography",
    title: "Food Photography",
    short: "Appetite-led imagery for menus, delivery apps and brands.",
    description:
      "Styled food photography that makes dishes irresistible — for restaurants, cloud kitchens, hotels and CPG brands.",
    benefits: [
      "On-location and studio food styling",
      "Menu and delivery-app crops",
      "Steam, texture and garnish emphasis",
      "Fast batch shooting for large menus",
    ],
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
    category: "Product",
    related: ["restaurant-photography", "hotel-photography", "product-photography"],
  },
  {
    slug: "restaurant-photography",
    title: "Restaurant Photography",
    short: "Ambience, plating and brand imagery for F&B venues.",
    description:
      "Complete restaurant visual packages covering interiors, signature dishes, bartending and guest experience moments.",
    benefits: [
      "Interior and ambience coverage",
      "Signature dish hero shots",
      "Team and service storytelling",
      "Assets for Google, Zomato and Instagram",
    ],
    image:
      "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=1200&q=80",
    category: "Product",
    related: ["food-photography", "hotel-photography", "social-media-reels"],
  },
  {
    slug: "hotel-photography",
    title: "Hotel Photography",
    short: "Rooms, amenities and lifestyle imagery for hospitality.",
    description:
      "Hospitality photography built for OTAs and brand sites — rooms, suites, dining, spa and experiential lifestyle frames.",
    benefits: [
      "Room and suite architectural framing",
      "Amenity and F&B coverage",
      "Lifestyle guest moments",
      "OTA-optimised crops and exports",
    ],
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
    category: "Product",
    related: ["architecture-photography", "interior-photography", "drone-photography"],
  },
  {
    slug: "fashion-photography",
    title: "Fashion Photography",
    short: "Editorial and campaign imagery for apparel and jewellery.",
    description:
      "Fashion photography with strong direction — lookbooks, e-commerce sets, jewellery campaigns and seasonal collections.",
    benefits: [
      "Studio and on-location fashion sets",
      "Model direction and posing support",
      "Retouching for skin and fabric detail",
      "Campaign and e-commerce variants",
    ],
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    category: "Product",
    related: ["model-portfolio", "product-photography", "commercial-ad-films"],
  },
  {
    slug: "model-portfolio",
    title: "Model Portfolio",
    short: "Casting-ready portfolios for aspiring and working models.",
    description:
      "Professional model portfolios with diverse looks, clean lighting and agency-ready framing for casting submissions.",
    benefits: [
      "Multiple looks and outfit changes",
      "Headshots, full-length and editorial frames",
      "Makeup and styling coordination options",
      "Print and digital portfolio delivery",
    ],
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80",
    category: "Product",
    related: ["fashion-photography", "photo-editing", "social-media-reels"],
  },
  {
    slug: "architecture-photography",
    title: "Architecture Photography",
    short: "Form, light and structure for architects and developers.",
    description:
      "Architectural photography that respects design intent — exteriors, façades and contextual storytelling for portfolios and marketing.",
    benefits: [
      "Perspective-corrected architectural frames",
      "Golden-hour and twilight sessions",
      "Detail and material studies",
      "Drone context when permitted",
    ],
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate",
    related: ["interior-photography", "real-estate-photography", "drone-photography"],
  },
  {
    slug: "interior-photography",
    title: "Interior Photography",
    short: "Spaces photographed to feel lived-in and aspirational.",
    description:
      "Interior photography for designers, hotels and real estate — balanced lighting, styling guidance and lifestyle framing.",
    benefits: [
      "Natural and supplemental light blending",
      "Styling support for vignettes",
      "Wide and detail compositions",
      "Vertical crops for social and listings",
    ],
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate",
    related: ["architecture-photography", "real-estate-photography", "hotel-photography"],
  },
  {
    slug: "real-estate-photography",
    title: "Real Estate Photography",
    short: "Listing imagery that helps properties sell faster.",
    description:
      "Real estate photography and walkthrough support for brokers, developers and luxury homes — clear, bright and inviting.",
    benefits: [
      "HDR interiors and exteriors",
      "Twilight exterior packages",
      "Floor-plan friendly framing",
      "Optional drone and video tours",
    ],
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate",
    related: ["drone-photography", "interior-photography", "architecture-photography"],
  },
  {
    slug: "drone-photography",
    title: "Drone Photography",
    short: "Licensed aerial stills for property, events and brands.",
    description:
      "Certified drone photography for weddings, real estate, industrial sites and destination storytelling across India.",
    benefits: [
      "DGCA-aware flight planning",
      "High-resolution aerial stills",
      "Site mapping perspectives",
      "Weather contingency planning",
    ],
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
    category: "Aerial",
    related: ["drone-videography", "real-estate-photography", "destination-weddings"],
  },
  {
    slug: "drone-videography",
    title: "Drone Videography",
    short: "Sweeping aerial cinema for films and commercial work.",
    description:
      "Aerial cinematography that adds scale and emotion to wedding films, brand films and property showcases.",
    benefits: [
      "Cinematic flight paths and orbits",
      "4K aerial footage",
      "Integration with ground camera units",
      "Colour-matched delivery with main edit",
    ],
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    category: "Aerial",
    related: ["drone-photography", "wedding-videography", "commercial-ad-films"],
  },
  {
    slug: "event-photography",
    title: "Event Photography",
    short: "Conferences, launches and celebrations covered with polish.",
    description:
      "Professional event photography for brand launches, award nights, conferences and private celebrations.",
    benefits: [
      "Keynote and stage coverage",
      "Guest and networking candids",
      "Same-day selects for PR",
      "Multi-photographer large-scale coverage",
    ],
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    category: "Events",
    related: ["event-videography", "award-shows", "conferences"],
  },
  {
    slug: "event-videography",
    title: "Event Videography",
    short: "Highlight films and full documentation for live events.",
    description:
      "Event films that capture speeches, atmosphere and brand moments — ideal for recaps, sponsors and internal sharing.",
    benefits: [
      "Multi-camera event coverage",
      "Highlight reel and full edit options",
      "Speaker and audience cutaways",
      "Fast post-event turnaround",
    ],
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    category: "Events",
    related: ["event-photography", "live-streaming", "conferences"],
  },
  {
    slug: "school-photography",
    title: "School Photography",
    short: "Annual days, portraits and campus moments for schools.",
    description:
      "School photography packages covering annual days, sports meets, classroom storytelling and student portraits.",
    benefits: [
      "Large student volume workflows",
      "Stage and cultural programme coverage",
      "Individual and class portraits",
      "Parent-ready gallery delivery",
    ],
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927db?auto=format&fit=crop&w=1200&q=80",
    category: "Events",
    related: ["college-events", "event-photography", "photo-editing"],
  },
  {
    slug: "college-events",
    title: "College Events",
    short: "Fests, convocations and campus culture documented.",
    description:
      "Dynamic coverage of college fests, convocations and cultural nights with energy-matched stills and highlight films.",
    benefits: [
      "Multi-stage fest coverage",
      "Performance and crowd moments",
      "Sponsored activation documentation",
      "Social-ready same-day content",
    ],
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    category: "Events",
    related: ["school-photography", "event-videography", "live-streaming"],
  },
  {
    slug: "award-shows",
    title: "Award Shows",
    short: "Red carpet, stage and winner moments with prestige.",
    description:
      "Award-show photography and films that honour ceremony, sponsors and winners with red-carpet polish.",
    benefits: [
      "Red carpet and step-and-repeat coverage",
      "Winner and trophy moments",
      "Sponsor and VIP documentation",
      "Press-ready same-night selects",
    ],
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    category: "Events",
    related: ["event-photography", "event-videography", "live-streaming"],
  },
  {
    slug: "conferences",
    title: "Conferences",
    short: "Speaker, audience and brand coverage for summits.",
    description:
      "Conference visual production covering keynotes, panels, exhibition floors and networking — built for organisers and sponsors.",
    benefits: [
      "Multi-hall coverage planning",
      "Speaker portrait and stage sets",
      "Exhibition booth documentation",
      "Recap film and photo packages",
    ],
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    category: "Events",
    related: ["corporate-videography", "live-streaming", "event-photography"],
  },
  {
    slug: "live-streaming",
    title: "Live Streaming",
    short: "Multi-camera live streams for weddings and events.",
    description:
      "Reliable live streaming with professional switching, graphics and backup — for destination guests, conferences and hybrid events.",
    benefits: [
      "Multi-camera live switching",
      "Branded overlays and lower-thirds",
      "YouTube, Zoom and private links",
      "Recording archive included",
    ],
    image:
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80",
    category: "Events",
    related: ["event-videography", "wedding-videography", "conferences"],
  },
  {
    slug: "podcast-production",
    title: "Podcast Production",
    short: "Multi-cam podcast filming with polished audio.",
    description:
      "End-to-end podcast production — set design guidance, multi-camera filming, audio capture and edit-ready deliverables.",
    benefits: [
      "Multi-camera podcast setups",
      "Clean audio capture and mixing",
      "Intro/outro graphics packages",
      "YouTube and audio-only exports",
    ],
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
    category: "Post",
    related: ["interview-videos", "youtube-videos", "video-editing"],
  },
  {
    slug: "interview-videos",
    title: "Interview Videos",
    short: "Leadership and customer interview films that build trust.",
    description:
      "Interview productions with cinematic lighting, clean audio and editorial pacing for brands, founders and testimonials.",
    benefits: [
      "Three-point lighting setups",
      "Lav and boom audio options",
      "B-roll planning and capture",
      "Short and long-form edits",
    ],
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate",
    related: ["corporate-videography", "brand-story-videos", "podcast-production"],
  },
  {
    slug: "social-media-reels",
    title: "Social Media Reels",
    short: "Scroll-stopping vertical content for Instagram and Shorts.",
    description:
      "Reel production designed for reach — hooks, pacing and platform-native framing for weddings, brands and creators.",
    benefits: [
      "Hook-first scripting approach",
      "Vertical-native filming",
      "Trending audio-friendly edits",
      "Batch content day packages",
    ],
    image:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1200&q=80",
    category: "Post",
    related: ["instagram-content-creation", "youtube-videos", "video-editing"],
  },
  {
    slug: "instagram-content-creation",
    title: "Instagram Content Creation",
    short: "Monthly visual content systems for brand accounts.",
    description:
      "Ongoing Instagram content creation covering shoots, edits and posting-ready assets aligned to your brand calendar.",
    benefits: [
      "Monthly shoot calendars",
      "Feed, story and reel formats",
      "Brand-consistent colour and typography",
      "Caption and hashtag support options",
    ],
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    category: "Post",
    related: ["social-media-reels", "product-photography", "monthly-content"],
  },
  {
    slug: "youtube-videos",
    title: "YouTube Videos",
    short: "Channel-ready long-form videos with strong retention.",
    description:
      "YouTube production from concept to thumbnail — tutorials, vlogs, brand episodes and educational series.",
    benefits: [
      "Episode planning and shot lists",
      "Thumbnail photography options",
      "Retention-focused editing",
      "End screens and chapter markers",
    ],
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1200&q=80",
    category: "Post",
    related: ["video-editing", "podcast-production", "interview-videos"],
  },
  {
    slug: "video-editing",
    title: "Video Editing",
    short: "Precision editing for films, ads and social content.",
    description:
      "Professional video editing for wedding films, commercial spots, reels and corporate content — paced for emotion and clarity.",
    benefits: [
      "Narrative and commercial editing styles",
      "Sound design and music sync",
      "Graphics and caption packages",
      "Platform-specific export masters",
    ],
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    category: "Post",
    related: ["color-grading", "motion-graphics", "wedding-film-editing"],
  },
  {
    slug: "photo-editing",
    title: "Photo Editing",
    short: "Colour, retouching and batch finishing at studio standard.",
    description:
      "Photo editing and retouching services for weddings, products and campaigns — consistent colour and premium finish.",
    benefits: [
      "Culling and colour consistency",
      "Skin and product retouching",
      "Batch pipeline for large volumes",
      "Print and web export variants",
    ],
    image:
      "https://images.unsplash.com/photo-1609921217029-ce5dfdfc8d0e?auto=format&fit=crop&w=1200&q=80",
    category: "Post",
    related: ["album-design", "product-photography", "wedding-photography"],
  },
  {
    slug: "wedding-film-editing",
    title: "Wedding Film Editing",
    short: "Emotion-led wedding film edits and teaser cuts.",
    description:
      "Dedicated wedding film editors who craft trailers, highlight films and full ceremony edits with cinematic colour.",
    benefits: [
      "Teaser, highlight and full film packages",
      "Licensed music recommendations",
      "Family-friendly and cinematic versions",
      "Revision rounds included",
    ],
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    category: "Post",
    related: ["wedding-videography", "color-grading", "video-editing"],
  },
  {
    slug: "color-grading",
    title: "Color Grading",
    short: "Film-inspired colour that elevates every frame.",
    description:
      "Professional colour grading for wedding films, commercials and brand content — cohesive looks across stills and motion.",
    benefits: [
      "Show LUT and custom grade options",
      "Shot matching across cameras",
      "Skin-tone priority workflows",
      "HDR and SDR delivery masters",
    ],
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
    category: "Post",
    related: ["video-editing", "wedding-film-editing", "commercial-ad-films"],
  },
  {
    slug: "motion-graphics",
    title: "Motion Graphics",
    short: "Titles, explainers and brand motion for premium films.",
    description:
      "Motion graphics that clarify and elevate — openers, lower-thirds, explainer sequences and brand identity animation.",
    benefits: [
      "Custom title design systems",
      "Explainer and infographic motion",
      "Brand-kit aligned animation",
      "Social and broadcast aspect ratios",
    ],
    image:
      "https://images.unsplash.com/photo-1550745165-9bc8b35cd55c?auto=format&fit=crop&w=1200&q=80",
    category: "Post",
    related: ["commercial-ad-films", "video-editing", "brand-story-videos"],
  },
  {
    slug: "album-design",
    title: "Album Design",
    short: "Heirloom wedding albums designed with editorial flow.",
    description:
      "Luxury album design with thoughtful sequencing, typography and print partner coordination for keepsake wedding books.",
    benefits: [
      "Editorial layout storytelling",
      "Premium paper and cover options",
      "Parent album add-ons",
      "Print-managed delivery",
    ],
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    category: "Post",
    related: ["wedding-photography", "photo-editing", "reception-photography"],
  },
  {
    slug: "commercial-ad-films",
    title: "Commercial Ad Films",
    short: "Campaign films built for TV, digital and retail screens.",
    description:
      "End-to-end commercial production — concept, casting support, shoot and finish — for brands that need standout ads.",
    benefits: [
      "Concept and treatment development",
      "Full production crew and gear",
      "Multi-format ad cutdowns",
      "Colour, sound and graphics finish",
    ],
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate",
    related: ["brand-story-videos", "product-videography", "motion-graphics"],
  },
  {
    slug: "brand-story-videos",
    title: "Brand Story Videos",
    short: "Founder and brand origin films that build emotional trust.",
    description:
      "Brand story videos that introduce who you are, why you exist and what makes your craft different — ideal for websites and fundraising.",
    benefits: [
      "Interview-led storytelling",
      "Process and craft B-roll",
      "Narrative scripting support",
      "Website hero and social cutdowns",
    ],
    image:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate",
    related: ["corporate-videography", "interview-videos", "commercial-ad-films"],
  },
];

export const homeServices = [
  "wedding-photography",
  "wedding-videography",
  "corporate-photography",
  "corporate-videography",
  "product-photography",
  "drone-photography",
  "event-photography",
  "video-editing",
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
