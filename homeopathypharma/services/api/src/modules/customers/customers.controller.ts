import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CustomersService } from './customers.service.js';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Roles('customer')
  @Get('profile')
  getProfile() {
    return this.customersService.getProfile();
  }

  @Roles('customer')
  @Patch('profile')
  updateProfile(@Body() body?: unknown) {
    return this.customersService.updateProfile(body);
  }

  @Roles('customer')
  @Get('addresses')
  listAddresses() {
    return this.customersService.listAddresses();
  }

  @Roles('customer')
  @Post('addresses')
  createAddress(@Body() body?: unknown) {
    return this.customersService.createAddress(body);
  }

  @Roles('customer')
  @Get('orders')
  listOrders() {
    return this.customersService.listOrders();
  }

}
