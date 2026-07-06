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
exports.AdminAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminAnalyticsService = class AdminAnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const [newUsersThisMonth, newUsersLastMonth, newProjectsThisMonth, newContractsThisMonth] = await Promise.all([
            this.prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
            this.prisma.user.count({ where: { createdAt: { gte: lastMonth, lt: startOfMonth } } }),
            this.prisma.project.count({ where: { createdAt: { gte: startOfMonth } } }),
            this.prisma.contract.count({ where: { createdAt: { gte: startOfMonth } } }),
        ]);
        const userGrowth = newUsersThisMonth - newUsersLastMonth;
        const userGrowthRate = newUsersLastMonth > 0 ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth * 100) : 0;
        return { newUsersThisMonth, newUsersLastMonth, userGrowth, userGrowthRate, newProjectsThisMonth, newContractsThisMonth };
    }
    async getUserAnalytics() {
        const usersByRole = await this.prisma.user.groupBy({
            by: ['role'],
            _count: true,
            where: { deletedAt: null },
        });
        const usersByMonth = await this.prisma.$queryRaw `
      SELECT DATE_TRUNC('month', created_at)::text as month, COUNT(*)::int as count
      FROM users WHERE deleted_at IS NULL
      GROUP BY month ORDER BY month DESC LIMIT 12
    `;
        return { usersByRole, usersByMonth };
    }
    async getRevenueAnalytics() {
        return { revenueByMonth: [] };
    }
    async getTopSkills(limit = 10) {
        const skills = await this.prisma.freelancerSkill.groupBy({
            by: ['skillId'],
            _count: true,
            orderBy: { _count: { skillId: 'desc' } },
            take: limit,
        });
        const skillIds = skills.map(s => s.skillId);
        const skillNames = await this.prisma.skill.findMany({
            where: { id: { in: skillIds } },
            select: { id: true, name: true, nameAr: true },
        });
        return skills.map(s => ({
            skill: skillNames.find(n => n.id === s.skillId),
            count: s._count,
        }));
    }
    async getTopFreelancers(limit = 10) {
        return this.prisma.freelancerProfile.findMany({
            orderBy: { totalProjects: 'desc' },
            take: limit,
            include: {
                user: { select: { id: true, email: true } },
            },
        });
    }
    async getTopClients(limit = 10) {
        return this.prisma.clientProfile.findMany({
            orderBy: { totalProjectsPosted: 'desc' },
            take: limit,
            include: {
                user: { select: { id: true, email: true } },
            },
        });
    }
};
exports.AdminAnalyticsService = AdminAnalyticsService;
exports.AdminAnalyticsService = AdminAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminAnalyticsService);
//# sourceMappingURL=analytics.service.js.map