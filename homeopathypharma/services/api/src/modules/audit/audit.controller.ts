import { Controller, Get } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Permissions } from '../../common/decorators/permissions.decorator.js';
import { AuditService } from './audit.service.js';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Roles('admin')
  @Permissions('audit:read')
  @Get('events')
  listEvents() {
    return this.auditService.listEvents();
  }

  @Roles('admin')
  @Permissions('audit:read')
  @Get('events/:id')
  getEvent() {
    return this.auditService.getEvent();
  }

}
