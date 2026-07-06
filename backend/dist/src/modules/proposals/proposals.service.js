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
exports.ProposalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let ProposalsService = class ProposalsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(projectId, userId, dto) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { id: true, status: true, clientId: true, budgetMin: true, budgetMax: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (project.status !== 'OPEN')
            throw new common_1.BadRequestException('Project is not accepting proposals');
        if (project.clientId === userId)
            throw new common_1.BadRequestException('Cannot bid on your own project');
        const existing = await this.prisma.proposal.findUnique({
            where: { projectId_freelancerId: { projectId, freelancerId: userId } },
        });
        if (existing)
            throw new common_1.ConflictException('You already submitted a proposal for this project');
        if (dto.bidAmount < 1) {
            throw new common_1.BadRequestException('Bid amount must be greater than 0');
        }
        const proposal = await this.prisma.proposal.create({
            data: {
                projectId,
                freelancerId: userId,
                coverLetter: dto.coverLetter,
                bidAmount: dto.bidAmount,
                durationDays: dto.durationDays,
                attachments: dto.attachments
                    ? { create: dto.attachments.map(a => ({ ...a, fileSize: 0, fileType: a.fileType })) }
                    : undefined,
            },
            include: {
                project: { select: { title: true } },
                attachments: true,
            },
        });
        await this.prisma.project.update({
            where: { id: projectId },
            data: {
                proposalsCount: { increment: 1 },
                averageBid: await this.calcAverageBid(projectId),
            },
        });
        return proposal;
    }
    async findAll(userId, query) {
        const page = query.page || 1;
        const pageSize = Math.min(query.pageSize || 20, 100);
        const skip = (page - 1) * pageSize;
        const where = { freelancerId: userId };
        if (query.status)
            where.status = query.status;
        const [proposals, total] = await Promise.all([
            this.prisma.proposal.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    project: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            budgetMin: true,
                            budgetMax: true,
                            status: true,
                            category: { select: { name: true } },
                        },
                    },
                },
            }),
            this.prisma.proposal.count({ where }),
        ]);
        return {
            data: proposals,
            meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize) },
        };
    }
    async findOne(id, userId) {
        const proposal = await this.prisma.proposal.findUnique({
            where: { id },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        clientId: true,
                        status: true,
                        budgetMin: true,
                        budgetMax: true,
                    },
                },
                freelancer: {
                    select: {
                        freelancerProfile: {
                            select: { firstName: true, lastName: true, avatarUrl: true, title: true, averageRating: true },
                        },
                    },
                },
                attachments: true,
            },
        });
        if (!proposal)
            throw new common_1.NotFoundException('Proposal not found');
        if (proposal.freelancerId !== userId && proposal.project.clientId !== userId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        if (proposal.freelancerId !== userId && !proposal.isSeen) {
            await this.prisma.proposal.update({
                where: { id },
                data: { isSeen: true, seenAt: new Date() },
            });
        }
        return proposal;
    }
    async update(id, userId, dto) {
        const proposal = await this.prisma.proposal.findUnique({ where: { id } });
        if (!proposal)
            throw new common_1.NotFoundException('Proposal not found');
        if (proposal.freelancerId !== userId)
            throw new common_1.ForbiddenException('Not your proposal');
        if (proposal.status !== 'PENDING')
            throw new common_1.BadRequestException('Can only edit pending proposals');
        return this.prisma.proposal.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id, userId) {
        const proposal = await this.prisma.proposal.findUnique({ where: { id } });
        if (!proposal)
            throw new common_1.NotFoundException('Proposal not found');
        if (proposal.freelancerId !== userId)
            throw new common_1.ForbiddenException('Not your proposal');
        await this.prisma.proposal.update({
            where: { id },
            data: { status: 'WITHDRAWN' },
        });
        await this.prisma.project.update({
            where: { id: proposal.projectId },
            data: {
                proposalsCount: { decrement: 1 },
                averageBid: await this.calcAverageBid(proposal.projectId),
            },
        });
        return { message: 'Proposal withdrawn' };
    }
    async accept(id, userId) {
        const proposal = await this.prisma.proposal.findUnique({
            where: { id },
            include: { project: { select: { clientId: true, title: true } } },
        });
        if (!proposal)
            throw new common_1.NotFoundException('Proposal not found');
        if (proposal.project.clientId !== userId)
            throw new common_1.ForbiddenException('Not your project');
        if (proposal.status !== 'PENDING')
            throw new common_1.BadRequestException('Proposal is not pending');
        const contract = await this.prisma.$transaction(async (tx) => {
            await tx.proposal.update({
                where: { id },
                data: { status: 'ACCEPTED' },
            });
            await tx.project.update({
                where: { id: proposal.projectId },
                data: { status: 'UNDER_REVIEW' },
            });
            return tx.contract.create({
                data: {
                    projectId: proposal.projectId,
                    proposalId: id,
                    freelancerId: proposal.freelancerId,
                    clientId: userId,
                    status: 'DRAFT',
                },
            });
        });
        return contract;
    }
    async reject(id, userId) {
        const proposal = await this.prisma.proposal.findUnique({
            where: { id },
            include: { project: { select: { clientId: true } } },
        });
        if (!proposal)
            throw new common_1.NotFoundException('Proposal not found');
        if (proposal.project.clientId !== userId)
            throw new common_1.ForbiddenException('Not your project');
        return this.prisma.proposal.update({
            where: { id },
            data: { status: 'REJECTED' },
        });
    }
    async shortlist(id, userId) {
        const proposal = await this.prisma.proposal.findUnique({
            where: { id },
            include: { project: { select: { clientId: true } } },
        });
        if (!proposal)
            throw new common_1.NotFoundException('Proposal not found');
        if (proposal.project.clientId !== userId)
            throw new common_1.ForbiddenException('Not your project');
        return this.prisma.proposal.update({
            where: { id },
            data: { status: 'SHORTLISTED' },
        });
    }
    async calcAverageBid(projectId) {
        const result = await this.prisma.proposal.aggregate({
            where: { projectId, status: { in: ['PENDING', 'SHORTLISTED', 'ACCEPTED'] } },
            _avg: { bidAmount: true },
        });
        return Number(result._avg.bidAmount) || 0;
    }
};
exports.ProposalsService = ProposalsService;
exports.ProposalsService = ProposalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProposalsService);
//# sourceMappingURL=proposals.service.js.map