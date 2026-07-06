import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminUser } from '../decorators/admin-user.decorator';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';

@ApiTags('Super Admin - Auth')
@Controller({ path: 'super-admin/auth', version: '1' })
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  async login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }

  @Post('logout')
  @UseGuards(AdminJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@AdminUser('id') userId: string) {
    await this.authService.logout(userId);
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') token: string) {
    return this.authService.refreshToken(token);
  }

  @Get('sessions')
  @UseGuards(AdminJwtAuthGuard)
  async getSessions(@AdminUser('id') userId: string) {
    return this.authService.getSessions(userId);
  }

  @Delete('sessions/:id')
  @UseGuards(AdminJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateSession(@AdminUser('id') userId: string, @Param('id') sessionId: string) {
    await this.authService.terminateSession(userId, sessionId);
  }

  @Get('login-history')
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermissions({ module: 'SECURITY', action: 'READ' })
  async getLoginHistory(
    @AdminUser('id') userId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.authService.getLoginHistory(userId, page, pageSize);
  }
}
