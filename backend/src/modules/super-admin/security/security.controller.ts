import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminSecurityService } from './security.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';
import { AdminUser } from '../decorators/admin-user.decorator';

@ApiTags('Super Admin - Security')
@Controller({ path: 'super-admin/security', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminSecurityController {
  constructor(private readonly service: AdminSecurityService) {}

  @Get('ip-whitelist') @AdminPermissions({ module: 'SECURITY', action: 'READ' }) async getIpWhitelist() { return this.service.getIpWhitelist(); }
  @Post('ip-whitelist') @AdminPermissions({ module: 'SECURITY', action: 'UPDATE' }) async addIpWhitelist(@Body() body: any, @AdminUser('id') userId: string) { return this.service.addIpWhitelist({ ...body, createdBy: userId }); }
  @Delete('ip-whitelist/:id') @AdminPermissions({ module: 'SECURITY', action: 'UPDATE' }) async removeIpWhitelist(@Param('id') id: string) { return this.service.removeIpWhitelist(id); }
  @Get('ip-blacklist') @AdminPermissions({ module: 'SECURITY', action: 'READ' }) async getIpBlacklist() { return this.service.getIpBlacklist(); }
  @Post('ip-blacklist') @AdminPermissions({ module: 'SECURITY', action: 'UPDATE' }) async addIpBlacklist(@Body() body: any, @AdminUser('id') userId: string) { return this.service.addIpBlacklist({ ...body, createdBy: userId }); }
  @Delete('ip-blacklist/:id') @AdminPermissions({ module: 'SECURITY', action: 'UPDATE' }) async removeIpBlacklist(@Param('id') id: string) { return this.service.removeIpBlacklist(id); }
  @Get('devices') @AdminPermissions({ module: 'SECURITY', action: 'READ' }) async getDevices() { return this.service.getDevices(); }
  @Post('devices/:id/revoke') @AdminPermissions({ module: 'SECURITY', action: 'UPDATE' }) async revokeDevice(@Param('id') id: string) { return this.service.revokeDevice(id); }
  @Get('sessions') @AdminPermissions({ module: 'SECURITY', action: 'READ' }) async getSessions() { return this.service.getSessions(); }
  @Post('sessions/:id/terminate') @AdminPermissions({ module: 'SECURITY', action: 'UPDATE' }) async terminateSession(@Param('id') id: string) { return this.service.terminateSession(id); }
}
