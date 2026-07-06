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
exports.AdminLogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const logs_service_1 = require("./logs.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
let AdminLogsController = class AdminLogsController {
    constructor(service) {
        this.service = service;
    }
    async getAuditLogs(userId, action, module, page, pageSize) {
        return this.service.getAuditLogs({ userId, action, module, page, pageSize });
    }
    async getLoginLogs(userId, success, page, pageSize) {
        return this.service.getLoginLogs({ userId, success, page, pageSize });
    }
    async getErrorLogs(level, resolved, page, pageSize) {
        return this.service.getErrorLogs({ level, resolved, page, pageSize });
    }
    async getSecurityLogs(type, severity, page, pageSize) {
        return this.service.getSecurityLogs({ type, severity, page, pageSize });
    }
};
exports.AdminLogsController = AdminLogsController;
__decorate([
    (0, common_1.Get)('audit'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'AUDIT_LOGS', action: 'READ' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('action')),
    __param(2, (0, common_1.Query)('module')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminLogsController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('login'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'AUDIT_LOGS', action: 'READ' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('success')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminLogsController.prototype, "getLoginLogs", null);
__decorate([
    (0, common_1.Get)('errors'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'AUDIT_LOGS', action: 'READ' }),
    __param(0, (0, common_1.Query)('level')),
    __param(1, (0, common_1.Query)('resolved')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminLogsController.prototype, "getErrorLogs", null);
__decorate([
    (0, common_1.Get)('security'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'AUDIT_LOGS', action: 'READ' }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('severity')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminLogsController.prototype, "getSecurityLogs", null);
exports.AdminLogsController = AdminLogsController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Logs'),
    (0, common_1.Controller)({ path: 'super-admin/logs', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [logs_service_1.AdminLogsService])
], AdminLogsController);
//# sourceMappingURL=logs.controller.js.map