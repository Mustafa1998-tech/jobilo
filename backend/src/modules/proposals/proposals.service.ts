import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, userId: string, dto: CreateProposalDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, status: true, clientId: true, budgetMin: true, budgetMax: true },
    });

    if (!project) throw new NotFoundException('Project not found');
    if (project.status !== 'OPEN') throw new BadRequestException('Project is not accepting proposals');
    if (project.clientId === userId) throw new BadRequestException('Cannot bid on your own project');

    const existing = await this.prisma.proposal.findUnique({
      where: { projectId_freelancerId: { projectId, freelancerId: userId } },
    });

    if (existing) throw new ConflictException('You already submitted a proposal for this project');

    if (dto.bidAmount < 1) {
      throw new BadRequestException('Bid amount must be greater than 0');
    }

    const proposal = await this.prisma.proposal.create({
      data: {
        projectId,
        freelancerId: userId,
        coverLetter: dto.coverLetter,
        bidAmount: dto.bidAmount,
        durationDays: dto.durationDays,
        attachments: dto.attachments
          ? { create: dto.attachments.map(a => ({ ...a, fileSize: 0, fileType: a.fileType as any })) }
          : undefined,
      },
      include: {
        project: { select: { title: true } },
        attachments: true,
      },
    });

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        proposalsCount: { increment: 1 },
        averageBid: await this.calcAverageBid(projectId),
      },
    });

    // TODO: Send notification to client

    return proposal;
  }

  async findAll(userId: string, query: any) {
    const page = query.page || 1;
    const pageSize = Math.min(query.pageSize || 20, 100);
    const skip = (page - 1) * pageSize;

    const where: any = { freelancerId: userId };
    if (query.status) where.status = query.status;

    const [proposals, total] = await Promise.all([
      this.prisma.proposal.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              slug: true,
              budgetMin: true,
              budgetMax: true,
              status: true,
              category: { select: { name: true } },
            },
          },
        },
      }),
      this.prisma.proposal.count({ where }),
    ]);

    return {
      data: proposals,
      meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findOne(id: string, userId: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            clientId: true,
            status: true,
            budgetMin: true,
            budgetMax: true,
          },
        },
        freelancer: {
          select: {
            freelancerProfile: {
              select: { firstName: true, lastName: true, avatarUrl: true, title: true, averageRating: true },
            },
          },
        },
        attachments: true,
      },
    });

    if (!proposal) throw new NotFoundException('Proposal not found');

    if (proposal.freelancerId !== userId && proposal.project.clientId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    if (proposal.freelancerId !== userId && !proposal.isSeen) {
      await this.prisma.proposal.update({
        where: { id },
        data: { isSeen: true, seenAt: new Date() },
      });
    }

    return proposal;
  }

  async update(id: string, userId: string, dto: Partial<CreateProposalDto>) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id } });
    if (!proposal) throw new NotFoundException('Proposal not found');
    if (proposal.freelancerId !== userId) throw new ForbiddenException('Not your proposal');
    if (proposal.status !== 'PENDING') throw new BadRequestException('Can only edit pending proposals');

    return this.prisma.proposal.update({
      where: { id },
      data: dto as any,
    });
  }

  async remove(id: string, userId: string) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id } });
    if (!proposal) throw new NotFoundException('Proposal not found');
    if (proposal.freelancerId !== userId) throw new ForbiddenException('Not your proposal');

    await this.prisma.proposal.update({
      where: { id },
      data: { status: 'WITHDRAWN' },
    });

    await this.prisma.project.update({
      where: { id: proposal.projectId },
      data: {
        proposalsCount: { decrement: 1 },
        averageBid: await this.calcAverageBid(proposal.projectId),
      },
    });

    return { message: 'Proposal withdrawn' };
  }

  async accept(id: string, userId: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: { project: { select: { clientId: true, title: true } } },
    });

    if (!proposal) throw new NotFoundException('Proposal not found');
    if (proposal.project.clientId !== userId) throw new ForbiddenException('Not your project');
    if (proposal.status !== 'PENDING') throw new BadRequestException('Proposal is not pending');

    const contract = await this.prisma.$transaction(async (tx) => {
      await tx.proposal.update({
        where: { id },
        data: { status: 'ACCEPTED' },
      });

      await tx.project.update({
        where: { id: proposal.projectId },
        data: { status: 'UNDER_REVIEW' },
      });

      return tx.contract.create({
        data: {
          projectId: proposal.projectId,
          proposalId: id,
          freelancerId: proposal.freelancerId,
          clientId: userId,
          status: 'DRAFT',
        },
      });
    });

    // TODO: Send notification to freelancer

    return contract;
  }

  async reject(id: string, userId: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: { project: { select: { clientId: true } } },
    });

    if (!proposal) throw new NotFoundException('Proposal not found');
    if (proposal.project.clientId !== userId) throw new ForbiddenException('Not your project');

    return this.prisma.proposal.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async shortlist(id: string, userId: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: { project: { select: { clientId: true } } },
    });

    if (!proposal) throw new NotFoundException('Proposal not found');
    if (proposal.project.clientId !== userId) throw new ForbiddenException('Not your project');

    return this.prisma.proposal.update({
      where: { id },
      data: { status: 'SHORTLISTED' },
    });
  }

  private async calcAverageBid(projectId: string): Promise<number> {
    const result = await this.prisma.proposal.aggregate({
      where: { projectId, status: { in: ['PENDING', 'SHORTLISTED', 'ACCEPTED'] } },
      _avg: { bidAmount: true },
    });
    return Number(result._avg.bidAmount) || 0;
  }
}
