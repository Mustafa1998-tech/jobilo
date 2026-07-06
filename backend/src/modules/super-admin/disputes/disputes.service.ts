import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminDisputesService {
  constructor(private readonly prisma: PrismaService) {}

  async listDisputes(params: { status?: string; page?: number; pageSize?: number }) {
    const { status, page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;
    const where: any = {};
    if (status) where.status = status;

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

  async getDispute(id: string) {
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
    if (!dispute) throw new NotFoundException('Dispute not found');
    return dispute;
  }

  async resolveDispute(id: string, data: { decision: string; notes?: string; refundAmount?: number; adminId: string }) {
    const dispute = await this.prisma.dispute.findUnique({ where: { id } });
    if (!dispute) throw new NotFoundException('Dispute not found');

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

  async closeDispute(id: string, adminId: string) {
    return this.prisma.dispute.update({
      where: { id },
      data: { status: 'RESOLVED', resolvedBy: adminId, resolvedAt: new Date(), resolution: 'Closed by admin' },
    });
  }
}
