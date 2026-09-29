/**
 * Shiprocket integration — SERVER-SIDE ONLY.
 * TODO: Implement HTTP client against SHIPROCKET_BASE_URL in @homeopathypharma/api.
 */

export interface ShiprocketAuthToken {
  token: string;
  expiresAt: number;
}

export interface ShiprocketAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ShiprocketCreateOrderInput {
  orderId: string;
  orderDate: string;
  pickupLocation: string;
  billing: ShiprocketAddress;
  shipping: ShiprocketAddress;
  orderItems: Array<{
    name: string;
    sku: string;
    units: number;
    sellingPrice: number;
  }>;
  paymentMethod: "Prepaid" | "COD";
  subTotal: number;
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
  weightKg: number;
}

export interface ShiprocketOrder {
  orderId: number;
  shipmentId: number;
}

export interface ShiprocketShipment {
  awbCode: string;
  courierName: string;
  status: string;
}

export interface ShiprocketTrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

export interface ShiprocketClient {
  authenticate(email: string, password: string): Promise<ShiprocketAuthToken>;
  createOrder(input: ShiprocketCreateOrderInput): Promise<ShiprocketOrder>;
  createShipment(orderId: number): Promise<ShiprocketShipment>;
  getTracking(awbCode: string): Promise<ShiprocketTrackingEvent[]>;
  verifyWebhookSignature(body: string, signature: string, secret: string): boolean;
}

export class ShiprocketNotConfiguredError extends Error {
  constructor() {
    super("Shiprocket credentials not configured. Set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD.");
    this.name = "ShiprocketNotConfiguredError";
  }
}

export const stubShiprocketClient: ShiprocketClient = {
  async authenticate() {
    throw new ShiprocketNotConfiguredError();
  },
  async createOrder() {
    throw new ShiprocketNotConfiguredError();
  },
  async createShipment() {
    throw new ShiprocketNotConfiguredError();
  },
  async getTracking() {
    throw new ShiprocketNotConfiguredError();
  },
  verifyWebhookSignature() {
    throw new ShiprocketNotConfiguredError();
  },
};
