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
exports.AdminDashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminDashboardService = class AdminDashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const [totalUsers, totalClients, totalFreelancers, openProjects, completedProjects, canceledProjects, pendingReports, activeDisputes, totalMessages, bannedUsers, usersWithCompanies,] = await Promise.all([
            this.prisma.user.count({ where: { deletedAt: null } }),
            this.prisma.user.count({ where: { role: 'CLIENT', deletedAt: null } }),
            this.prisma.user.count({ where: { role: 'FREELANCER', deletedAt: null } }),
            this.prisma.project.count({ where: { status: 'OPEN' } }),
            this.prisma.project.count({ where: { status: 'COMPLETED' } }),
            this.prisma.project.count({ where: { status: 'CANCELLED' } }),
            this.prisma.userReport.count({ where: { status: 'PENDING' } }),
            this.prisma.dispute.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } } }),
            this.prisma.message.count(),
            this.prisma.user.count({ where: { status: 'BANNED' } }),
            this.prisma.clientProfile.count(),
        ]);
        const activeUsers = await this.prisma.user.count({
            where: { status: 'ACTIVE', lastLoginAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        });
        return {
            totalUsers,
            totalClients,
            totalFreelancers,
            totalCompanies: usersWithCompanies,
            openProjects,
            completedProjects,
            canceledProjects,
            pendingReports,
            activeDisputes,
            totalMessages,
            activeUsers,
            bannedUsers,
        };
    }
    async getRevenue() {
        const subscriptionsCount = await this.prisma.subscription.count({
            where: { status: 'ACTIVE' },
        });
        return {
            totalRevenue: 0,
            dailyRevenue: 0,
            monthlyRevenue: 0,
            yearlyRevenue: 0,
            paidSubscriptions: subscriptionsCount,
        };
    }
    async getRecentRegistrations(limit = 10) {
        return this.prisma.user.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                freelancerProfile: { select: { firstName: true, lastName: true } },
                clientProfile: { select: { companyName: true } },
            },
        });
    }
    async getRecentActivity(limit = 10) {
        return this.prisma.adminActivityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        freelancerProfile: { select: { firstName: true, lastName: true } },
                    },
                },
            },
        });
    }
};
exports.AdminDashboardService = AdminDashboardService;
exports.AdminDashboardService = AdminDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminDashboardService);
//# sourceMappingURL=dashboard.service.js.map