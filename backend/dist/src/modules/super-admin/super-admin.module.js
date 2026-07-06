"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const prisma_service_1 = require("../../common/prisma.service");
const auth_helpers_service_1 = require("../../common/utils/auth-helpers.service");
const super_admin_controller_1 = require("./super-admin.controller");
const super_admin_service_1 = require("./super-admin.service");
const admin_jwt_strategy_1 = require("./guards/admin-jwt.strategy");
const admin_auth_controller_1 = require("./auth/admin-auth.controller");
const admin_auth_service_1 = require("./auth/admin-auth.service");
const dashboard_controller_1 = require("./dashboard/dashboard.controller");
const dashboard_service_1 = require("./dashboard/dashboard.service");
const users_controller_1 = require("./users/users.controller");
const users_service_1 = require("./users/users.service");
const projects_controller_1 = require("./projects/projects.controller");
const projects_service_1 = require("./projects/projects.service");
const proposals_controller_1 = require("./proposals/proposals.controller");
const proposals_service_1 = require("./proposals/proposals.service");
const disputes_controller_1 = require("./disputes/disputes.controller");
const disputes_service_1 = require("./disputes/disputes.service");
const reports_controller_1 = require("./reports/reports.controller");
const reports_service_1 = require("./reports/reports.service");
const subscriptions_controller_1 = require("./subscriptions/subscriptions.controller");
const subscriptions_service_1 = require("./subscriptions/subscriptions.service");
const content_controller_1 = require("./content/content.controller");
const content_service_1 = require("./content/content.service");
const settings_controller_1 = require("./settings/settings.controller");
const settings_service_1 = require("./settings/settings.service");
const roles_controller_1 = require("./roles/roles.controller");
const roles_service_1 = require("./roles/roles.service");
const logs_controller_1 = require("./logs/logs.controller");
const logs_service_1 = require("./logs/logs.service");
const analytics_controller_1 = require("./analytics/analytics.controller");
const analytics_service_1 = require("./analytics/analytics.service");
const security_controller_1 = require("./security/security.controller");
const security_service_1 = require("./security/security.service");
let SuperAdminModule = class SuperAdminModule {
};
exports.SuperAdminModule = SuperAdminModule;
exports.SuperAdminModule = SuperAdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'admin-jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('jwt.accessSecret'),
                    signOptions: { expiresIn: config.get('jwt.accessExpiry') },
                }),
            }),
        ],
        controllers: [
            super_admin_controller_1.SuperAdminController,
            admin_auth_controller_1.AdminAuthController,
            dashboard_controller_1.AdminDashboardController,
            users_controller_1.AdminUsersController,
            projects_controller_1.AdminProjectsController,
            proposals_controller_1.AdminProposalsController,
            disputes_controller_1.AdminDisputesController,
            reports_controller_1.AdminReportsController,
            subscriptions_controller_1.AdminSubscriptionsController,
            content_controller_1.AdminContentController,
            settings_controller_1.AdminSettingsController,
            roles_controller_1.AdminRolesController,
            logs_controller_1.AdminLogsController,
            analytics_controller_1.AdminAnalyticsController,
            security_controller_1.AdminSecurityController,
        ],
        providers: [
            super_admin_service_1.SuperAdminService,
            prisma_service_1.PrismaService,
            auth_helpers_service_1.AuthHelpersService,
            admin_jwt_strategy_1.AdminJwtStrategy,
            admin_auth_service_1.AdminAuthService,
            dashboard_service_1.AdminDashboardService,
            users_service_1.AdminUsersService,
            projects_service_1.AdminProjectsService,
            proposals_service_1.AdminProposalsService,
            disputes_service_1.AdminDisputesService,
            reports_service_1.AdminReportsService,
            subscriptions_service_1.AdminSubscriptionsService,
            content_service_1.AdminContentService,
            settings_service_1.AdminSettingsService,
            roles_service_1.AdminRolesService,
            logs_service_1.AdminLogsService,
            analytics_service_1.AdminAnalyticsService,
            security_service_1.AdminSecurityService,
        ],
    })
], SuperAdminModule);
//# sourceMappingURL=super-admin.module.js.map