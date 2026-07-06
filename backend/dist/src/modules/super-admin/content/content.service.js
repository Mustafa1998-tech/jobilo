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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminContentService = class AdminContentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listPages() { return this.prisma.contentPage.findMany({ orderBy: { createdAt: 'desc' } }); }
    async getPage(id) { const p = await this.prisma.contentPage.findUnique({ where: { id } }); if (!p)
        throw new common_1.NotFoundException(); return p; }
    async createPage(data) { return this.prisma.contentPage.create({ data }); }
    async updatePage(id, data) { return this.prisma.contentPage.update({ where: { id }, data }); }
    async deletePage(id) { return this.prisma.contentPage.delete({ where: { id } }); }
    async listBlogPosts(params) {
        const { page = 1, pageSize = 20 } = params;
        const skip = (page - 1) * pageSize;
        const [data, total] = await Promise.all([
            this.prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' }, skip, take: pageSize, include: { author: { select: { id: true, email: true } } } }),
            this.prisma.blogPost.count(),
        ]);
        return { data, meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize), hasNextPage: page * pageSize < total, hasPreviousPage: page > 1 } };
    }
    async getBlogPost(id) { const p = await this.prisma.blogPost.findUnique({ where: { id } }); if (!p)
        throw new common_1.NotFoundException(); return p; }
    async createBlogPost(data) { return this.prisma.blogPost.create({ data }); }
    async updateBlogPost(id, data) { return this.prisma.blogPost.update({ where: { id }, data }); }
    async deleteBlogPost(id) { return this.prisma.blogPost.delete({ where: { id } }); }
    async listFaqCategories() { return this.prisma.faqCategory.findMany({ orderBy: { sortOrder: 'asc' }, include: { faqs: { orderBy: { sortOrder: 'asc' } } } }); }
    async createFaqCategory(data) { return this.prisma.faqCategory.create({ data }); }
    async listFaqs() { return this.prisma.faq.findMany({ orderBy: { sortOrder: 'asc' }, include: { category: true } }); }
    async createFaq(data) { return this.prisma.faq.create({ data }); }
    async updateFaq(id, data) { return this.prisma.faq.update({ where: { id }, data }); }
    async deleteFaq(id) { return this.prisma.faq.delete({ where: { id } }); }
    async listBanners() { return this.prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } }); }
    async createBanner(data) { return this.prisma.banner.create({ data }); }
    async updateBanner(id, data) { return this.prisma.banner.update({ where: { id }, data }); }
    async deleteBanner(id) { return this.prisma.banner.delete({ where: { id } }); }
};
exports.AdminContentService = AdminContentService;
exports.AdminContentService = AdminContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminContentService);
//# sourceMappingURL=content.service.js.map