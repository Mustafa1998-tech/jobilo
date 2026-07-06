import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async listProjects(params: { search?: string; status?: string; clientId?: string; categoryId?: string; page?: number; pageSize?: number }) {
    const { search, status, clientId, categoryId, page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (categoryId) where.categoryId = categoryId;

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        include: {
          category: { select: { id: true, name: true } },
          client: { select: { id: true, email: true, clientProfile: { select: { companyName: true } } } },
          skills: { include: { skill: { select: { id: true, name: true } } } },
          _count: { select: { proposals: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return { data, meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize), hasNextPage: page * pageSize < total, hasPreviousPage: page > 1 } };
  }

  async getProject(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        category: true,
        client: { include: { clientProfile: true } },
        skills: { include: { skill: true } },
        proposals: { include: { freelancer: { include: { freelancerProfile: true } } } },
        contracts: true,
        disputes: true,
        reports: true,
        _count: { select: { proposals: true, bookmarks: true } },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async updateProject(id: string, data: any) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return this.prisma.project.update({ where: { id }, data });
  }

  async deleteProject(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.project.update({ where: { id }, data: { status: status as any } });
  }

  async toggleFeatured(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return this.prisma.project.update({ where: { id }, data: { isFeatured: !project.isFeatured } });
  }
}
