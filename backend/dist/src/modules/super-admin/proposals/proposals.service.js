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
exports.AdminProposalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminProposalsService = class AdminProposalsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listProposals(params) {
        const { status, projectId, freelancerId, page = 1, pageSize = 20 } = params;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (status)
            where.status = status;
        if (projectId)
            where.projectId = projectId;
        if (freelancerId)
            where.freelancerId = freelancerId;
        const [data, total] = await Promise.all([
            this.prisma.proposal.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
                include: {
                    project: { select: { id: true, title: true } },
                    freelancer: { select: { id: true, email: true, freelancerProfile: { select: { firstName: true, lastName: true } } } },
                },
            }),
            this.prisma.proposal.count({ where }),
        ]);
        return { data, meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize), hasNextPage: page * pageSize < total, hasPreviousPage: page > 1 } };
    }
    async getProposal(id) {
        const proposal = await this.prisma.proposal.findUnique({
            where: { id },
            include: {
                project: true,
                freelancer: { include: { freelancerProfile: true } },
                attachments: true,
            },
        });
        if (!proposal)
            throw new common_1.NotFoundException('Proposal not found');
        return proposal;
    }
    async deleteProposal(id) {
        return this.prisma.proposal.delete({ where: { id } });
    }
    async updateStatus(id, status) {
        return this.prisma.proposal.update({ where: { id }, data: { status: status } });
    }
};
exports.AdminProposalsService = AdminProposalsService;
exports.AdminProposalsService = AdminProposalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminProposalsService);
//# sourceMappingURL=proposals.service.js.map