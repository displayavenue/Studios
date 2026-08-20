import { Injectable, NotFoundException } from '@nestjs/common';
import {
  listCatalogProducts,
  readCatalogSnapshot,
  updateCatalogProduct,
} from '@homeopathypharma/content-store';

@Injectable()
export class CatalogService {
  async listProducts() {
    return { items: listCatalogProducts(), total: listCatalogProducts().length };
  }

  async getProduct(slug?: string) {
    const product = listCatalogProducts().find((p) => p.slug === slug);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async listCategories() {
    return { items: readCatalogSnapshot().categories };
  }

  async listBrands() {
    return { items: readCatalogSnapshot().brands };
  }

  async createProduct(body?: unknown) {
    return {
      ok: false,
      message: 'Create product via catalog seed + overrides. Use PATCH for price/stock/listing control.',
      received: body ?? null,
    };
  }

  async updateProduct(id: string, body?: unknown) {
    const patch = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
    const updated = updateCatalogProduct(id, patch);
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }
}
