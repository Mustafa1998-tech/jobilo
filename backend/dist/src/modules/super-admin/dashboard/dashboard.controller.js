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
exports.AdminDashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
let AdminDashboardController = class AdminDashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getStats() {
        return this.dashboardService.getStats();
    }
    async getRevenue() {
        return this.dashboardService.getRevenue();
    }
    async getRecentRegistrations(limit) {
        return this.dashboardService.getRecentRegistrations(limit || 10);
    }
    async getRecentActivity(limit) {
        return this.dashboardService.getRecentActivity(limit || 10);
    }
};
exports.AdminDashboardController = AdminDashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'DASHBOARD', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'DASHBOARD', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('recent-registrations'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'DASHBOARD', action: 'READ' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getRecentRegistrations", null);
__decorate([
    (0, common_1.Get)('recent-activity'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'DASHBOARD', action: 'READ' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getRecentActivity", null);
exports.AdminDashboardController = AdminDashboardController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Dashboard'),
    (0, common_1.Controller)({ path: 'super-admin/dashboard', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [dashboard_service_1.AdminDashboardService])
], AdminDashboardController);
//# sourceMappingURL=dashboard.controller.js.map