import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAnalyticsService } from './analytics.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';

@ApiTags('Super Admin - Analytics')
@Controller({ path: 'super-admin/analytics', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminAnalyticsController {
  constructor(private readonly service: AdminAnalyticsService) {}

  @Get('overview') @AdminPermissions({ module: 'ANALYTICS', action: 'READ' }) async getOverview() { return this.service.getOverview(); }
  @Get('users') @AdminPermissions({ module: 'ANALYTICS', action: 'READ' }) async getUserAnalytics() { return this.service.getUserAnalytics(); }
  @Get('revenue') @AdminPermissions({ module: 'ANALYTICS', action: 'READ' }) async getRevenueAnalytics() { return this.service.getRevenueAnalytics(); }
  @Get('skills') @AdminPermissions({ module: 'ANALYTICS', action: 'READ' }) async getTopSkills(@Query('limit') limit?: number) { return this.service.getTopSkills(limit || 10); }
  @Get('top-freelancers') @AdminPermissions({ module: 'ANALYTICS', action: 'READ' }) async getTopFreelancers(@Query('limit') limit?: number) { return this.service.getTopFreelancers(limit || 10); }
  @Get('top-clients') @AdminPermissions({ module: 'ANALYTICS', action: 'READ' }) async getTopClients(@Query('limit') limit?: number) { return this.service.getTopClients(limit || 10); }
}
