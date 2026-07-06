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
exports.AdminProjectsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const projects_service_1 = require("./projects.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
let AdminProjectsController = class AdminProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    async listProjects(search, status, clientId, categoryId, page, pageSize) {
        return this.projectsService.listProjects({ search, status, clientId, categoryId, page, pageSize });
    }
    async getProject(id) {
        return this.projectsService.getProject(id);
    }
    async updateProject(id, data) {
        return this.projectsService.updateProject(id, data);
    }
    async deleteProject(id) {
        return this.projectsService.deleteProject(id);
    }
    async updateStatus(id, status) {
        return this.projectsService.updateStatus(id, status);
    }
    async toggleFeatured(id) {
        return this.projectsService.toggleFeatured(id);
    }
};
exports.AdminProjectsController = AdminProjectsController;
__decorate([
    (0, common_1.Get)(),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'PROJECTS', action: 'READ' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('clientId')),
    __param(3, (0, common_1.Query)('categoryId')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminProjectsController.prototype, "listProjects", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'PROJECTS', action: 'READ' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProjectsController.prototype, "getProject", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'PROJECTS', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminProjectsController.prototype, "updateProject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'PROJECTS', action: 'DELETE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProjectsController.prototype, "deleteProject", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'PROJECTS', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminProjectsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/feature'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'PROJECTS', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProjectsController.prototype, "toggleFeatured", null);
exports.AdminProjectsController = AdminProjectsController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Projects'),
    (0, common_1.Controller)({ path: 'super-admin/projects', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [projects_service_1.AdminProjectsService])
], AdminProjectsController);
//# sourceMappingURL=projects.controller.js.map