import type {
  SupplierProvider,
  SupplierProductResult,
  SupplierInventoryResult,
  SupplierPriceResult,
  SupplierVariantResult,
  SupplierShippingResult,
  SupplierOrderInput,
  SupplierOrderResult,
} from "./types";

const MOCK_CATALOG: SupplierProductResult[] = [
  {
    supplierProductId: "MOCK-SG-001",
    title: "Smart LED Desk Lamp with USB Charging",
    brand: "Velora Basics",
    description: "Adjustable LED desk lamp with 3 brightness levels and USB charging port. Verified supplier demo data.",
    costPrice: 890,
    shippingCost: 80,
    stockQuantity: 120,
    weight: 0.8,
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800"],
    categoryHint: "smart-gadgets",
    attributes: { Color: "White", Material: "ABS+Aluminum" },
  },
  {
    supplierProductId: "MOCK-HK-001",
    title: "Stainless Steel Vacuum Flask 750ml",
    brand: "HomeCraft",
    description: "Double-wall insulated stainless steel flask. Keeps drinks hot or cold. Demo product for development.",
    costPrice: 420,
    shippingCost: 60,
    stockQuantity: 200,
    weight: 0.5,
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800"],
    categoryHint: "home-kitchen",
  },
  {
    supplierProductId: "MOCK-FT-001",
    title: "Resistance Band Set with Door Anchor",
    brand: "FitNest",
    description: "5-band resistance set with handles and door anchor. Demo catalog item.",
    costPrice: 380,
    shippingCost: 50,
    stockQuantity: 85,
    weight: 0.6,
    images: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800"],
    categoryHint: "fitness-wellness",
  },
  {
    supplierProductId: "MOCK-TR-001",
    title: "Compact Travel Organizer Pack",
    brand: "PackLite",
    description: "Packing cubes set for organized travel. Development demo product.",
    costPrice: 310,
    shippingCost: 45,
    stockQuantity: 150,
    weight: 0.4,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"],
    categoryHint: "travel-accessories",
  },
  {
    supplierProductId: "MOCK-AU-001",
    title: "Car Phone Mount Magnetic Holder",
    brand: "DriveSafe",
    description: "Magnetic car phone mount for dashboard and air vent. Demo item.",
    costPrice: 280,
    shippingCost: 40,
    stockQuantity: 300,
    weight: 0.25,
    images: ["https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800"],
    categoryHint: "automotive",
  },
  {
    supplierProductId: "MOCK-BC-001",
    title: "Facial Cleansing Brush Set",
    brand: "GlowKit",
    description: "Soft silicone facial cleansing brush. Demo product — no medical claims.",
    costPrice: 350,
    shippingCost: 45,
    stockQuantity: 90,
    weight: 0.2,
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800"],
    categoryHint: "beauty-personal-care",
  },
  {
    supplierProductId: "MOCK-LS-001",
    title: "Ceramic Desk Planter with Tray",
    brand: "LivingSpace",
    description: "Minimal ceramic planter for indoor plants. Demo catalog.",
    costPrice: 290,
    shippingCost: 70,
    stockQuantity: 60,
    weight: 0.9,
    images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800"],
    categoryHint: "lifestyle",
  },
  {
    supplierProductId: "MOCK-OF-001",
    title: "Ergonomic Laptop Stand Adjustable",
    brand: "WorkEase",
    description: "Aluminum adjustable laptop stand. Demo supplier product.",
    costPrice: 720,
    shippingCost: 90,
    stockQuantity: 110,
    weight: 1.1,
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800"],
    categoryHint: "office-work",
  },
  {
    supplierProductId: "MOCK-EA-001",
    title: "Wireless Earbuds Charging Case",
    brand: "SoundPocket",
    description: "Bluetooth earbuds with charging case. Demo specs only — no fabricated certifications.",
    costPrice: 980,
    shippingCost: 55,
    stockQuantity: 75,
    weight: 0.15,
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800"],
    categoryHint: "electronics-accessories",
  },
  {
    supplierProductId: "MOCK-PT-001",
    title: "Pet Grooming Glove Brush",
    brand: "PawCare",
    description: "Soft pet grooming glove for dogs and cats. Demo product.",
    costPrice: 220,
    shippingCost: 40,
    stockQuantity: 180,
    weight: 0.1,
    images: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800"],
    categoryHint: "pet-products",
  },
  {
    supplierProductId: "MOCK-FA-001",
    title: "Minimal Leather Card Holder",
    brand: "Forma",
    description: "Slim card holder. Demo fashion accessory.",
    costPrice: 260,
    shippingCost: 35,
    stockQuantity: 140,
    weight: 0.08,
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800"],
    categoryHint: "fashion-accessories",
  },
  {
    supplierProductId: "MOCK-HO-001",
    title: "Stackable Storage Bin Set of 3",
    brand: "OrganizeIt",
    description: "Clear stackable storage bins. Demo home organization product.",
    costPrice: 480,
    shippingCost: 100,
    stockQuantity: 95,
    weight: 1.5,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
    categoryHint: "home-organization",
  },
  {
    supplierProductId: "MOCK-PA-001",
    title: "Everyday Crossbody Sling Bag",
    brand: "CarryDay",
    description: "Water-resistant sling bag for daily carry. Demo item.",
    costPrice: 540,
    shippingCost: 55,
    stockQuantity: 70,
    weight: 0.35,
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"],
    categoryHint: "personal-accessories",
  },
  {
    supplierProductId: "MOCK-OT-001",
    title: "Portable Mini Fan Rechargeable",
    brand: "CoolBreeze",
    description: "USB-C rechargeable mini fan. Demo trending product.",
    costPrice: 320,
    shippingCost: 45,
    stockQuantity: 220,
    weight: 0.2,
    images: ["https://images.unsplash.com/photo-1707227155253-27c34f35457b?w=800"],
    categoryHint: "other-trending",
  },
  {
    supplierProductId: "MOCK-SG-002",
    title: "Smart Digital Kitchen Scale",
    brand: "MeasurePro",
    description: "Precision kitchen scale with tare function. Demo gadget.",
    costPrice: 450,
    shippingCost: 50,
    stockQuantity: 130,
    weight: 0.45,
    images: ["https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=800"],
    categoryHint: "smart-gadgets",
  },
  {
    supplierProductId: "MOCK-HK-002",
    title: "Non-Stick Silicone Spatula Set",
    brand: "CookEase",
    description: "Heat-resistant silicone spatula set of 4. Demo kitchen product.",
    costPrice: 210,
    shippingCost: 40,
    stockQuantity: 250,
    weight: 0.3,
    images: ["https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800"],
    categoryHint: "home-kitchen",
  },
  {
    supplierProductId: "MOCK-FT-002",
    title: "Yoga Mat Non-Slip 6mm",
    brand: "FlexMat",
    description: "Non-slip yoga mat with carrying strap. Demo fitness product.",
    costPrice: 560,
    shippingCost: 80,
    stockQuantity: 100,
    weight: 1.2,
    images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800"],
    categoryHint: "fitness-wellness",
  },
  {
    supplierProductId: "MOCK-EA-002",
    title: "Braided USB-C Fast Charge Cable 2m",
    brand: "ChargeLink",
    description: "Durable braided USB-C cable. Demo electronics accessory.",
    costPrice: 180,
    shippingCost: 30,
    stockQuantity: 400,
    weight: 0.1,
    images: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800"],
    categoryHint: "electronics-accessories",
  },
  {
    supplierProductId: "MOCK-BC-002",
    title: "Hair Dryer Diffuser Attachment",
    brand: "StyleAir",
    description: "Universal diffuser attachment. Demo beauty accessory — no performance guarantees.",
    costPrice: 340,
    shippingCost: 45,
    stockQuantity: 80,
    weight: 0.25,
    images: ["https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800"],
    categoryHint: "beauty-personal-care",
  },
  {
    supplierProductId: "MOCK-LS-002",
    title: "Scented Soy Candle Gift Set",
    brand: "Ambiance",
    description: "Set of 3 soy wax candles. Demo lifestyle product.",
    costPrice: 490,
    shippingCost: 70,
    stockQuantity: 55,
    weight: 0.7,
    images: ["https://images.unsplash.com/photo-1602602670342-5c4c4c0c8c8c?w=800"],
    categoryHint: "lifestyle",
  },
];

