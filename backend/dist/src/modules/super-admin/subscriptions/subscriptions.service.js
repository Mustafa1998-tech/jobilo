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
exports.AdminSubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminSubscriptionsService = class AdminSubscriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listPlans() {
        return this.prisma.subscriptionPlan.findMany({ orderBy: { sortOrder: 'asc' } });
    }
    async getPlan(id) {
        const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
        if (!plan)
            throw new common_1.NotFoundException('Plan not found');
        return plan;
    }
    async createPlan(data) {
        return this.prisma.subscriptionPlan.create({ data });
    }
    async updatePlan(id, data) {
        return this.prisma.subscriptionPlan.update({ where: { id }, data });
    }
    async deletePlan(id) {
        const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
        if (!plan)
            throw new common_1.NotFoundException('Plan not found');
        return this.prisma.subscriptionPlan.delete({ where: { id } });
    }
    async togglePlan(id) {
        const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
        if (!plan)
            throw new common_1.NotFoundException('Plan not found');
        return this.prisma.subscriptionPlan.update({ where: { id }, data: { isActive: !plan.isActive } });
    }
    async listSubscriptions(params) {
        const { status, page = 1, pageSize = 20 } = params;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.subscription.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
                include: {
                    user: { select: { id: true, email: true } },
                    plan: { select: { id: true, name: true } },
                },
            }),
            this.prisma.subscription.count({ where }),
        ]);
        return { data, meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize), hasNextPage: page * pageSize < total, hasPreviousPage: page > 1 } };
    }
};
exports.AdminSubscriptionsService = AdminSubscriptionsService;
exports.AdminSubscriptionsService = AdminSubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminSubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map