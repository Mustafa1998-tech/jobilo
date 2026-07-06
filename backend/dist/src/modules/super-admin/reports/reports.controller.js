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
exports.AdminReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
const admin_user_decorator_1 = require("../decorators/admin-user.decorator");
let AdminReportsController = class AdminReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async listReports(status, page, pageSize) {
        return this.reportsService.listReports({ status, page, pageSize });
    }
    async reviewReport(id, body, adminId) {
        return this.reportsService.reviewReport(id, { ...body, adminId });
    }
};
exports.AdminReportsController = AdminReportsController;
__decorate([
    (0, common_1.Get)(),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'REPORTS', action: 'READ' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminReportsController.prototype, "listReports", null);
__decorate([
    (0, common_1.Post)(':id/review'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'REPORTS', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, admin_user_decorator_1.AdminUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], AdminReportsController.prototype, "reviewReport", null);
exports.AdminReportsController = AdminReportsController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Reports'),
    (0, common_1.Controller)({ path: 'super-admin/reports', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [reports_service_1.AdminReportsService])
], AdminReportsController);
//# sourceMappingURL=reports.controller.js.map