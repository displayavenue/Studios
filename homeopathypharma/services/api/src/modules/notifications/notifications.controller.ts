import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { NotificationsService } from './notifications.service.js';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Roles('customer', 'doctor', 'admin')
  @Get('')
  listNotifications() {
    return this.notificationsService.listNotifications();
  }

  @Roles('customer', 'doctor', 'admin')
  @Patch(':id/read')
  markAsRead(@Body() body?: unknown) {
    return this.notificationsService.markAsRead(body);
  }

  @Roles('customer', 'doctor')
  @Get('preferences')
  getPreferences() {
    return this.notificationsService.getPreferences();
  }

  @Roles('customer', 'doctor')
  @Patch('preferences')
  updatePreferences(@Body() body?: unknown) {
    return this.notificationsService.updatePreferences(body);
  }

}
