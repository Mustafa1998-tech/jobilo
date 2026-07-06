import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalClients,
      totalFreelancers,
      openProjects,
      completedProjects,
      canceledProjects,
      pendingReports,
      activeDisputes,
      totalMessages,
      bannedUsers,
      usersWithCompanies,
    ] = await Promise.all([
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
}
