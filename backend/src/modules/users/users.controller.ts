import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Body() body: any,
  ) {
    return this.usersService.updateProfile(userId, role, body);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own account' })
  async deleteAccount(@CurrentUser('id') userId: string) {
    return this.usersService.deleteAccount(userId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get public user profile' })
  async getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Get(':id/portfolio')
  @Public()
  @ApiOperation({ summary: 'Get user portfolio' })
  async getUserPortfolio(@Param('id') id: string) {
    return this.usersService.getUserPortfolio(id);
  }

  @Get(':id/reviews')
  @Public()
  @ApiOperation({ summary: 'Get user reviews' })
  async getUserReviews(@Param('id') id: string) {
    return this.usersService.getUserReviews(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users (Admin)' })
  async listUsers(@Query() query: any) {
    return this.usersService.listUsers(query);
  }

  @Patch(':id/role')
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user role (Super Admin)' })
  async changeRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.changeRole(id, role);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user status (Admin)' })
  async changeStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.usersService.changeStatus(id, status);
  }

  @Post(':id/verify')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify user (Admin)' })
  async verifyUser(@Param('id') id: string) {
    return this.usersService.verifyUser(id);
  }
}
