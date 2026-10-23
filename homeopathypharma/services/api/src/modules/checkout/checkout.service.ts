import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class CheckoutService {
  async createSession(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CheckoutService.createSession is not implemented');
  }

  async applyCoupon(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CheckoutService.applyCoupon is not implemented');
  }

  async completeCheckout(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('CheckoutService.completeCheckout is not implemented');
  }
}
