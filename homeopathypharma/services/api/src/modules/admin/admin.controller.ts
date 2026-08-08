import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { AdminService } from './admin.service.js';

/**
 * Admin command center endpoints.
 * Marked @Public for bootstrap on shared/dev hosts; protect with network ACL / reverse proxy in production.
 * Swap to session+RBAC when auth login is wired end-to-end.
 */
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Get('session')
  getSession() {
    return this.adminService.getSession();
  }

  @Public()
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Public()
  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Public()
  @Get('settings')
  getSettings() {
    return this.adminService.getSettings();
  }

  @Public()
  @Patch('settings')
  updateSettings(@Body() body?: unknown) {
    return this.adminService.updateSettings(body);
  }

  @Public()
  @Get('catalog')
  listCatalog() {
    return this.adminService.listCatalog();
  }

  @Public()
  @Patch('catalog/:id')
  patchCatalog(@Param('id') id: string, @Body() body?: unknown) {
    return this.adminService.patchCatalogProduct(id, body);
  }

  @Public()
  @Get('doctors')
  listDoctors() {
    return this.adminService.listDoctors();
  }

  @Public()
  @Patch('doctors/:id')
  patchDoctor(@Param('id') id: string, @Body() body?: unknown) {
    return this.adminService.patchDoctor(id, body);
  }

  @Public()
  @Get('homepage')
  getHomepage() {
    return this.adminService.getHomepage();
  }

  @Public()
  @Put('homepage')
  updateHomepage(@Body() body?: unknown) {
    return this.adminService.updateHomepage(body);
  }

  @Public()
  @Get('queues/:queue')
  listQueues(@Param('queue') queue: string) {
    return this.adminService.listQueues(queue);
  }
}
