import { Controller, Get, Patch, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminProjectsService } from './projects.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';

@ApiTags('Super Admin - Projects')
@Controller({ path: 'super-admin/projects', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminProjectsController {
  constructor(private readonly projectsService: AdminProjectsService) {}

  @Get()
  @AdminPermissions({ module: 'PROJECTS', action: 'READ' })
  async listProjects(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('clientId') clientId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.projectsService.listProjects({ search, status, clientId, categoryId, page, pageSize });
  }

  @Get(':id')
  @AdminPermissions({ module: 'PROJECTS', action: 'READ' })
  async getProject(@Param('id') id: string) {
    return this.projectsService.getProject(id);
  }

  @Patch(':id')
  @AdminPermissions({ module: 'PROJECTS', action: 'UPDATE' })
  async updateProject(@Param('id') id: string, @Body() data: any) {
    return this.projectsService.updateProject(id, data);
  }

  @Delete(':id')
  @AdminPermissions({ module: 'PROJECTS', action: 'DELETE' })
  async deleteProject(@Param('id') id: string) {
    return this.projectsService.deleteProject(id);
  }

  @Patch(':id/status')
  @AdminPermissions({ module: 'PROJECTS', action: 'UPDATE' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.projectsService.updateStatus(id, status);
  }

  @Post(':id/feature')
  @AdminPermissions({ module: 'PROJECTS', action: 'UPDATE' })
  async toggleFeatured(@Param('id') id: string) {
    return this.projectsService.toggleFeatured(id);
  }
}
