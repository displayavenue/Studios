import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async listNotifications(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('NotificationsService.listNotifications is not implemented');
  }

  async markAsRead(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('NotificationsService.markAsRead is not implemented');
  }

  async getPreferences(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('NotificationsService.getPreferences is not implemented');
  }

  async updatePreferences(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('NotificationsService.updatePreferences is not implemented');
  }
}
