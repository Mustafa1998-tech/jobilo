"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_auth_service_1 = require("./admin-auth.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_user_decorator_1 = require("../decorators/admin-user.decorator");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
let AdminAuthController = class AdminAuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(email, password) {
        return this.authService.login(email, password);
    }
    async logout(userId) {
        await this.authService.logout(userId);
    }
    async refreshToken(token) {
        return this.authService.refreshToken(token);
    }
    async getSessions(userId) {
        return this.authService.getSessions(userId);
    }
    async terminateSession(userId, sessionId) {
        await this.authService.terminateSession(userId, sessionId);
    }
    async getLoginHistory(userId, page, pageSize) {
        return this.authService.getLoginHistory(userId, page, pageSize);
    }
};
exports.AdminAuthController = AdminAuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin login' }),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __param(0, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Delete)('sessions/:id'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, admin_user_decorator_1.AdminUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "terminateSession", null);
__decorate([
    (0, common_1.Get)('login-history'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SECURITY', action: 'READ' }),
    __param(0, (0, admin_user_decorator_1.AdminUser)('id')),
    __param(1, (0, common_1.Body)('page')),
    __param(2, (0, common_1.Body)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "getLoginHistory", null);
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Auth'),
    (0, common_1.Controller)({ path: 'super-admin/auth', version: '1' }),
    __metadata("design:paramtypes", [admin_auth_service_1.AdminAuthService])
], AdminAuthController);
//# sourceMappingURL=admin-auth.controller.js.map