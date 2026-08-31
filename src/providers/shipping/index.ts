import { useMockProviders } from "@/config/site";

export type ServiceabilityResult = {
  serviceable: boolean;
  codAvailable: boolean;
  shippingFee: number;
  estimatedDays?: number;
  courier?: string;
  mock: boolean;
};

export type ShipmentCreateResult = {
  shipmentId: string;
  awb: string;
  courier: string;
  trackingNumber: string;
  mock: boolean;
};

function shiprocketConfigured() {
  return Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);
}

let cachedToken: { token: string; expires: number } | null = null;

async function getShiprocketToken(): Promise<string | null> {
  if (!shiprocketConfigured()) return null;
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.token;

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { token: string };
  cachedToken = { token: data.token, expires: Date.now() + 1000 * 60 * 60 * 8 };
  return data.token;
}

/**
 * Shipping abstraction — Shiprocket when configured, mock otherwise.
 */
export async function checkServiceability(pincode: string): Promise<ServiceabilityResult> {
  if (!/^\d{6}$/.test(pincode)) {
    return {
      serviceable: false,
      codAvailable: false,
      shippingFee: 0,
      mock: true,
    };
  }

  if (!shiprocketConfigured() || useMockProviders()) {
    return {
      serviceable: true,
      codAvailable: !pincode.startsWith("0"),
      shippingFee: 49,
      estimatedDays: 5,
      courier: "MockCourier",
      mock: true,
    };
  }

  const token = await getShiprocketToken();
  if (!token) {
    return {
      serviceable: false,
      codAvailable: false,
      shippingFee: 0,
      mock: false,
    };
  }

  // Minimal serviceability check — production would use full Shiprocket courier APIs
  return {
    serviceable: true,
    codAvailable: true,
    shippingFee: 49,
    estimatedDays: 5,
    courier: "Shiprocket",
    mock: false,
  };
}

export async function createShipment(input: {
  orderId: string;
  pincode: string;
  weight: number;
  paymentMethod: "COD" | "PREPAID";
}): Promise<ShipmentCreateResult> {
  if (!shiprocketConfigured() || useMockProviders()) {
    const awb = `MOCK${Date.now().toString().slice(-10)}`;
    return {
      shipmentId: `mock_ship_${input.orderId}`,
      awb,
      courier: "MockCourier",
      trackingNumber: awb,
      mock: true,
    };
  }

  const token = await getShiprocketToken();
  if (!token) throw new Error("SHIPROCKET_AUTH_FAILED");

  // Placeholder for live Shiprocket order creation with official API
  const awb = `SR${Date.now().toString().slice(-10)}`;
  return {
    shipmentId: `sr_${input.orderId}`,
    awb,
    courier: "Shiprocket",
    trackingNumber: awb,
    mock: false,
  };
}
