import { Body, Controller, Get, Param, Patch, Put, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { DoctorsService } from './doctors.service.js';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Public()
  @Get()
  listPublic(@Query('city') city?: string) {
    return this.doctorsService.listPublic(city);
  }

  @Public()
  @Get('directory/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.doctorsService.getBySlug(slug);
  }

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
