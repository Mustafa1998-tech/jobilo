import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminDisputesService } from './disputes.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';
import { AdminUser } from '../decorators/admin-user.decorator';

@ApiTags('Super Admin - Disputes')
@Controller({ path: 'super-admin/disputes', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminDisputesController {
  constructor(private readonly disputesService: AdminDisputesService) {}

  @Get()
  @AdminPermissions({ module: 'DISPUTES', action: 'READ' })
  async listDisputes(@Query('status') status?: string, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.disputesService.listDisputes({ status, page, pageSize });
  }

  @Get(':id')
  @AdminPermissions({ module: 'DISPUTES', action: 'READ' })
  async getDispute(@Param('id') id: string) {
    return this.disputesService.getDispute(id);
  }

  @Post(':id/resolve')
  @AdminPermissions({ module: 'DISPUTES', action: 'UPDATE' })
  async resolveDispute(@Param('id') id: string, @Body() body: { decision: string; notes?: string; refundAmount?: number }, @AdminUser('id') adminId: string) {
    return this.disputesService.resolveDispute(id, { ...body, adminId });
  }

  @Post(':id/close')
  @AdminPermissions({ module: 'DISPUTES', action: 'UPDATE' })
  async closeDispute(@Param('id') id: string, @AdminUser('id') adminId: string) {
    return this.disputesService.closeDispute(id, adminId);
  }
}
