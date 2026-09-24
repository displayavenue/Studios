import { Injectable, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class WebhooksService {
  verifyRazorpaySignature(payload: string, signature: string, secret: string): boolean {
    const expected = createHmac('sha256', secret).update(payload).digest('hex');
    try {
      return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    } catch {
      return false;
    }
  }

  verifyShiprocketSignature(payload: string, signature: string, secret: string): boolean {
    const expected = createHmac('sha256', secret).update(payload).digest('hex');
    try {
      return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    } catch {
      return false;
    }
  }

  async handleRazorpayEvent(event: Record<string, unknown>): Promise<{ received: boolean }> {
    throw new NotImplementedException('WebhooksService.handleRazorpayEvent is not implemented');
  }

  async handleShiprocketEvent(event: Record<string, unknown>): Promise<{ received: boolean }> {
    throw new NotImplementedException('WebhooksService.handleShiprocketEvent is not implemented');
  }

  assertRazorpaySignature(payload: string, signature: string | undefined): void {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
    if (!signature || !this.verifyRazorpaySignature(payload, signature, secret)) {
      throw new UnauthorizedException('Invalid Razorpay webhook signature');
    }
  }

  assertShiprocketSignature(payload: string, signature: string | undefined): void {
    const secret = process.env.SHIPROCKET_WEBHOOK_SECRET ?? '';
    if (!signature || !this.verifyShiprocketSignature(payload, signature, secret)) {
      throw new UnauthorizedException('Invalid Shiprocket webhook signature');
    }
  }
}
