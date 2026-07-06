import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

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

    const usersByMonth = await this.prisma.$queryRaw`
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
}
