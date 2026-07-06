import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async listReports(params: { status?: string; page?: number; pageSize?: number }) {
    const { status, page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;
    const where: any = {};
    if (status) where.status = status;

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

  async reviewReport(id: string, data: { action: string; note?: string; adminId: string }) {
    const report = await this.prisma.userReport.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

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
}
