import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminUsersService } from './users.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';
import { AdminUser } from '../decorators/admin-user.decorator';

@ApiTags('Super Admin - Users')
@Controller({ path: 'super-admin/users', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminUsersController {
  constructor(private readonly usersService: AdminUsersService) {}

  @Get()
  @AdminPermissions({ module: 'USERS', action: 'READ' })
  async listUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('verified') verified?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.usersService.listUsers({ search, role, status, verified, dateFrom, dateTo, sortBy, sortOrder, page, pageSize });
  }

  @Get(':id')
  @AdminPermissions({ module: 'USERS', action: 'READ' })
  async getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Patch(':id')
  @AdminPermissions({ module: 'USERS', action: 'UPDATE' })
  async updateUser(@Param('id') id: string, @Body() data: any) {
    return this.usersService.updateUser(id, data);
  }

  @Patch(':id/status')
  @AdminPermissions({ module: 'USERS', action: 'UPDATE' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.usersService.updateStatus(id, status);
  }

  @Post(':id/ban')
  @AdminPermissions({ module: 'USERS', action: 'BLOCK' })
  async banUser(@Param('id') id: string, @Body('reason') reason?: string, @Body('durationMinutes') durationMinutes?: number) {
    return this.usersService.banUser(id, reason, durationMinutes);
  }

  @Post(':id/unban')
  @AdminPermissions({ module: 'USERS', action: 'UNBLOCK' })
  async unbanUser(@Param('id') id: string) {
    return this.usersService.unbanUser(id);
  }

  @Delete(':id')
  @AdminPermissions({ module: 'USERS', action: 'DELETE' })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post(':id/reset-password')
  @AdminPermissions({ module: 'USERS', action: 'UPDATE' })
  async resetPassword(@Param('id') id: string, @Body('newPassword') newPassword: string) {
    return this.usersService.resetPassword(id, newPassword);
  }

  @Patch(':id/role')
  @AdminPermissions({ module: 'USERS', action: 'UPDATE' })
  async changeRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.changeRole(id, role);
  }

  @Get(':id/activity')
  @AdminPermissions({ module: 'USERS', action: 'READ' })
  async getUserActivity(@Param('id') id: string, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.usersService.getUserActivity(id, page, pageSize);
  }
}
