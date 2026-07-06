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
exports.AdminProposalsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const proposals_service_1 = require("./proposals.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
let AdminProposalsController = class AdminProposalsController {
    constructor(proposalsService) {
        this.proposalsService = proposalsService;
    }
    async listProposals(status, projectId, freelancerId, page, pageSize) {
        return this.proposalsService.listProposals({ status, projectId, freelancerId, page, pageSize });
    }
    async getProposal(id) {
        return this.proposalsService.getProposal(id);
    }
    async deleteProposal(id) {
        return this.proposalsService.deleteProposal(id);
    }
    async updateStatus(id, status) {
        return this.proposalsService.updateStatus(id, status);
    }
};
exports.AdminProposalsController = AdminProposalsController;
__decorate([
    (0, common_1.Get)(),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'PROPOSALS', action: 'READ' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('projectId')),
    __param(2, (0, common_1.Query)('freelancerId')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminProposalsController.prototype, "listProposals", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'PROPOSALS', action: 'READ' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProposalsController.prototype, "getProposal", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'PROPOSALS', action: 'DELETE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProposalsController.prototype, "deleteProposal", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'PROPOSALS', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminProposalsController.prototype, "updateStatus", null);
exports.AdminProposalsController = AdminProposalsController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Proposals'),
    (0, common_1.Controller)({ path: 'super-admin/proposals', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [proposals_service_1.AdminProposalsService])
], AdminProposalsController);
//# sourceMappingURL=proposals.controller.js.map