/**
 * Clearly labeled mock supplier for development when live credentials are unavailable.
 * Not a live supplier API.
 */
export class MockSupplierProvider implements SupplierProvider {
  readonly name = "Mock Supplier (Development)";
  readonly providerType = "MOCK";

  async testConnection() {
    return { ok: true, message: "Mock supplier connected (development only — not a live API)." };
  }

  async searchProducts(query: string, options?: { limit?: number; offset?: number }) {
    const q = query.toLowerCase();
    const filtered = MOCK_CATALOG.filter(
      (p) => p.title.toLowerCase().includes(q) || p.categoryHint?.includes(q),
    );
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? 50;
    return filtered.slice(offset, offset + limit);
  }

  async getProduct(supplierProductId: string) {
    return MOCK_CATALOG.find((p) => p.supplierProductId === supplierProductId) ?? null;
  }

  async getProducts(options?: { limit?: number; offset?: number; category?: string }) {
    let items = MOCK_CATALOG;
    if (options?.category) {
      items = items.filter((p) => p.categoryHint === options.category);
    }
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? 50;
    return items.slice(offset, offset + limit);
  }

  async getInventory(ids: string[]): Promise<SupplierInventoryResult[]> {
    return ids.map((id) => {
      const p = MOCK_CATALOG.find((x) => x.supplierProductId === id);
      return {
        supplierProductId: id,
        quantity: p?.stockQuantity ?? 0,
        available: (p?.stockQuantity ?? 0) > 0,
      };
    });
  }

