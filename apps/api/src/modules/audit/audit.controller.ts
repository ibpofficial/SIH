import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Roles } from '../auth/roles.decorator';

@Controller('audit-logs')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  @Roles('ADMIN')
  async findAll(
    @Query('entityType') entityType?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string
  ) {
    return this.auditService.findAll({
      entityType,
      userId,
      limit: limit ? parseInt(limit, 10) : 50
    });
  }
}
