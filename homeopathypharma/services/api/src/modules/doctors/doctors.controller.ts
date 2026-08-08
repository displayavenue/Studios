import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { DoctorsService } from './doctors.service.js';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Roles('doctor')
  @Get('profile')
  getProfile() {
    return this.doctorsService.getProfile();
  }

  @Roles('doctor')
  @Patch('profile')
  updateProfile(@Body() body?: unknown) {
    return this.doctorsService.updateProfile(body);
  }

  @Roles('doctor')
  @Get('availability')
  getAvailability() {
    return this.doctorsService.getAvailability();
  }

  @Roles('doctor')
  @Put('availability')
  setAvailability(@Body() body?: unknown) {
    return this.doctorsService.setAvailability(body);
  }

  @Roles('doctor')
  @Get('patients')
  listPatients() {
    return this.doctorsService.listPatients();
  }

}
