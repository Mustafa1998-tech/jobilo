import { Controller, Get, Delete, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminProposalsService } from './proposals.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';

@ApiTags('Super Admin - Proposals')
@Controller({ path: 'super-admin/proposals', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminProposalsController {
  constructor(private readonly proposalsService: AdminProposalsService) {}

  @Get()
  @AdminPermissions({ module: 'PROPOSALS', action: 'READ' })
  async listProposals(
    @Query('status') status?: string,
    @Query('projectId') projectId?: string,
    @Query('freelancerId') freelancerId?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.proposalsService.listProposals({ status, projectId, freelancerId, page, pageSize });
  }

  @Get(':id')
  @AdminPermissions({ module: 'PROPOSALS', action: 'READ' })
  async getProposal(@Param('id') id: string) {
    return this.proposalsService.getProposal(id);
  }

  @Delete(':id')
  @AdminPermissions({ module: 'PROPOSALS', action: 'DELETE' })
  async deleteProposal(@Param('id') id: string) {
    return this.proposalsService.deleteProposal(id);
  }

  @Patch(':id/status')
  @AdminPermissions({ module: 'PROPOSALS', action: 'UPDATE' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.proposalsService.updateStatus(id, status);
  }
}
