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
exports.AdminDisputesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const disputes_service_1 = require("./disputes.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
const admin_user_decorator_1 = require("../decorators/admin-user.decorator");
let AdminDisputesController = class AdminDisputesController {
    constructor(disputesService) {
        this.disputesService = disputesService;
    }
    async listDisputes(status, page, pageSize) {
        return this.disputesService.listDisputes({ status, page, pageSize });
    }
    async getDispute(id) {
        return this.disputesService.getDispute(id);
    }
    async resolveDispute(id, body, adminId) {
        return this.disputesService.resolveDispute(id, { ...body, adminId });
    }
    async closeDispute(id, adminId) {
        return this.disputesService.closeDispute(id, adminId);
    }
};
exports.AdminDisputesController = AdminDisputesController;
__decorate([
    (0, common_1.Get)(),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'DISPUTES', action: 'READ' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminDisputesController.prototype, "listDisputes", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'DISPUTES', action: 'READ' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminDisputesController.prototype, "getDispute", null);
__decorate([
    (0, common_1.Post)(':id/resolve'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'DISPUTES', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], AdminDisputesController.prototype, "resolveDispute", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'DISPUTES', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminDisputesController.prototype, "closeDispute", null);
exports.AdminDisputesController = AdminDisputesController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Disputes'),
    (0, common_1.Controller)({ path: 'super-admin/disputes', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [disputes_service_1.AdminDisputesService])
], AdminDisputesController);
//# sourceMappingURL=disputes.controller.js.map