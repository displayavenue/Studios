import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Idempotent } from '../../common/decorators/idempotent.decorator.js';
import { ConsultationsService } from './consultations.service.js';

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Roles('customer')
  @Idempotent()
  @Post('book')
  bookConsultation(@Body() body?: unknown) {
    return this.consultationsService.bookConsultation(body);
  }

  @Roles('customer', 'doctor')
  @Get('')
  listConsultations() {
    return this.consultationsService.listConsultations();
  }

  @Roles('customer', 'doctor')
  @Get(':id')
  getConsultation() {
    return this.consultationsService.getConsultation();
  }

  @Roles('customer', 'doctor')
  @Post(':id/cancel')
  cancelConsultation(@Body() body?: unknown) {
    return this.consultationsService.cancelConsultation(body);
  }

  @Roles('customer', 'doctor')
  @Post(':id/join')
  joinConsultation(@Body() body?: unknown) {
    return this.consultationsService.joinConsultation(body);
  }

}
