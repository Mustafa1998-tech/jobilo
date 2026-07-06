import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminSubscriptionsService } from './subscriptions.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';

@ApiTags('Super Admin - Subscriptions')
@Controller({ path: 'super-admin/subscriptions', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminSubscriptionsController {
  constructor(private readonly service: AdminSubscriptionsService) {}

  @Get('plans')
  @AdminPermissions({ module: 'SUBSCRIPTIONS', action: 'READ' })
  async listPlans() { return this.service.listPlans(); }

  @Get('plans/:id')
  @AdminPermissions({ module: 'SUBSCRIPTIONS', action: 'READ' })
  async getPlan(@Param('id') id: string) { return this.service.getPlan(id); }

  @Post('plans')
  @AdminPermissions({ module: 'SUBSCRIPTIONS', action: 'CREATE' })
  async createPlan(@Body() data: any) { return this.service.createPlan(data); }

  @Patch('plans/:id')
  @AdminPermissions({ module: 'SUBSCRIPTIONS', action: 'UPDATE' })
  async updatePlan(@Param('id') id: string, @Body() data: any) { return this.service.updatePlan(id, data); }

  @Delete('plans/:id')
  @AdminPermissions({ module: 'SUBSCRIPTIONS', action: 'DELETE' })
  async deletePlan(@Param('id') id: string) { return this.service.deletePlan(id); }

  @Post('plans/:id/toggle')
  @AdminPermissions({ module: 'SUBSCRIPTIONS', action: 'UPDATE' })
  async togglePlan(@Param('id') id: string) { return this.service.togglePlan(id); }

  @Get()
  @AdminPermissions({ module: 'SUBSCRIPTIONS', action: 'READ' })
  async listSubscriptions(@Query('status') status?: string, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.service.listSubscriptions({ status, page, pageSize });
  }
}
