import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class ReferralsService {
  async createReferral(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ReferralsService.createReferral is not implemented');
  }

  async listReferrals(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ReferralsService.listReferrals is not implemented');
  }

  async redeemReferral(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ReferralsService.redeemReferral is not implemented');
  }
}
