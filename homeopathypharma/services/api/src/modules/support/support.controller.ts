import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { SupportService } from './support.service.js';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Roles('customer', 'doctor')
  @Post('tickets')
  createTicket(@Body() body?: unknown) {
    return this.supportService.createTicket(body);
  }

  @Roles('customer', 'doctor', 'admin')
  @Get('tickets')
  listTickets() {
    return this.supportService.listTickets();
  }

  @Roles('customer', 'doctor', 'admin')
  @Get('tickets/:id')
  getTicket() {
    return this.supportService.getTicket();
  }

  @Roles('customer', 'doctor', 'admin')
  @Post('tickets/:id/messages')
  addMessage(@Body() body?: unknown) {
    return this.supportService.addMessage(body);
  }

}
