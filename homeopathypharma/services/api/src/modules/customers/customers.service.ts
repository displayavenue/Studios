import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class CustomersService {
  async getProfile(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CustomersService.getProfile is not implemented');
  }

  async updateProfile(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CustomersService.updateProfile is not implemented');
  }

  async listAddresses(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CustomersService.listAddresses is not implemented');
  }

  async createAddress(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CustomersService.createAddress is not implemented');
  }

  async listOrders(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CustomersService.listOrders is not implemented');
  }
}
