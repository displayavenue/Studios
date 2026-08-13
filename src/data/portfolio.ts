export type PortfolioItem = {
  slug: string;
  title: string;
  client?: string;
  category: string;
  location: string;
  description: string;
  image: string;
  gallery: string[];
};

export const portfolio: PortfolioItem[] = [
  {
    slug: "udaipur-palace-wedding",
    title: "Udaipur Palace Wedding",
    client: "Mehta–Kapoor Family",
    category: "Wedding",
    location: "Udaipur",
    description: "A three-day destination wedding filmed across lakeside courtyards, with golden-hour portraits and a cinematic highlight film.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1708963738411-74ab1cd5eafb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "mumbai-heritage-ceremony",
    title: "Mumbai Heritage Ceremony",
    client: "Sharma Wedding",
    category: "Wedding",
    location: "Mumbai",
    description: "An intimate city wedding blending traditional rituals with contemporary reception styling at a heritage Mumbai venue.",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1708963738411-74ab1cd5eafb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "jaipur-haldi-sangeet",
    title: "Jaipur Haldi & Sangeet",
    client: "Patel–Singh Wedding",
    category: "Wedding",
    location: "Jaipur",
    description: "Vibrant pre-wedding celebrations at a heritage haveli — haldi colours, mehendi details and a high-energy sangeet night.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1708963738411-74ab1cd5eafb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "kerala-backwater-wedding",
    title: "Kerala Backwater Wedding",
    client: "Nair Family",
    category: "Wedding",
    location: "Alleppey",
    description: "A serene South Indian celebration on houseboats and coconut groves with documentary photography and a cinematic film.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "fintech-brand-film",
    title: "Fintech Brand Film",
    client: "PaySwift India",
    category: "Corporate",
    location: "Bengaluru",
    description: "A founder-led brand story and workplace photography system for a growing fintech scale-up.",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "jewellery-campaign",
    title: "Jewellery Campaign",
    client: "Aurum Jewellers",
    category: "Products",
    location: "Mumbai",
    description: "Art-directed product and campaign stills for a premium jewellery launch across e-commerce and print.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "d2c-skincare-launch",
    title: "D2C Skincare Launch",
    client: "GlowRoot India",
    category: "Products",
    location: "Mumbai",
    description: "Amazon-ready packshots, lifestyle frames and reel content for an Indian skincare brand's national launch.",
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "hospitality-goa-resort",
    title: "Goa Resort Visuals",
    client: "Azure Bay Resort",
    category: "Hotels",
    location: "Goa",
    description: "Hospitality photography and drone coverage for a coastal resort — rooms, dining and experiential lifestyle.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "restaurant-launch-bandra",
    title: "Bandra Restaurant Launch",
    client: "Maison Table",
    category: "Restaurants",
    location: "Mumbai",
    description: "Food, ambience and launch-night coverage for a new fine-dining restaurant in Bandra.",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "industrial-plant-story",
    title: "Industrial Plant Story",
    client: "Precision Forge Ltd",
    category: "Corporate",
    location: "Pune",
    description: "Factory photography and manufacturing film for a precision engineering company seeking global buyers.",
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "luxury-villa-aerials",
    title: "Luxury Villa Aerials",
    client: "Hillside Estates",
    category: "Drone",
    location: "Lonavala",
    description: "Licensed drone photography and twilight exteriors for a luxury villa listing.",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "award-night-delhi",
    title: "Delhi Award Night",
    client: "India Business Council",
    category: "Events",
    location: "New Delhi",
    description: "Red-carpet and stage coverage for a national awards evening with same-night press delivery.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "hyderabad-tech-summit",
    title: "Hyderabad Tech Summit",
    client: "Telangana IT Dept",
    category: "Events",
    location: "Hyderabad",
    description: "Multi-camera conference coverage, keynote films and social selects for a 2,000-delegate technology summit.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "south-mumbai-residence",
    title: "South Mumbai Residence",
    client: "Birla Estates",
    category: "Real Estate",
    location: "Mumbai",
    description: "Interior and architectural photography for a restored South Mumbai residence.",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "hospital-trust-film",
    title: "Hospital Trust Film",
    client: "MetroCare Hospitals",
    category: "Healthcare",
    location: "Hyderabad",
    description: "Patient-centred brand film and facility photography for a multi-speciality hospital network.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80"
    ],
  },
  {
    slug: "fashion-lookbook",
    title: "Festive Lookbook",
    client: "Luxe Loom",
    category: "Fashion",
    location: "Mumbai",
    description: "Seasonal lookbook and reel content for a contemporary ethnic wear label.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1000&q=80"
    ],
  }
];

export const portfolioCategories = [
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
  "Fashion"
];
