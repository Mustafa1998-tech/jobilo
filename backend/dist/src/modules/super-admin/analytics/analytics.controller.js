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
exports.AdminAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
let AdminAnalyticsController = class AdminAnalyticsController {
    constructor(service) {
        this.service = service;
    }
    async getOverview() { return this.service.getOverview(); }
    async getUserAnalytics() { return this.service.getUserAnalytics(); }
    async getRevenueAnalytics() { return this.service.getRevenueAnalytics(); }
    async getTopSkills(limit) { return this.service.getTopSkills(limit || 10); }
    async getTopFreelancers(limit) { return this.service.getTopFreelancers(limit || 10); }
    async getTopClients(limit) { return this.service.getTopClients(limit || 10); }
};
exports.AdminAnalyticsController = AdminAnalyticsController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ANALYTICS', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ANALYTICS', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getUserAnalytics", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ANALYTICS', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getRevenueAnalytics", null);
__decorate([
    (0, common_1.Get)('skills'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ANALYTICS', action: 'READ' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getTopSkills", null);
__decorate([
    (0, common_1.Get)('top-freelancers'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ANALYTICS', action: 'READ' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getTopFreelancers", null);
__decorate([
    (0, common_1.Get)('top-clients'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'ANALYTICS', action: 'READ' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getTopClients", null);
exports.AdminAnalyticsController = AdminAnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Analytics'),
    (0, common_1.Controller)({ path: 'super-admin/analytics', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [analytics_service_1.AdminAnalyticsService])
], AdminAnalyticsController);
//# sourceMappingURL=analytics.controller.js.map