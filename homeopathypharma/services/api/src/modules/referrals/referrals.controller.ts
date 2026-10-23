import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Idempotent } from '../../common/decorators/idempotent.decorator.js';
import { ReferralsService } from './referrals.service.js';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Roles('customer')
  @Post('')
  createReferral(@Body() body?: unknown) {
    return this.referralsService.createReferral(body);
  }

  @Roles('customer')
  @Get('')
  listReferrals() {
    return this.referralsService.listReferrals();
  }

  @Roles('customer')
  @Idempotent()
  @Post('redeem')
  redeemReferral(@Body() body?: unknown) {
    return this.referralsService.redeemReferral(body);
  }

}
