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
exports.AdminContentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const content_service_1 = require("./content.service");
const admin_auth_guard_1 = require("../guards/admin-auth.guard");
const admin_permissions_decorator_1 = require("../decorators/admin-permissions.decorator");
let AdminContentController = class AdminContentController {
    constructor(service) {
        this.service = service;
    }
    async listPages() { return this.service.listPages(); }
    async getPage(id) { return this.service.getPage(id); }
    async createPage(data) { return this.service.createPage(data); }
    async updatePage(id, data) { return this.service.updatePage(id, data); }
    async deletePage(id) { return this.service.deletePage(id); }
    async listBlogPosts(page, pageSize) { return this.service.listBlogPosts({ page, pageSize }); }
    async getBlogPost(id) { return this.service.getBlogPost(id); }
    async createBlogPost(data) { return this.service.createBlogPost(data); }
    async updateBlogPost(id, data) { return this.service.updateBlogPost(id, data); }
    async deleteBlogPost(id) { return this.service.deleteBlogPost(id); }
    async listFaqCategories() { return this.service.listFaqCategories(); }
    async createFaqCategory(data) { return this.service.createFaqCategory(data); }
    async listFaqs() { return this.service.listFaqs(); }
    async createFaq(data) { return this.service.createFaq(data); }
    async updateFaq(id, data) { return this.service.updateFaq(id, data); }
    async deleteFaq(id) { return this.service.deleteFaq(id); }
    async listBanners() { return this.service.listBanners(); }
    async createBanner(data) { return this.service.createBanner(data); }
    async updateBanner(id, data) { return this.service.updateBanner(id, data); }
    async deleteBanner(id) { return this.service.deleteBanner(id); }
};
exports.AdminContentController = AdminContentController;
__decorate([
    (0, common_1.Get)('pages'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'CONTENT', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "listPages", null);
__decorate([
    (0, common_1.Get)('pages/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'CONTENT', action: 'READ' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "getPage", null);
__decorate([
    (0, common_1.Post)('pages'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'CONTENT', action: 'CREATE' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "createPage", null);
__decorate([
    (0, common_1.Patch)('pages/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'CONTENT', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "updatePage", null);
__decorate([
    (0, common_1.Delete)('pages/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'CONTENT', action: 'DELETE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "deletePage", null);
__decorate([
    (0, common_1.Get)('blog'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'BLOG', action: 'READ' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "listBlogPosts", null);
__decorate([
    (0, common_1.Get)('blog/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'BLOG', action: 'READ' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "getBlogPost", null);
__decorate([
    (0, common_1.Post)('blog'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'BLOG', action: 'CREATE' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "createBlogPost", null);
__decorate([
    (0, common_1.Patch)('blog/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'BLOG', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "updateBlogPost", null);
__decorate([
    (0, common_1.Delete)('blog/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'BLOG', action: 'DELETE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "deleteBlogPost", null);
__decorate([
    (0, common_1.Get)('faq-categories'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'FAQ', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "listFaqCategories", null);
__decorate([
    (0, common_1.Post)('faq-categories'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'FAQ', action: 'CREATE' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "createFaqCategory", null);
__decorate([
    (0, common_1.Get)('faqs'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'FAQ', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "listFaqs", null);
__decorate([
    (0, common_1.Post)('faqs'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'FAQ', action: 'CREATE' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "createFaq", null);
__decorate([
    (0, common_1.Patch)('faqs/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'FAQ', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "updateFaq", null);
__decorate([
    (0, common_1.Delete)('faqs/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'FAQ', action: 'DELETE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "deleteFaq", null);
__decorate([
    (0, common_1.Get)('banners'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'BANNERS', action: 'READ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "listBanners", null);
__decorate([
    (0, common_1.Post)('banners'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'BANNERS', action: 'CREATE' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "createBanner", null);
__decorate([
    (0, common_1.Patch)('banners/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'BANNERS', action: 'UPDATE' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "updateBanner", null);
__decorate([
    (0, common_1.Delete)('banners/:id'),
    (0, admin_permissions_decorator_1.AdminPermissions)({ module: 'BANNERS', action: 'DELETE' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminContentController.prototype, "deleteBanner", null);
exports.AdminContentController = AdminContentController = __decorate([
    (0, swagger_1.ApiTags)('Super Admin - Content'),
    (0, common_1.Controller)({ path: 'super-admin/content', version: '1' }),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminJwtAuthGuard),
    __metadata("design:paramtypes", [content_service_1.AdminContentService])
], AdminContentController);
//# sourceMappingURL=content.controller.js.map