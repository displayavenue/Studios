import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async createPayment(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('PaymentsService.createPayment is not implemented');
  }

  async capturePayment(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('PaymentsService.capturePayment is not implemented');
  }

  async refundPayment(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('PaymentsService.refundPayment is not implemented');
  }

  async getPayment(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('PaymentsService.getPayment is not implemented');
  }
}
