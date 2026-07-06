import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminReportsService } from './reports.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';
import { AdminUser } from '../decorators/admin-user.decorator';

@ApiTags('Super Admin - Reports')
@Controller({ path: 'super-admin/reports', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminReportsController {
  constructor(private readonly reportsService: AdminReportsService) {}

  @Get()
  @AdminPermissions({ module: 'REPORTS', action: 'READ' })
  async listReports(@Query('status') status?: string, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.reportsService.listReports({ status, page, pageSize });
  }

  @Post(':id/review')
  @AdminPermissions({ module: 'REPORTS', action: 'UPDATE' })
  async reviewReport(@Param('id') id: string, @Body() body: { action: string; note?: string }, @AdminUser('id') adminId: string) {
    return this.reportsService.reviewReport(id, { ...body, adminId });
  }
}
