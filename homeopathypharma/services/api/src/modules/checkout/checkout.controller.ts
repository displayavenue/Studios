import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Idempotent } from '../../common/decorators/idempotent.decorator.js';
import { CheckoutService } from './checkout.service.js';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Roles('customer')
  @Idempotent()
  @Post('sessions')
  createSession(@Body() body?: unknown) {
    return this.checkoutService.createSession(body);
  }

  @Roles('customer')
  @Post('sessions/:sessionId/coupons')
  applyCoupon(@Body() body?: unknown) {
    return this.checkoutService.applyCoupon(body);
  }

  @Roles('customer')
  @Idempotent()
  @Post('sessions/:sessionId/complete')
  completeCheckout(@Body() body?: unknown) {
    return this.checkoutService.completeCheckout(body);
  }

}
