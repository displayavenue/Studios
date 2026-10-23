import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Idempotent } from '../../common/decorators/idempotent.decorator.js';
import { PaymentsService } from './payments.service.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles('customer')
  @Idempotent()
  @Post('')
  createPayment(@Body() body?: unknown) {
    return this.paymentsService.createPayment(body);
  }

  @Roles('admin')
  @Idempotent()
  @Post(':id/capture')
  capturePayment(@Body() body?: unknown) {
    return this.paymentsService.capturePayment(body);
  }

  @Roles('admin')
  @Idempotent()
  @Post(':id/refund')
  refundPayment(@Body() body?: unknown) {
    return this.paymentsService.refundPayment(body);
  }

  @Roles('customer', 'admin')
  @Get(':id')
  getPayment() {
    return this.paymentsService.getPayment();
  }

}
