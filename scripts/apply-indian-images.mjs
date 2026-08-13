#!/usr/bin/env node
/**
 * Apply curated Indian-context Unsplash imagery across CMS JSON files.
 * Run: node scripts/apply-indian-images.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const u = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const img = {
  indianBrideGroom: u("photo-1583939003579-730e3918a45a"),
  indianBrideGroomLg: u("photo-1583939003579-730e3918a45a", 1600),
  indianWeddingCouple: u("photo-1591604466107-ec97de577aff"),
  indianWeddingFilm: u("photo-1606216794074-735e91aa2c92"),
  indianWeddingDecor: u("photo-1519225421980-715cb0215aed"),
  mehendiHands: u("photo-1708963738411-74ab1cd5eafb"),
  bridalPortrait: u("photo-1617627143750-d86bc21e42bb"),
  bridalJewelry: u("photo-1631049307264-da0ec9d70304"),
  traditionalCouple: u("photo-1583391733956-3750e0ff4e8b"),
  sareeFashion: u("photo-1610030469983-98e550d6193c"),
  engagementRitual: u("photo-1465495976277-4387d4b0b4c6"),
  weddingRingsHenna: u("photo-1606800052052-a08af7148866"),
  marigoldCeremony: u("photo-1578662996442-48f60103fc96"),
  sangeetNight: u("photo-1511795409834-ef04bbd61622"),
  weddingMandap: u("photo-1547154338-ef859bca16ca"),
  tajMahal: u("photo-1524492412937-b28074a5d7da"),
  tajMahalAlt: u("photo-1548013146-72479768bada"),
  indiaGate: u("photo-1587474260584-136574528ed5"),
  mumbaiCity: u("photo-1605649487212-47bdab064df7"),
  mumbaiSkyline: u("photo-1564501049412-61c2a3083791"),
  indiaTravel: u("photo-1532375810709-75b1da00537c"),
  indiaHeritage: u("photo-1596178060810-72f53ce9a65c"),
  indiaPalace: u("photo-1596176530529-78163a4f7af2"),
  goaCoast: u("photo-1566073771259-6a8506099945"),
  keralaBackwaters: u("photo-1602216050196-3b31bafaa7a3"),
  indianThali: u("photo-1585937421612-70a008356fbe"),
  indianCurry: u("photo-1565557623262-b51c2513a641"),
  indianCuisine: u("photo-1514222709107-a180c68d72b4"),
  dosaPlate: u("photo-1589304271406-ffaee04a8a4b"),
  spiceMarket: u("photo-1596040033229-a9821ebd058d"),
  officeTeam: u("photo-1556761175-5973dc0f32e7"),
  businessMeeting: u("photo-1573164713714-d95e4367658e"),
  conference: u("photo-1540575467063-178a50c2df87"),
  conferenceHall: u("photo-1505373877841-9e25de39b948"),
  awardStage: u("photo-1492684223066-81342ee5ff30"),
  interview: u("photo-1551836022-d5d88e9218df"),
  goldJewelry: u("photo-1515562141207-7a88fb7ce338"),
  goldBangles: u("photo-1601057294939-8413bcf0695f"),
  productWatch: u("photo-1523275335684-37898b6baf30"),
  amazonProduct: u("photo-1560343090-f0409e92791a"),
  fashionLookbook: u("photo-1515886657613-9f3515b0c78f"),
  factory: u("photo-1565043589221-1a6fd9ae45c7"),
  manufacturing: u("photo-1581094794329-c8112c4e5190"),
  factoryWelder: u("photo-1504917595217-d4dc5ebe6122"),
  construction: u("photo-1503387762-592deb58ef4e"),
  villaAerial: u("photo-1600596542815-ffad4c1539a9"),
  droneSky: u("photo-1473968512647-3e447244af8f"),
  modernInterior: u("photo-1618221195710-dd6b41faaea6"),
  architecture: u("photo-1487958449943-2429e8be8625"),
  hospital: u("photo-1519494026892-80bbd2d6fd0d"),
  medicalCare: u("photo-1576091160399-112ba8d25d1d"),
  campus: u("photo-1523050854058-8df90110c9f1"),
  classroom: u("photo-1509062522246-3755977927db"),
  automobile: u("photo-1492144534655-ae79c964c9d7"),
  livestream: u("photo-1598550476439-6847785fcea6"),
  podcast: u("photo-1478737270239-2f02b77fc618"),
  socialReels: u("photo-1611162616305-c69b3fa7fbe0"),
  youtube: u("photo-1611162616475-46b635cb6868"),
  editing: u("photo-1574717024653-61fd2cf4d44d"),
  photoRetouch: u("photo-1609921217029-ce5dfdfc8d0e"),
  colorGrade: u("photo-1478720568477-152d9b164e26"),
  cameraGear: u("photo-1492691527719-9d1e07e534b4"),
  albumDesign: u("photo-1452587925148-ce544e77e70d"),
  motionGraphics: u("photo-1550745165-9bc8b35cd55c"),
  brandFilm: u("photo-1485846234645-a62644f84728"),
  ngo: u("photo-1469571486292-0ba58a3f068b"),
  government: u("photo-1475721027785-f74eccf877e2"),
  portraitWoman: u("photo-1573497019940-1c28c88b4f3e", 600),
  portraitMan: u("photo-1519081900723-00baa1a4b5de", 600),
  portraitWoman2: u("photo-1580489944761-15a19d654956", 600),
  portraitMan2: u("photo-1506794778202-cad84cf45f1d", 600),
  portraitWoman3: u("photo-1438761681033-6461ffad8d80", 600),
  portraitMan3: u("photo-1560250097-0b93528c311a", 600),
  coupleSmall: u("photo-1583939003579-730e3918a45a", 400),
  professionalWoman: u("photo-1573496359142-b8d87734a5a2", 400),
  professionalMan: u("photo-1507003211169-0a1dd7228f2d", 400),
  doctorWoman: u("photo-1559839734-2b71ea197ec2", 400),
  hotelManager: u("photo-1564501049412-61c2a3083791", 400),
  founderMan: u("photo-1472099645785-5658abf4ff4e", 400),
};

const byServiceSlug = {
  "wedding-photography": img.indianBrideGroom,
  "wedding-videography": img.indianWeddingFilm,
  "pre-wedding-shoot": img.traditionalCouple,
  "engagement-photography": img.engagementRitual,
  "haldi-photography": img.marigoldCeremony,
  "mehendi-photography": img.mehendiHands,
  "sangeet-photography": img.sangeetNight,
  "reception-photography": img.indianWeddingDecor,
  "destination-weddings": img.tajMahal,
  "corporate-photography": img.mumbaiCity,
  "corporate-videography": img.businessMeeting,
  "industrial-photography": img.factory,
  "factory-photography": img.manufacturing,
  "manufacturing-videos": img.factoryWelder,
  "product-photography": img.goldJewelry,
  "product-videography": img.productWatch,
  "amazon-product-photography": img.amazonProduct,
  "flipkart-product-photography": img.goldBangles,
  "food-photography": img.indianThali,
  "restaurant-photography": img.indianCuisine,
  "hotel-photography": img.goaCoast,
  "fashion-photography": img.sareeFashion,
  "model-portfolio": img.bridalPortrait,
  "architecture-photography": img.indiaHeritage,
  "interior-photography": img.modernInterior,
  "real-estate-photography": img.villaAerial,
  "drone-photography": img.indiaGate,
  "drone-videography": img.droneSky,
  "event-photography": img.awardStage,
  "event-videography": img.conference,
  "school-photography": img.classroom,
  "college-events": img.campus,
  "award-shows": img.weddingMandap,
  "conferences": img.conferenceHall,
  "live-streaming": img.livestream,
  "podcast-production": img.podcast,
  "interview-videos": img.interview,
  "social-media-reels": img.socialReels,
  "instagram-content-creation": img.fashionLookbook,
  "youtube-videos": img.youtube,
  "video-editing": img.editing,
  "photo-editing": img.photoRetouch,
  "wedding-film-editing": img.indianWeddingCouple,
  "color-grading": img.colorGrade,
  "motion-graphics": img.motionGraphics,
  "album-design": img.albumDesign,
  "commercial-ad-films": img.brandFilm,
  "brand-story-videos": img.officeTeam,
};

const portfolio = [
  {
    slug: "udaipur-palace-wedding",
    title: "Udaipur Palace Wedding",
    client: "Mehta–Kapoor Family",
    category: "Wedding",
    location: "Udaipur",
    description:
      "A three-day destination wedding filmed across lakeside courtyards, with golden-hour portraits and a cinematic highlight film.",
    image: u("photo-1583939003579-730e3918a45a", 1400),
    gallery: [
      u("photo-1591604466107-ec97de577aff", 1000),
      u("photo-1617627143750-d86bc21e42bb", 1000),
      u("photo-1519225421980-715cb0215aed", 1000),
      u("photo-1708963738411-74ab1cd5eafb", 1000),
      u("photo-1578662996442-48f60103fc96", 1000),
    ],
  },
  {
    slug: "mumbai-heritage-ceremony",
    title: "Mumbai Heritage Ceremony",
    client: "Sharma Wedding",
    category: "Wedding",
    location: "Mumbai",
    description:
      "An intimate city wedding blending traditional rituals with contemporary reception styling at a heritage Mumbai venue.",
    image: u("photo-1591604466107-ec97de577aff", 1400),
    gallery: [
      u("photo-1708963738411-74ab1cd5eafb", 1000),
      u("photo-1583391733956-3750e0ff4e8b", 1000),
      u("photo-1465495976277-4387d4b0b4c6", 1000),
      u("photo-1606800052052-a08af7148866", 1000),
      u("photo-1511795409834-ef04bbd61622", 1000),
    ],
  },
  {
    slug: "jaipur-haldi-sangeet",
    title: "Jaipur Haldi & Sangeet",
    client: "Patel–Singh Wedding",
    category: "Wedding",
    location: "Jaipur",
    description:
      "Vibrant pre-wedding celebrations at a heritage haveli — haldi colours, mehendi details and a high-energy sangeet night.",
    image: u("photo-1578662996442-48f60103fc96", 1400),
    gallery: [
      u("photo-1708963738411-74ab1cd5eafb", 1000),
      u("photo-1511795409834-ef04bbd61622", 1000),
      u("photo-1547154338-ef859bca16ca", 1000),
      u("photo-1606216794074-735e91aa2c92", 1000),
    ],
  },
  {
    slug: "kerala-backwater-wedding",
    title: "Kerala Backwater Wedding",
    client: "Nair Family",
    category: "Wedding",
    location: "Alleppey",
    description:
      "A serene South Indian celebration on houseboats and coconut groves with documentary photography and a cinematic film.",
    image: u("photo-1602216050196-3b31bafaa7a3", 1400),
    gallery: [
      u("photo-1583939003579-730e3918a45a", 1000),
      u("photo-1591604466107-ec97de577aff", 1000),
      u("photo-1524492412937-b28074a5d7da", 1000),
      u("photo-1532375810709-75b1da00537c", 1000),
    ],
  },
  {
    slug: "fintech-brand-film",
    title: "Fintech Brand Film",
    client: "PaySwift India",
    category: "Corporate",
    location: "Bengaluru",
    description:
      "A founder-led brand story and workplace photography system for a growing fintech scale-up.",
    image: u("photo-1605649487212-47bdab064df7", 1400),
    gallery: [
      u("photo-1573164713714-d95e4367658e", 1000),
      u("photo-1556761175-5973dc0f32e7", 1000),
      u("photo-1485846234645-a62644f84728", 1000),
      u("photo-1551836022-d5d88e9218df", 1000),
    ],
  },
  {
    slug: "jewellery-campaign",
    title: "Jewellery Campaign",
    client: "Aurum Jewellers",
    category: "Products",
    location: "Mumbai",
    description:
      "Art-directed product and campaign stills for a premium jewellery launch across e-commerce and print.",
    image: u("photo-1631049307264-da0ec9d70304", 1400),
    gallery: [
      u("photo-1515562141207-7a88fb7ce338", 1000),
      u("photo-1610030469983-98e550d6193c", 1000),
      u("photo-1601057294939-8413bcf0695f", 1000),
      u("photo-1610014960297-74ca2baa9860", 1000),
    ],
  },
  {
    slug: "d2c-skincare-launch",
    title: "D2C Skincare Launch",
    client: "GlowRoot India",
    category: "Products",
    location: "Mumbai",
    description:
      "Amazon-ready packshots, lifestyle frames and reel content for an Indian skincare brand's national launch.",
    image: u("photo-1560343090-f0409e92791a", 1400),
    gallery: [
      u("photo-1523275335684-37898b6baf30", 1000),
      u("photo-1515886657613-9f3515b0c78f", 1000),
      u("photo-1611162616305-c69b3fa7fbe0", 1000),
    ],
  },
  {
    slug: "hospitality-goa-resort",
    title: "Goa Resort Visuals",
    client: "Azure Bay Resort",
    category: "Hotels",
    location: "Goa",
    description:
      "Hospitality photography and drone coverage for a coastal resort — rooms, dining and experiential lifestyle.",
    image: u("photo-1566073771259-6a8506099945", 1400),
    gallery: [
      u("photo-1596176530529-78163a4f7af2", 1000),
      u("photo-1532375810709-75b1da00537c", 1000),
      u("photo-1564501049412-61c2a3083791", 1000),
      u("photo-1582719508461-905c673771fd", 1000),
    ],
  },
  {
    slug: "restaurant-launch-bandra",
    title: "Bandra Restaurant Launch",
    client: "Maison Table",
    category: "Restaurants",
    location: "Mumbai",
    description:
      "Food, ambience and launch-night coverage for a new fine-dining restaurant in Bandra.",
    image: u("photo-1585937421612-70a008356fbe", 1400),
    gallery: [
      u("photo-1514222709107-a180c68d72b4", 1000),
      u("photo-1565557623262-b51c2513a641", 1000),
      u("photo-1589304271406-ffaee04a8a4b", 1000),
      u("photo-1596040033229-a9821ebd058d", 1000),
    ],
  },
  {
    slug: "industrial-plant-story",
    title: "Industrial Plant Story",
    client: "Precision Forge Ltd",
    category: "Corporate",
    location: "Pune",
    description:
      "Factory photography and manufacturing film for a precision engineering company seeking global buyers.",
    image: u("photo-1565043589221-1a6fd9ae45c7", 1400),
    gallery: [
      u("photo-1581094794329-c8112c4e5190", 1000),
      u("photo-1504917595217-d4dc5ebe6122", 1000),
      u("photo-1503387762-592deb58ef4e", 1000),
    ],
  },
  {
    slug: "luxury-villa-aerials",
    title: "Luxury Villa Aerials",
    client: "Hillside Estates",
    category: "Drone",
    location: "Lonavala",
    description:
      "Licensed drone photography and twilight exteriors for a luxury villa listing.",
    image: u("photo-1548013146-72479768bada", 1400),
    gallery: [
      u("photo-1587474260584-136574528ed5", 1000),
      u("photo-1524492412937-b28074a5d7da", 1000),
      u("photo-1600596542815-ffad4c1539a9", 1000),
      u("photo-1473968512647-3e447244af8f", 1000),
    ],
  },
  {
    slug: "award-night-delhi",
    title: "Delhi Award Night",
    client: "India Business Council",
    category: "Events",
    location: "New Delhi",
    description:
      "Red-carpet and stage coverage for a national awards evening with same-night press delivery.",
    image: u("photo-1492684223066-81342ee5ff30", 1400),
    gallery: [
      u("photo-1547154338-ef859bca16ca", 1000),
      u("photo-1475721027785-f74eccf877e2", 1000),
      u("photo-1540575467063-178a50c2df87", 1000),
      u("photo-1505373877841-9e25de39b948", 1000),
    ],
  },
  {
    slug: "hyderabad-tech-summit",
    title: "Hyderabad Tech Summit",
    client: "Telangana IT Dept",
    category: "Events",
    location: "Hyderabad",
    description:
      "Multi-camera conference coverage, keynote films and social selects for a 2,000-delegate technology summit.",
    image: u("photo-1505373877841-9e25de39b948", 1400),
    gallery: [
      u("photo-1540575467063-178a50c2df87", 1000),
      u("photo-1598550476439-6847785fcea6", 1000),
      u("photo-1605649487212-47bdab064df7", 1000),
    ],
  },
  {
    slug: "south-mumbai-residence",
    title: "South Mumbai Residence",
    client: "Birla Estates",
    category: "Real Estate",
    location: "Mumbai",
    description:
      "Interior and architectural photography for a restored South Mumbai residence.",
    image: u("photo-1596176530529-78163a4f7af2", 1400),
    gallery: [
      u("photo-1618221195710-dd6b41faaea6", 1000),
      u("photo-1487958449943-2429e8be8625", 1000),
      u("photo-1600596542815-ffad4c1539a9", 1000),
      u("photo-1596178060810-72f53ce9a65c", 1000),
    ],
  },
  {
    slug: "hospital-trust-film",
    title: "Hospital Trust Film",
    client: "MetroCare Hospitals",
    category: "Healthcare",
    location: "Hyderabad",
    description:
      "Patient-centred brand film and facility photography for a multi-speciality hospital network.",
    image: u("photo-1519494026892-80bbd2d6fd0d", 1400),
    gallery: [
      u("photo-1576091160399-112ba8d25d1d", 1000),
      u("photo-1559839734-2b71ea197ec2", 1000),
    ],
  },
  {
    slug: "fashion-lookbook",
    title: "Festive Lookbook",
    client: "Luxe Loom",
    category: "Fashion",
    location: "Mumbai",
    description:
      "Seasonal lookbook and reel content for a contemporary ethnic wear label.",
    image: u("photo-1610030469983-98e550d6193c", 1400),
    gallery: [
      u("photo-1515886657613-9f3515b0c78f", 1000),
      u("photo-1617627143750-d86bc21e42bb", 1000),
      u("photo-1529626455594-4ff0802cfb7e", 1000),
    ],
  },
];

function writeJson(rel, data) {
  const file = path.join(root, rel);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("updated", rel);
}

// --- services.json ---
const servicesPath = path.join(root, "public/content/services.json");
const servicesData = JSON.parse(fs.readFileSync(servicesPath, "utf8"));
for (const service of servicesData.services) {
  if (byServiceSlug[service.slug]) {
    service.image = byServiceSlug[service.slug];
  }
}
writeJson("public/content/services.json", servicesData);

// --- home.json ---
const homePath = path.join(root, "public/content/home.json");
const homeData = JSON.parse(fs.readFileSync(homePath, "utf8"));
homeData.hero.image = img.indianBrideGroomLg;
homeData.hero.imageAlt =
  "Indian bride and groom in traditional wedding attire at a luxury celebration photographed by DisplayAvenue Studios";
writeJson("public/content/home.json", homeData);

// --- portfolio.json ---
writeJson("public/content/portfolio.json", {
  portfolio,
  portfolioCategories: [
    "All",
    "Wedding",
    "Corporate",
    "Products",
    "Events",
    "Drone",
    "Hotels",
    "Restaurants",
    "Real Estate",
    "Healthcare",
    "Fashion",
  ],
});

// --- content.json ---
const contentPath = path.join(root, "public/content/content.json");
const contentData = JSON.parse(fs.readFileSync(contentPath, "utf8"));

contentData.testimonials = [
  {
    name: "Aanya & Rohan Mehta",
    role: "Destination Wedding · Udaipur",
    quote:
      "DisplayAvenue felt like a luxury film crew, not just photographers. Every ritual was covered with calm precision and the highlight film still gives us chills.",
    image: img.coupleSmall,
  },
  {
    name: "Neha Kapoor",
    role: "Marketing Head · Nykaa",
    quote:
      "Our product launch assets were delivered on time, on brand and conversion-ready for Amazon and Instagram. The team understands both aesthetics and business.",
    image: img.professionalWoman,
  },
  {
    name: "Vikram Shah",
    role: "General Manager · Marriott Goa",
    quote:
      "From drone approaches to suite interiors, the hospitality imagery elevated our OTA listings immediately. Guests now mention the photos when they book.",
    image: img.hotelManager,
  },
  {
    name: "Karan Malhotra",
    role: "Founder · PaySwift India",
    quote:
      "They translated our fintech story into a founder film and workplace library our investors actually use. Professional, fast and detail-oriented.",
    image: img.founderMan,
  },
  {
    name: "Dr. Priya Nambiar",
    role: "Director · MetroCare Hospitals",
    quote:
      "Sensitive hospital coverage with the right permissions and patient dignity. Our trust film has become central to our brand campaigns.",
    image: img.doctorWoman,
  },
  {
    name: "Siddharth Rao",
    role: "Events Lead · Tata Motors",
    quote:
      "Launch night coverage with same-day selects for press and social. The crew handled a high-pressure automotive reveal flawlessly.",
    image: img.professionalMan,
  },
];

contentData.blogs = contentData.blogs.map((blog) => {
  const images = {
    "how-to-choose-wedding-photographer-mumbai": img.indianWeddingCouple,
    "product-photography-tips-ecommerce-india": img.bridalJewelry,
    "destination-wedding-film-checklist": img.tajMahal,
    "corporate-brand-film-brief": img.mumbaiCity,
    "drone-rules-wedding-india": img.tajMahalAlt,
    "real-estate-photography-sells-faster": img.indiaPalace,
  };
  return { ...blog, image: images[blog.slug] || blog.image };
});

contentData.industries = [
  { slug: "manufacturing", title: "Manufacturing", text: contentData.industries.find((i) => i.slug === "manufacturing")?.text, image: img.manufacturing, projectCount: 68 },
  { slug: "healthcare", title: "Healthcare", text: contentData.industries.find((i) => i.slug === "healthcare")?.text, image: img.hospital, projectCount: 42 },
  { slug: "hotels", title: "Hotels", text: contentData.industries.find((i) => i.slug === "hotels")?.text, image: img.goaCoast, projectCount: 95 },
  { slug: "restaurants", title: "Restaurants", text: contentData.industries.find((i) => i.slug === "restaurants")?.text, image: img.indianThali, projectCount: 73 },
  { slug: "education", title: "Education", text: contentData.industries.find((i) => i.slug === "education")?.text, image: img.classroom, projectCount: 38 },
  { slug: "construction", title: "Construction", text: contentData.industries.find((i) => i.slug === "construction")?.text, image: img.construction, projectCount: 55 },
  { slug: "automobile", title: "Automobile", text: contentData.industries.find((i) => i.slug === "automobile")?.text, image: img.automobile, projectCount: 47 },
  { slug: "fashion", title: "Fashion", text: contentData.industries.find((i) => i.slug === "fashion")?.text, image: img.sareeFashion, projectCount: 61 },
  { slug: "government", title: "Government", text: contentData.industries.find((i) => i.slug === "government")?.text, image: img.government, projectCount: 29 },
  { slug: "ngos", title: "NGOs", text: contentData.industries.find((i) => i.slug === "ngos")?.text, image: img.ngo, projectCount: 22 },
  { slug: "real-estate", title: "Real Estate", text: contentData.industries.find((i) => i.slug === "real-estate")?.text, image: img.villaAerial, projectCount: 84 },
];

contentData.team = [
  { name: "Arjun Desai", role: "Creative Director · 12 yrs", image: img.portraitMan3 },
  { name: "Meera Iyer", role: "Lead Wedding Photographer", image: img.portraitWoman },
  { name: "Kabir Khan", role: "Director of Photography", image: img.portraitMan },
  { name: "Sara Pinto", role: "Head of Post Production", image: img.portraitWoman2 },
  { name: "Rohan Kulkarni", role: "Executive Producer", image: img.portraitMan2 },
  { name: "Anita Verma", role: "Client Success Lead", image: img.portraitWoman3 },
];

writeJson("public/content/content.json", contentData);

console.log("Done — services:", servicesData.services.length, "portfolio:", portfolio.length);
