import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class AdminService {
  async getDashboard(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AdminService.getDashboard is not implemented');
  }

  async listUsers(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AdminService.listUsers is not implemented');
  }

  async getSettings(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AdminService.getSettings is not implemented');
  }

  async updateSettings(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AdminService.updateSettings is not implemented');
  }
}
