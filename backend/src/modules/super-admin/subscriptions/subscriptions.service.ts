import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminSubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPlans() {
    return this.prisma.subscriptionPlan.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async getPlan(id: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async createPlan(data: any) {
    return this.prisma.subscriptionPlan.create({ data });
  }

  async updatePlan(id: string, data: any) {
    return this.prisma.subscriptionPlan.update({ where: { id }, data });
  }

  async deletePlan(id: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return this.prisma.subscriptionPlan.delete({ where: { id } });
  }

  async togglePlan(id: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return this.prisma.subscriptionPlan.update({ where: { id }, data: { isActive: !plan.isActive } });
  }

  async listSubscriptions(params: { status?: string; page?: number; pageSize?: number }) {
    const { status, page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;
    const where: any = {};
    if (status) where.status = status;

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
}