  async getPrice(ids: string[]): Promise<SupplierPriceResult[]> {
    return ids.map((id) => {
      const p = MOCK_CATALOG.find((x) => x.supplierProductId === id);
      return {
        supplierProductId: id,
        costPrice: p?.costPrice ?? 0,
        shippingCost: p?.shippingCost ?? 0,
      };
    });
  }

  async getVariants(supplierProductId: string): Promise<SupplierVariantResult[]> {
    const p = await this.getProduct(supplierProductId);
    return p?.variants ?? [];
  }

  async getShipping(pincode: string): Promise<SupplierShippingResult> {
    const serviceable = /^\d{6}$/.test(pincode);
    return {
      serviceable,
      cost: serviceable ? 49 : 0,
      estimatedDays: serviceable ? 5 : undefined,
      courier: serviceable ? "MockCourier" : undefined,
      codAvailable: serviceable && !pincode.startsWith("0"),
    };
  }

  async getShippingCost(pincode: string) {
    const s = await this.getShipping(pincode);
    return s.cost;
  }

  async getServiceability(pincode: string) {
    const s = await this.getShipping(pincode);
    return { serviceable: s.serviceable, codAvailable: Boolean(s.codAvailable) };
  }

  async createOrder(input: SupplierOrderInput): Promise<SupplierOrderResult> {
    return {
      supplierOrderId: `MOCK-ORD-${input.externalOrderId}`,
      status: "CONFIRMED",
      trackingNumber: `MOCKAWB${Date.now().toString().slice(-8)}`,
    };
  }

  async getOrder(supplierOrderId: string) {
    return { supplierOrderId, status: "CONFIRMED" };
  }

  async getOrderStatus(supplierOrderId: string) {
    return (await this.getOrder(supplierOrderId))?.status ?? "UNKNOWN";
  }

  async getTracking(supplierOrderId: string) {
    return {
      trackingNumber: `MOCKAWB${supplierOrderId.slice(-6)}`,
      status: "IN_TRANSIT",
      events: [{ status: "PICKED_UP", at: new Date().toISOString() }],
    };
  }

  async cancelOrder() {
    return { ok: true };
  }

  async getReturnInformation() {
    return { returnable: true, windowDays: 7, policy: "Mock return policy for development." };
  }
}

export function getMockCatalogSize() {
  return MOCK_CATALOG.length;
}

export { MOCK_CATALOG };
