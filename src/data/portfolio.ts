export type PortfolioItem = {
  slug: string;
  title: string;
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
    category: "Wedding",
    location: "Udaipur",
    description:
      "A three-day destination wedding filmed across lakeside courtyards, with golden-hour portraits and a cinematic highlight film.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea7bc?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    slug: "mumbai-heritage-ceremony",
    title: "Mumbai Heritage Ceremony",
    category: "Wedding",
    location: "Mumbai",
    description:
      "An intimate city wedding blending traditional rituals with contemporary reception styling at a heritage Mumbai venue.",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    slug: "fintech-brand-film",
    title: "Fintech Brand Film",
    category: "Corporate",
    location: "Bengaluru",
    description:
      "A founder-led brand story and workplace photography system for a growing fintech scale-up.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1573164713714-d95e4367658e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    slug: "jewellery-campaign",
    title: "Jewellery Campaign",
    category: "Products",
    location: "Mumbai",
    description:
      "Art-directed product and campaign stills for a premium jewellery launch across e-commerce and print.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    slug: "hospitality-goa-resort",
    title: "Goa Resort Visuals",
    category: "Hotels",
    location: "Goa",
    description:
      "Hospitality photography and drone coverage for a coastal resort — rooms, dining and experiential lifestyle.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    slug: "restaurant-launch-bandra",
    title: "Bandra Restaurant Launch",
    category: "Restaurants",
    location: "Mumbai",
    description:
      "Food, ambience and launch-night coverage for a new fine-dining restaurant in Bandra.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    slug: "industrial-plant-story",
    title: "Industrial Plant Story",
    category: "Corporate",
    location: "Pune",
    description:
      "Factory photography and manufacturing film for a precision engineering company seeking global buyers.",
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581094794329-c8112c4e5190?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    slug: "luxury-villa-aerials",
    title: "Luxury Villa Aerials",
    category: "Drone",
    location: "Lonavala",
    description:
      "Licensed drone photography and twilight exteriors for a luxury villa listing.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    slug: "award-night-delhi",
    title: "Delhi Award Night",
    category: "Events",
    location: "New Delhi",
    description:
      "Red-carpet and stage coverage for a national awards evening with same-night press delivery.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    slug: "south-mumbai-residence",
    title: "South Mumbai Residence",
    category: "Real Estate",
    location: "Mumbai",
    description:
      "Interior and architectural photography for a restored South Mumbai residence.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
    ],
  },
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
];
