import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminSettingsService } from './settings.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';
import { AdminUser } from '../decorators/admin-user.decorator';

@ApiTags('Super Admin - Settings')
@Controller({ path: 'super-admin/settings', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminSettingsController {
  constructor(private readonly service: AdminSettingsService) {}

  @Get('platform') @AdminPermissions({ module: 'SETTINGS', action: 'READ' }) async getPlatform() { return this.service.getPlatform(); }
  @Put('platform') @AdminPermissions({ module: 'SETTINGS', action: 'UPDATE' }) async updatePlatform(@Body() body: any, @AdminUser('id') userId: string) { return this.service.updatePlatform(body, userId); }
  @Get('email') @AdminPermissions({ module: 'SETTINGS', action: 'READ' }) async getEmail() { return this.service.getEmail(); }
  @Put('email') @AdminPermissions({ module: 'SETTINGS', action: 'UPDATE' }) async updateEmail(@Body() body: any, @AdminUser('id') userId: string) { return this.service.updateEmail(body, userId); }
  @Get('storage') @AdminPermissions({ module: 'SETTINGS', action: 'READ' }) async getStorage() { return this.service.getStorage(); }
  @Put('storage') @AdminPermissions({ module: 'SETTINGS', action: 'UPDATE' }) async updateStorage(@Body() body: any, @AdminUser('id') userId: string) { return this.service.updateStorage(body, userId); }
  @Get('ai') @AdminPermissions({ module: 'SETTINGS', action: 'READ' }) async getAi() { return this.service.getAi(); }
  @Put('ai') @AdminPermissions({ module: 'SETTINGS', action: 'UPDATE' }) async updateAi(@Body() body: any, @AdminUser('id') userId: string) { return this.service.updateAi(body, userId); }
  @Get('notifications') @AdminPermissions({ module: 'SETTINGS', action: 'READ' }) async getNotifications() { return this.service.getNotifications(); }
  @Put('notifications') @AdminPermissions({ module: 'SETTINGS', action: 'UPDATE' }) async updateNotifications(@Body() body: any, @AdminUser('id') userId: string) { return this.service.updateNotifications(body, userId); }
  @Get('seo') @AdminPermissions({ module: 'SETTINGS', action: 'READ' }) async getSeo() { return this.service.getSeo(); }
  @Put('seo') @AdminPermissions({ module: 'SETTINGS', action: 'UPDATE' }) async updateSeo(@Body() body: any, @AdminUser('id') userId: string) { return this.service.updateSeo(body, userId); }
  @Get('security') @AdminPermissions({ module: 'SETTINGS', action: 'READ' }) async getSecurity() { return this.service.getSecurity(); }
  @Put('security') @AdminPermissions({ module: 'SETTINGS', action: 'UPDATE' }) async updateSecurity(@Body() body: any, @AdminUser('id') userId: string) { return this.service.updateSecurity(body, userId); }
}
