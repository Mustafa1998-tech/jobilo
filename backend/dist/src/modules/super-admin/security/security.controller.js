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
exports.AdminSecurityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const security_service_1 = require("./security.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
const admin_user_decorator_1 = require("../decorators/admin-user.decorator");
let AdminSecurityController = class AdminSecurityController {
    constructor(service) {
        this.service = service;
    }
    async getIpWhitelist() { return this.service.getIpWhitelist(); }
    async addIpWhitelist(body, userId) { return this.service.addIpWhitelist({ ...body, createdBy: userId }); }
    async removeIpWhitelist(id) { return this.service.removeIpWhitelist(id); }
    async getIpBlacklist() { return this.service.getIpBlacklist(); }
    async addIpBlacklist(body, userId) { return this.service.addIpBlacklist({ ...body, createdBy: userId }); }
    async removeIpBlacklist(id) { return this.service.removeIpBlacklist(id); }
    async getDevices() { return this.service.getDevices(); }
    async revokeDevice(id) { return this.service.revokeDevice(id); }
    async getSessions() { return this.service.getSessions(); }
    async terminateSession(id) { return this.service.terminateSession(id); }
};
exports.AdminSecurityController = AdminSecurityController;
__decorate([
    (0, common_1.Get)('ip-whitelist'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SECURITY', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSecurityController.prototype, "getIpWhitelist", null);
__decorate([
    (0, common_1.Post)('ip-whitelist'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SECURITY', action: 'UPDATE' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminSecurityController.prototype, "addIpWhitelist", null);
__decorate([
    (0, common_1.Delete)('ip-whitelist/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SECURITY', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSecurityController.prototype, "removeIpWhitelist", null);
__decorate([
    (0, common_1.Get)('ip-blacklist'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SECURITY', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSecurityController.prototype, "getIpBlacklist", null);
__decorate([
    (0, common_1.Post)('ip-blacklist'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SECURITY', action: 'UPDATE' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminSecurityController.prototype, "addIpBlacklist", null);
__decorate([
    (0, common_1.Delete)('ip-blacklist/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SECURITY', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSecurityController.prototype, "removeIpBlacklist", null);
__decorate([
    (0, common_1.Get)('devices'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SECURITY', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSecurityController.prototype, "getDevices", null);
__decorate([
    (0, common_1.Post)('devices/:id/revoke'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SECURITY', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSecurityController.prototype, "revokeDevice", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SECURITY', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSecurityController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Post)('sessions/:id/terminate'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SECURITY', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSecurityController.prototype, "terminateSession", null);
exports.AdminSecurityController = AdminSecurityController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Security'),
    (0, common_1.Controller)({ path: 'super-admin/security', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [security_service_1.AdminSecurityService])
], AdminSecurityController);
//# sourceMappingURL=security.controller.js.map