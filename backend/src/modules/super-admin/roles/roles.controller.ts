import { Controller, Get, Post, Patch, Delete, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminRolesService } from './roles.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';

@ApiTags('Super Admin - Roles')
@Controller({ path: 'super-admin/roles', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminRolesController {
  constructor(private readonly service: AdminRolesService) {}

  @Get()
  @AdminPermissions({ module: 'ROLES', action: 'READ' })
  async listRoles() { return this.service.listRoles(); }

  @Get(':id')
  @AdminPermissions({ module: 'ROLES', action: 'READ' })
  async getRole(@Param('id') id: string) { return this.service.getRole(id); }

  @Post()
  @AdminPermissions({ module: 'ROLES', action: 'CREATE' })
  async createRole(@Body() data: any) { return this.service.createRole(data); }

  @Patch(':id')
  @AdminPermissions({ module: 'ROLES', action: 'UPDATE' })
  async updateRole(@Param('id') id: string, @Body() data: any) { return this.service.updateRole(id, data); }

  @Delete(':id')
  @AdminPermissions({ module: 'ROLES', action: 'DELETE' })
  async deleteRole(@Param('id') id: string) { return this.service.deleteRole(id); }

  @Put(':id/permissions')
  @AdminPermissions({ module: 'ROLES', action: 'UPDATE' })
  async updatePermissions(@Param('id') id: string, @Body('permissionIds') permissionIds: string[]) {
    return this.service.updatePermissions(id, permissionIds);
  }

  @Get('permissions/list')
  @AdminPermissions({ module: 'ROLES', action: 'READ' })
  async listPermissions() { return this.service.listPermissions(); }
}
