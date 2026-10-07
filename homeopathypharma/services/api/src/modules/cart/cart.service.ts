import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class CartService {
  async getCart(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CartService.getCart is not implemented');
  }

  async addItem(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CartService.addItem is not implemented');
  }

  async updateItem(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CartService.updateItem is not implemented');
  }

  async removeItem(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CartService.removeItem is not implemented');
  }

  async clearCart(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CartService.clearCart is not implemented');
  }
}
