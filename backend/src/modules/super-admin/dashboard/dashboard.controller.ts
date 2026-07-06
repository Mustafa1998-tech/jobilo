import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminDashboardService } from './dashboard.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';

@ApiTags('Super Admin - Dashboard')
@Controller({ path: 'super-admin/dashboard', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminDashboardController {
  constructor(private readonly dashboardService: AdminDashboardService) {}

  @Get('stats')
  @AdminPermissions({ module: 'DASHBOARD', action: 'READ' })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('revenue')
  @AdminPermissions({ module: 'DASHBOARD', action: 'READ' })
  async getRevenue() {
    return this.dashboardService.getRevenue();
  }

  @Get('recent-registrations')
  @AdminPermissions({ module: 'DASHBOARD', action: 'READ' })
  async getRecentRegistrations(@Query('limit') limit?: number) {
    return this.dashboardService.getRecentRegistrations(limit || 10);
  }

  @Get('recent-activity')
  @AdminPermissions({ module: 'DASHBOARD', action: 'READ' })
  async getRecentActivity(@Query('limit') limit?: number) {
    return this.dashboardService.getRecentActivity(limit || 10);
  }
}
