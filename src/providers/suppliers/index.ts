import type { SupplierProvider } from "./types";
import { MockSupplierProvider } from "./mock-supplier";
import { useMockProviders } from "@/config/site";

/**
 * CSV supplier adapter — parses uploaded feed rows into the generic provider shape.
 * Does not scrape websites.
 */
export class CsvSupplierProvider implements SupplierProvider {
  readonly name = "CSV Supplier";
  readonly providerType = "CSV";
  private rows: Array<Record<string, string>>;

  constructor(rows: Array<Record<string, string>> = []) {
    this.rows = rows;
  }

  setRows(rows: Array<Record<string, string>>) {
    this.rows = rows;
  }

  async testConnection() {
    return {
      ok: true,
      message: `CSV provider ready with ${this.rows.length} rows.`,
    };
  }

  private mapRow(row: Record<string, string>) {
    return {
      supplierProductId: row.id || row.sku || row.supplier_product_id || "",
      title: row.title || row.name || "Untitled",
      brand: row.brand,
      description: row.description,
      costPrice: Number(row.cost || row.cost_price || 0),
      shippingCost: Number(row.shipping || row.shipping_cost || 0),
      stockQuantity: Number(row.stock || row.inventory || 0),
      weight: row.weight ? Number(row.weight) : undefined,
      images: row.image ? [row.image] : row.images?.split("|"),
      categoryHint: row.category,
      gtin: row.gtin || undefined,
      mpn: row.mpn || undefined,
    };
  }

  async searchProducts(query: string, options?: { limit?: number; offset?: number }) {
    const q = query.toLowerCase();
    const filtered = this.rows
      .map((r) => this.mapRow(r))
      .filter((p) => p.title.toLowerCase().includes(q));
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? 50;
    return filtered.slice(offset, offset + limit);
  }

  async getProduct(id: string) {
    const row = this.rows.find(
      (r) => r.id === id || r.sku === id || r.supplier_product_id === id,
    );
    return row ? this.mapRow(row) : null;
  }

  async getProducts(options?: { limit?: number; offset?: number }) {
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? 50;
    return this.rows.slice(offset, offset + limit).map((r) => this.mapRow(r));
  }

  async getInventory(ids: string[]) {
    const products = await Promise.all(ids.map((id) => this.getProduct(id)));
    return products.map((p, i) => ({
      supplierProductId: ids[i],
      quantity: p?.stockQuantity ?? 0,
      available: (p?.stockQuantity ?? 0) > 0,
    }));
  }

  async getPrice(ids: string[]) {
    const products = await Promise.all(ids.map((id) => this.getProduct(id)));
    return products.map((p, i) => ({
      supplierProductId: ids[i],
      costPrice: p?.costPrice ?? 0,
      shippingCost: p?.shippingCost ?? 0,
    }));
  }

  async getVariants() {
    return [];
  }

  async getShipping() {
    return { serviceable: true, cost: 49, estimatedDays: 5, codAvailable: true };
  }

  async getShippingCost() {
    return 49;
  }

  async getServiceability() {
    return { serviceable: true, codAvailable: true };
  }

  async createOrder(input: { externalOrderId: string }) {
    return { supplierOrderId: `CSV-${input.externalOrderId}`, status: "PENDING_MANUAL" };
  }

  async getOrder(id: string) {
    return { supplierOrderId: id, status: "PENDING_MANUAL" };
  }

  async getOrderStatus() {
    return "PENDING_MANUAL";
  }

  async getTracking() {
    return { status: "PENDING_MANUAL" };
  }

  async cancelOrder() {
    return { ok: true };
  }

  async getReturnInformation() {
    return { returnable: false, policy: "Configure return policy for CSV supplier." };
  }
}

/**
 * Generic API supplier — connects to a configured REST base URL.
 * Requires credentials; falls back messaging when unavailable.
 */
export class ApiSupplierProvider implements SupplierProvider {
  readonly name: string;
  readonly providerType = "API";
  private baseUrl: string;
  private apiKey?: string;

  constructor(name: string, baseUrl: string, apiKey?: string) {
    this.name = name;
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  private headers() {
    const h: Record<string, string> = { Accept: "application/json" };
    if (this.apiKey) h.Authorization = `Bearer ${this.apiKey}`;
    return h;
  }

  async testConnection() {
    if (!this.baseUrl) {
      return { ok: false, message: "API base URL not configured." };
    }
    try {
      const res = await fetch(`${this.baseUrl}/health`, { headers: this.headers() });
      if (!res.ok) {
        return { ok: false, message: `API health check failed: ${res.status}` };
      }
      return { ok: true, message: "API supplier connection OK." };
    } catch (e) {
      return {
        ok: false,
        message: `API unreachable: ${e instanceof Error ? e.message : "unknown error"}`,
      };
    }
  }

  async searchProducts(_query: string, _options?: { limit?: number; offset?: number }): Promise<import("./types").SupplierProductResult[]> {
    throw new Error("API supplier search requires a live connected endpoint.");
  }
  async getProduct(_id: string) {
    return null;
  }
  async getProducts(_options?: { limit?: number; offset?: number; category?: string }) {
    return [];
  }
  async getInventory(_ids: string[]) {
    return [];
  }
  async getPrice(_ids: string[]) {
    return [];
  }
  async getVariants(_id: string) {
    return [];
  }
  async getShipping(_pincode: string) {
    return { serviceable: false, cost: 0 };
  }
  async getShippingCost(_pincode: string) {
    return 0;
  }
  async getServiceability(_pincode: string) {
    return { serviceable: false, codAvailable: false };
  }
  async createOrder(_input: import("./types").SupplierOrderInput): Promise<import("./types").SupplierOrderResult> {
    throw new Error("API supplier order requires live credentials.");
  }
  async getOrder(_id: string) {
    return null;
  }
  async getOrderStatus(_id: string) {
    return "UNKNOWN";
  }
  async getTracking(_id: string) {
    return { status: "UNKNOWN" };
  }
  async cancelOrder(_id: string) {
    return { ok: false };
  }
  async getReturnInformation(_id: string) {
    return { returnable: false };
  }
}

export function createSupplierProvider(input: {
  providerType: string;
  name?: string;
  apiBaseUrl?: string | null;
  credentials?: string | null;
}): SupplierProvider {
  const type = input.providerType.toUpperCase();

  if (type === "CSV") return new CsvSupplierProvider();
  if (type === "API" || type === "CUSTOM") {
    return new ApiSupplierProvider(
      input.name || "API Supplier",
      input.apiBaseUrl || "",
      input.credentials || undefined,
    );
  }
  if (type === "MOCK" || useMockProviders()) {
    return new MockSupplierProvider();
  }

  // Vendor-specific adapters would plug in here (CJ, Baapstore, Deodap)
  // only when legitimate credentials and permitted APIs are available.
  return new MockSupplierProvider();
}
