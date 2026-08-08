import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class CatalogService {
  async listProducts(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CatalogService.listProducts is not implemented');
  }

  async getProduct(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CatalogService.getProduct is not implemented');
  }

  async listCategories(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CatalogService.listCategories is not implemented');
  }

  async listBrands(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CatalogService.listBrands is not implemented');
  }

  async createProduct(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CatalogService.createProduct is not implemented');
  }

  async updateProduct(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CatalogService.updateProduct is not implemented');
  }
}
