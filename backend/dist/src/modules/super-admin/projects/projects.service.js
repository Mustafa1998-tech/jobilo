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
exports.AdminProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminProjectsService = class AdminProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listProjects(params) {
        const { search, status, clientId, categoryId, page = 1, pageSize = 20 } = params;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (search)
            where.title = { contains: search, mode: 'insensitive' };
        if (status)
            where.status = status;
        if (clientId)
            where.clientId = clientId;
        if (categoryId)
            where.categoryId = categoryId;
        const [data, total] = await Promise.all([
            this.prisma.project.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
                include: {
                    category: { select: { id: true, name: true } },
                    client: { select: { id: true, email: true, clientProfile: { select: { companyName: true } } } },
                    skills: { include: { skill: { select: { id: true, name: true } } } },
                    _count: { select: { proposals: true } },
                },
            }),
            this.prisma.project.count({ where }),
        ]);
        return { data, meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize), hasNextPage: page * pageSize < total, hasPreviousPage: page > 1 } };
    }
    async getProject(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                category: true,
                client: { include: { clientProfile: true } },
                skills: { include: { skill: true } },
                proposals: { include: { freelancer: { include: { freelancerProfile: true } } } },
                contracts: true,
                disputes: true,
                reports: true,
                _count: { select: { proposals: true, bookmarks: true } },
            },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async updateProject(id, data) {
        const project = await this.prisma.project.findUnique({ where: { id } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return this.prisma.project.update({ where: { id }, data });
    }
    async deleteProject(id) {
        return this.prisma.project.delete({ where: { id } });
    }
    async updateStatus(id, status) {
        return this.prisma.project.update({ where: { id }, data: { status: status } });
    }
    async toggleFeatured(id) {
        const project = await this.prisma.project.findUnique({ where: { id } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return this.prisma.project.update({ where: { id }, data: { isFeatured: !project.isFeatured } });
    }
};
exports.AdminProjectsService = AdminProjectsService;
exports.AdminProjectsService = AdminProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminProjectsService);
//# sourceMappingURL=projects.service.js.map