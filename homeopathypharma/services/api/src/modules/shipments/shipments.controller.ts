import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Idempotent } from '../../common/decorators/idempotent.decorator.js';
import { ShipmentsService } from './shipments.service.js';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Roles('admin')
  @Idempotent()
  @Post('')
  createShipment(@Body() body?: unknown) {
    return this.shipmentsService.createShipment(body);
  }

  @Roles('customer', 'admin')
  @Get(':id/track')
  trackShipment() {
    return this.shipmentsService.trackShipment();
  }

  @Roles('admin')
  @Idempotent()
  @Post(':id/cancel')
  cancelShipment(@Body() body?: unknown) {
    return this.shipmentsService.cancelShipment(body);
  }

}
