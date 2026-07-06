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
exports.AdminSettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settings_service_1 = require("./settings.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
const admin_user_decorator_1 = require("../decorators/admin-user.decorator");
let AdminSettingsController = class AdminSettingsController {
    constructor(service) {
        this.service = service;
    }
    async getPlatform() { return this.service.getPlatform(); }
    async updatePlatform(body, userId) { return this.service.updatePlatform(body, userId); }
    async getEmail() { return this.service.getEmail(); }
    async updateEmail(body, userId) { return this.service.updateEmail(body, userId); }
    async getStorage() { return this.service.getStorage(); }
    async updateStorage(body, userId) { return this.service.updateStorage(body, userId); }
    async getAi() { return this.service.getAi(); }
    async updateAi(body, userId) { return this.service.updateAi(body, userId); }
    async getNotifications() { return this.service.getNotifications(); }
    async updateNotifications(body, userId) { return this.service.updateNotifications(body, userId); }
    async getSeo() { return this.service.getSeo(); }
    async updateSeo(body, userId) { return this.service.updateSeo(body, userId); }
    async getSecurity() { return this.service.getSecurity(); }
    async updateSecurity(body, userId) { return this.service.updateSecurity(body, userId); }
};
exports.AdminSettingsController = AdminSettingsController;
__decorate([
    (0, common_1.Get)('platform'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "getPlatform", null);
__decorate([
    (0, common_1.Put)('platform'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'UPDATE' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "updatePlatform", null);
__decorate([
    (0, common_1.Get)('email'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "getEmail", null);
__decorate([
    (0, common_1.Put)('email'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'UPDATE' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "updateEmail", null);
__decorate([
    (0, common_1.Get)('storage'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "getStorage", null);
__decorate([
    (0, common_1.Put)('storage'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'UPDATE' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "updateStorage", null);
__decorate([
    (0, common_1.Get)('ai'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "getAi", null);
__decorate([
    (0, common_1.Put)('ai'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'UPDATE' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "updateAi", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Put)('notifications'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'UPDATE' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "updateNotifications", null);
__decorate([
    (0, common_1.Get)('seo'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "getSeo", null);
__decorate([
    (0, common_1.Put)('seo'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'UPDATE' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "updateSeo", null);
__decorate([
    (0, common_1.Get)('security'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "getSecurity", null);
__decorate([
    (0, common_1.Put)('security'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SETTINGS', action: 'UPDATE' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "updateSecurity", null);
exports.AdminSettingsController = AdminSettingsController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Settings'),
    (0, common_1.Controller)({ path: 'super-admin/settings', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [settings_service_1.AdminSettingsService])
], AdminSettingsController);
//# sourceMappingURL=settings.controller.js.map