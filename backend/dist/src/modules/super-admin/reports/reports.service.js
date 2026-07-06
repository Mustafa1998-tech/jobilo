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
exports.AdminReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminReportsService = class AdminReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listReports(params) {
        const { status, page = 1, pageSize = 20 } = params;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.userReport.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
                include: {
                    reporter: { select: { id: true, email: true } },
                    reportedUser: { select: { id: true, email: true } },
                    project: { select: { id: true, title: true } },
                    reviewer: { select: { id: true, email: true } },
                },
            }),
            this.prisma.userReport.count({ where }),
        ]);
        return { data, meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize), hasNextPage: page * pageSize < total, hasPreviousPage: page > 1 } };
    }
    async reviewReport(id, data) {
        const report = await this.prisma.userReport.findUnique({ where: { id } });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        return this.prisma.userReport.update({
            where: { id },
            data: {
                status: 'RESOLVED',
                reviewedBy: data.adminId,
                reviewNote: data.note,
                actionTaken: data.action,
                resolvedAt: new Date(),
            },
        });
    }
};
exports.AdminReportsService = AdminReportsService;
exports.AdminReportsService = AdminReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminReportsService);
//# sourceMappingURL=reports.service.js.map