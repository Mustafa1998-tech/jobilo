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
exports.AdminDisputesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminDisputesService = class AdminDisputesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listDisputes(params) {
        const { status, page = 1, pageSize = 20 } = params;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.dispute.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
                include: {
                    project: { select: { id: true, title: true } },
                    opener: { select: { id: true, email: true } },
                    contract: { select: { id: true } },
                },
            }),
            this.prisma.dispute.count({ where }),
        ]);
        return { data, meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize), hasNextPage: page * pageSize < total, hasPreviousPage: page > 1 } };
    }
    async getDispute(id) {
        const dispute = await this.prisma.dispute.findUnique({
            where: { id },
            include: {
                project: true,
                contract: { include: { freelancer: { include: { freelancerProfile: true } }, client: { include: { clientProfile: true } } } },
                opener: { include: { freelancerProfile: true, clientProfile: true } },
                participants: { include: { user: { select: { id: true, email: true } } } },
                messages: { include: { user: { select: { id: true, email: true } } }, orderBy: { createdAt: 'asc' } },
            },
        });
        if (!dispute)
            throw new common_1.NotFoundException('Dispute not found');
        return dispute;
    }
    async resolveDispute(id, data) {
        const dispute = await this.prisma.dispute.findUnique({ where: { id } });
        if (!dispute)
            throw new common_1.NotFoundException('Dispute not found');
        return this.prisma.dispute.update({
            where: { id },
            data: {
                status: 'RESOLVED',
                resolution: data.notes || data.decision,
                resolvedBy: data.adminId,
                resolvedAt: new Date(),
            },
        });
    }
    async closeDispute(id, adminId) {
        return this.prisma.dispute.update({
            where: { id },
            data: { status: 'RESOLVED', resolvedBy: adminId, resolvedAt: new Date(), resolution: 'Closed by admin' },
        });
    }
};
exports.AdminDisputesService = AdminDisputesService;
exports.AdminDisputesService = AdminDisputesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminDisputesService);
//# sourceMappingURL=disputes.service.js.map