import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminLogsService } from './logs.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';

@ApiTags('Super Admin - Logs')
@Controller({ path: 'super-admin/logs', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminLogsController {
  constructor(private readonly service: AdminLogsService) {}

  @Get('audit') @AdminPermissions({ module: 'AUDIT_LOGS', action: 'READ' })
  async getAuditLogs(@Query('userId') userId?: string, @Query('action') action?: string, @Query('module') module?: string, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.service.getAuditLogs({ userId, action, module, page, pageSize });
  }

  @Get('login') @AdminPermissions({ module: 'AUDIT_LOGS', action: 'READ' })
  async getLoginLogs(@Query('userId') userId?: string, @Query('success') success?: string, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.service.getLoginLogs({ userId, success, page, pageSize });
  }

  @Get('errors') @AdminPermissions({ module: 'AUDIT_LOGS', action: 'READ' })
  async getErrorLogs(@Query('level') level?: string, @Query('resolved') resolved?: string, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.service.getErrorLogs({ level, resolved, page, pageSize });
  }

  @Get('security') @AdminPermissions({ module: 'AUDIT_LOGS', action: 'READ' })
  async getSecurityLogs(@Query('type') type?: string, @Query('severity') severity?: string, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.service.getSecurityLogs({ type, severity, page, pageSize });
  }
}
