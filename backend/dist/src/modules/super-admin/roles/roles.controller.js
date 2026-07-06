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
exports.AdminRolesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_service_1 = require("./roles.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
let AdminRolesController = class AdminRolesController {
    constructor(service) {
        this.service = service;
    }
    async listRoles() { return this.service.listRoles(); }
    async getRole(id) { return this.service.getRole(id); }
    async createRole(data) { return this.service.createRole(data); }
    async updateRole(id, data) { return this.service.updateRole(id, data); }
    async deleteRole(id) { return this.service.deleteRole(id); }
    async updatePermissions(id, permissionIds) {
        return this.service.updatePermissions(id, permissionIds);
    }
    async listPermissions() { return this.service.listPermissions(); }
};
exports.AdminRolesController = AdminRolesController;
__decorate([
    (0, common_1.Get)(),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ROLES', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminRolesController.prototype, "listRoles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ROLES', action: 'READ' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminRolesController.prototype, "getRole", null);
__decorate([
    (0, common_1.Post)(),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ROLES', action: 'CREATE' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminRolesController.prototype, "createRole", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ROLES', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminRolesController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ROLES', action: 'DELETE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminRolesController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Put)(':id/permissions'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ROLES', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('permissionIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AdminRolesController.prototype, "updatePermissions", null);
__decorate([
    (0, common_1.Get)('permissions/list'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ROLES', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminRolesController.prototype, "listPermissions", null);
exports.AdminRolesController = AdminRolesController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Roles'),
    (0, common_1.Controller)({ path: 'super-admin/roles', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [roles_service_1.AdminRolesService])
], AdminRolesController);
//# sourceMappingURL=roles.controller.js.map