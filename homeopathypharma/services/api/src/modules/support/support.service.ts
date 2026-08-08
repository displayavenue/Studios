import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class SupportService {
  async createTicket(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('SupportService.createTicket is not implemented');
  }

  async listTickets(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('SupportService.listTickets is not implemented');
  }

  async getTicket(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('SupportService.getTicket is not implemented');
  }

  async addMessage(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('SupportService.addMessage is not implemented');
  }
}
