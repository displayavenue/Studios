export type SupplierProductResult = {
  supplierProductId: string;
  title: string;
  brand?: string;
  description?: string;
  costPrice: number;
  shippingCost: number;
  stockQuantity: number;
  weight?: number;
  images?: string[];
  variants?: SupplierVariantResult[];
  attributes?: Record<string, string>;
  categoryHint?: string;
  gtin?: string;
  mpn?: string;
};

export type SupplierVariantResult = {
  supplierVariantId: string;
  title?: string;
  price: number;
  cost: number;
  inventory: number;
  image?: string;
  attributes?: Record<string, string>;
};

export type SupplierInventoryResult = {
  supplierProductId: string;
  quantity: number;
  available: boolean;
};

export type SupplierPriceResult = {
  supplierProductId: string;
  costPrice: number;
  shippingCost: number;
};

export type SupplierShippingResult = {
  serviceable: boolean;
  cost: number;
  estimatedDays?: number;
  courier?: string;
  codAvailable?: boolean;
};

export type SupplierOrderInput = {
  externalOrderId: string;
  items: Array<{
    supplierProductId: string;
    supplierVariantId?: string;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
};

export type SupplierOrderResult = {
  supplierOrderId: string;
  status: string;
  trackingNumber?: string;
};

/**
 * Generic supplier abstraction.
 * Implementations: Mock, CSV, API, and vendor-specific adapters.
 * Do not hard-code the store to a single supplier.
 */
export interface SupplierProvider {
  readonly name: string;
  readonly providerType: string;

  testConnection(): Promise<{ ok: boolean; message: string }>;
  searchProducts(query: string, options?: { limit?: number; offset?: number }): Promise<SupplierProductResult[]>;
  getProduct(supplierProductId: string): Promise<SupplierProductResult | null>;
  getProducts(options?: { limit?: number; offset?: number; category?: string }): Promise<SupplierProductResult[]>;
  getInventory(supplierProductIds: string[]): Promise<SupplierInventoryResult[]>;
  getPrice(supplierProductIds: string[]): Promise<SupplierPriceResult[]>;
  getVariants(supplierProductId: string): Promise<SupplierVariantResult[]>;
  getShipping(pincode: string, weightKg?: number): Promise<SupplierShippingResult>;
  getShippingCost(pincode: string, weightKg?: number): Promise<number>;
  getServiceability(pincode: string): Promise<{ serviceable: boolean; codAvailable: boolean }>;
  createOrder(input: SupplierOrderInput): Promise<SupplierOrderResult>;
  getOrder(supplierOrderId: string): Promise<SupplierOrderResult | null>;
  getOrderStatus(supplierOrderId: string): Promise<string>;
  getTracking(supplierOrderId: string): Promise<{ trackingNumber?: string; status: string; events?: Array<{ status: string; at: string }> }>;
  cancelOrder(supplierOrderId: string): Promise<{ ok: boolean }>;
  getReturnInformation(supplierOrderId: string): Promise<{ returnable: boolean; windowDays?: number; policy?: string }>;
}
