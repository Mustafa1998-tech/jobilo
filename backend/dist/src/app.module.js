"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const app_config_1 = require("./config/app.config");
const prisma_service_1 = require("./common/prisma.service");
const auth_helpers_service_1 = require("./common/utils/auth-helpers.service");
const jwt_strategy_1 = require("./common/guards/jwt.strategy");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const projects_module_1 = require("./modules/projects/projects.module");
const proposals_module_1 = require("./modules/proposals/proposals.module");
const contracts_module_1 = require("./modules/contracts/contracts.module");
const messages_module_1 = require("./modules/messages/messages.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const admin_module_1 = require("./modules/admin/admin.module");
const ai_module_1 = require("./modules/ai/ai.module");
const categories_module_1 = require("./modules/categories/categories.module");
const files_module_1 = require("./modules/files/files.module");
const super_admin_module_1 = require("./modules/super-admin/super-admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default],
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('jwt.accessSecret'),
                    signOptions: { expiresIn: config.get('jwt.accessExpiry') },
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            projects_module_1.ProjectsModule,
            proposals_module_1.ProposalsModule,
            contracts_module_1.ContractsModule,
            messages_module_1.MessagesModule,
            reviews_module_1.ReviewsModule,
            notifications_module_1.NotificationsModule,
            admin_module_1.AdminModule,
            ai_module_1.AiModule,
            categories_module_1.CategoriesModule,
            files_module_1.FilesModule,
            super_admin_module_1.SuperAdminModule,
        ],
        providers: [
            prisma_service_1.PrismaService,
            auth_helpers_service_1.AuthHelpersService,
            jwt_strategy_1.JwtStrategy,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
        exports: [prisma_service_1.PrismaService, auth_helpers_service_1.AuthHelpersService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map