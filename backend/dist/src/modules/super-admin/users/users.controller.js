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
exports.AdminUsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
let AdminUsersController = class AdminUsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async listUsers(search, role, status, verified, dateFrom, dateTo, sortBy, sortOrder, page, pageSize) {
        return this.usersService.listUsers({ search, role, status, verified, dateFrom, dateTo, sortBy, sortOrder, page, pageSize });
    }
    async getUser(id) {
        return this.usersService.getUser(id);
    }
    async updateUser(id, data) {
        return this.usersService.updateUser(id, data);
    }
    async updateStatus(id, status) {
        return this.usersService.updateStatus(id, status);
    }
    async banUser(id, reason, durationMinutes) {
        return this.usersService.banUser(id, reason, durationMinutes);
    }
    async unbanUser(id) {
        return this.usersService.unbanUser(id);
    }
    async deleteUser(id) {
        return this.usersService.deleteUser(id);
    }
    async resetPassword(id, newPassword) {
        return this.usersService.resetPassword(id, newPassword);
    }
    async changeRole(id, role) {
        return this.usersService.changeRole(id, role);
    }
    async getUserActivity(id, page, pageSize) {
        return this.usersService.getUserActivity(id, page, pageSize);
    }
};
exports.AdminUsersController = AdminUsersController;
__decorate([
    (0, common_1.Get)(),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'USERS', action: 'READ' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('role')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('verified')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __param(6, (0, common_1.Query)('sortBy')),
    __param(7, (0, common_1.Query)('sortOrder')),
    __param(8, (0, common_1.Query)('page')),
    __param(9, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'USERS', action: 'READ' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "getUser", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'USERS', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'USERS', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/ban'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'USERS', action: 'BLOCK' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Body)('durationMinutes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "banUser", null);
__decorate([
    (0, common_1.Post)(':id/unban'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'USERS', action: 'UNBLOCK' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "unbanUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'USERS', action: 'DELETE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)(':id/reset-password'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'USERS', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Patch)(':id/role'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'USERS', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "changeRole", null);
__decorate([
    (0, common_1.Get)(':id/activity'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'USERS', action: 'READ' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "getUserActivity", null);
exports.AdminUsersController = AdminUsersController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Users'),
    (0, common_1.Controller)({ path: 'super-admin/users', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.AdminUsersService])
], AdminUsersController);
//# sourceMappingURL=users.controller.js.map