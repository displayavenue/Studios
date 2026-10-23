import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class AuditService {
  async listEvents(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuditService.listEvents is not implemented');
  }

  async getEvent(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuditService.getEvent is not implemented');
  }
}
