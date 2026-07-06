import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminProposalsService {
  constructor(private readonly prisma: PrismaService) {}

  async listProposals(params: { status?: string; projectId?: string; freelancerId?: string; page?: number; pageSize?: number }) {
    const { status, projectId, freelancerId, page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;
    const where: any = {};
    if (status) where.status = status;
    if (projectId) where.projectId = projectId;
    if (freelancerId) where.freelancerId = freelancerId;

    const [data, total] = await Promise.all([
      this.prisma.proposal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        include: {
          project: { select: { id: true, title: true } },
          freelancer: { select: { id: true, email: true, freelancerProfile: { select: { firstName: true, lastName: true } } } },
        },
      }),
      this.prisma.proposal.count({ where }),
    ]);

    return { data, meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize), hasNextPage: page * pageSize < total, hasPreviousPage: page > 1 } };
  }

  async getProposal(id: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: {
        project: true,
        freelancer: { include: { freelancerProfile: true } },
        attachments: true,
      },
    });
    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }

  async deleteProposal(id: string) {
    return this.prisma.proposal.delete({ where: { id } });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.proposal.update({ where: { id }, data: { status: status as any } });
  }
}
