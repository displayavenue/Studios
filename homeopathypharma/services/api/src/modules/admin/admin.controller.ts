import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { AdminService } from './admin.service.js';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles('admin')
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Roles('admin')
  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Roles('admin')
  @Get('settings')
  getSettings() {
    return this.adminService.getSettings();
  }

  @Roles('admin')
  @Patch('settings')
  updateSettings(@Body() body?: unknown) {
    return this.adminService.updateSettings(body);
  }

}
