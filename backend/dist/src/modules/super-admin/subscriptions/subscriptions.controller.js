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
exports.AdminSubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subscriptions_service_1 = require("./subscriptions.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
let AdminSubscriptionsController = class AdminSubscriptionsController {
    constructor(service) {
        this.service = service;
    }
    async listPlans() { return this.service.listPlans(); }
    async getPlan(id) { return this.service.getPlan(id); }
    async createPlan(data) { return this.service.createPlan(data); }
    async updatePlan(id, data) { return this.service.updatePlan(id, data); }
    async deletePlan(id) { return this.service.deletePlan(id); }
    async togglePlan(id) { return this.service.togglePlan(id); }
    async listSubscriptions(status, page, pageSize) {
        return this.service.listSubscriptions({ status, page, pageSize });
    }
};
exports.AdminSubscriptionsController = AdminSubscriptionsController;
__decorate([
    (0, common_1.Get)('plans'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SUBSCRIPTIONS', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSubscriptionsController.prototype, "listPlans", null);
__decorate([
    (0, common_1.Get)('plans/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SUBSCRIPTIONS', action: 'READ' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSubscriptionsController.prototype, "getPlan", null);
__decorate([
    (0, common_1.Post)('plans'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SUBSCRIPTIONS', action: 'CREATE' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminSubscriptionsController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Patch)('plans/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SUBSCRIPTIONS', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminSubscriptionsController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Delete)('plans/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SUBSCRIPTIONS', action: 'DELETE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSubscriptionsController.prototype, "deletePlan", null);
__decorate([
    (0, common_1.Post)('plans/:id/toggle'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SUBSCRIPTIONS', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSubscriptionsController.prototype, "togglePlan", null);
__decorate([
    (0, common_1.Get)(),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'SUBSCRIPTIONS', action: 'READ' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminSubscriptionsController.prototype, "listSubscriptions", null);
exports.AdminSubscriptionsController = AdminSubscriptionsController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Subscriptions'),
    (0, common_1.Controller)({ path: 'super-admin/subscriptions', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [subscriptions_service_1.AdminSubscriptionsService])
], AdminSubscriptionsController);
//# sourceMappingURL=subscriptions.controller.js.map