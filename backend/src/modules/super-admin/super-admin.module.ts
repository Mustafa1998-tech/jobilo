import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../common/prisma.service';
import { AuthHelpersService } from '../../common/utils/auth-helpers.service';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { AdminJwtStrategy } from './guards/admin-jwt.strategy';
import { AdminAuthController } from './auth/admin-auth.controller';
import { AdminAuthService } from './auth/admin-auth.service';
import { AdminDashboardController } from './dashboard/dashboard.controller';
import { AdminDashboardService } from './dashboard/dashboard.service';
import { AdminUsersController } from './users/users.controller';
import { AdminUsersService } from './users/users.service';
import { AdminProjectsController } from './projects/projects.controller';
import { AdminProjectsService } from './projects/projects.service';
import { AdminProposalsController } from './proposals/proposals.controller';
import { AdminProposalsService } from './proposals/proposals.service';
import { AdminDisputesController } from './disputes/disputes.controller';
import { AdminDisputesService } from './disputes/disputes.service';
import { AdminReportsController } from './reports/reports.controller';
import { AdminReportsService } from './reports/reports.service';
import { AdminSubscriptionsController } from './subscriptions/subscriptions.controller';
import { AdminSubscriptionsService } from './subscriptions/subscriptions.service';
import { AdminContentController } from './content/content.controller';
import { AdminContentService } from './content/content.service';
import { AdminSettingsController } from './settings/settings.controller';
import { AdminSettingsService } from './settings/settings.service';
import { AdminRolesController } from './roles/roles.controller';
import { AdminRolesService } from './roles/roles.service';
import { AdminLogsController } from './logs/logs.controller';
import { AdminLogsService } from './logs/logs.service';
import { AdminAnalyticsController } from './analytics/analytics.controller';
import { AdminAnalyticsService } from './analytics/analytics.service';
import { AdminSecurityController } from './security/security.controller';
import { AdminSecurityService } from './security/security.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'admin-jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessSecret'),
        signOptions: { expiresIn: config.get<string>('jwt.accessExpiry') as any },
      }),
    }),
  ],
  controllers: [
    SuperAdminController,
    AdminAuthController,
    AdminDashboardController,
    AdminUsersController,
    AdminProjectsController,
    AdminProposalsController,
    AdminDisputesController,
    AdminReportsController,
    AdminSubscriptionsController,
    AdminContentController,
    AdminSettingsController,
    AdminRolesController,
    AdminLogsController,
    AdminAnalyticsController,
    AdminSecurityController,
  ],
  providers: [
    SuperAdminService,
    PrismaService,
    AuthHelpersService,
    AdminJwtStrategy,
    AdminAuthService,
    AdminDashboardService,
    AdminUsersService,
    AdminProjectsService,
    AdminProposalsService,
    AdminDisputesService,
    AdminReportsService,
    AdminSubscriptionsService,
    AdminContentService,
    AdminSettingsService,
    AdminRolesService,
    AdminLogsService,
    AdminAnalyticsService,
    AdminSecurityService,
  ],
})
export class SuperAdminModule {}
