import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, ProjectStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { AuthHelpersService } from '../../common/utils/auth-helpers.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helpers: AuthHelpersService,
  ) {}

  async findAll(query: QueryProjectsDto) {
    const page = query.page || 1;
    const pageSize = Math.min(query.pageSize || 20, 100);
    const skip = (page - 1) * pageSize;

    const where: Prisma.ProjectWhereInput = {};
    where.status = (query.status as ProjectStatus) || 'OPEN';

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.projectType) where.projectType = query.projectType;
    if (query.experienceLevel) where.experienceLevel = query.experienceLevel as any;
    if (query.location) where.location = { contains: query.location, mode: 'insensitive' };
    if (query.isUrgent !== undefined) where.isUrgent = query.isUrgent;

    if (query.budgetMin || query.budgetMax) {
      where.budgetMax = {};
      if (query.budgetMin) where.budgetMax.gte = query.budgetMin;
      if (query.budgetMax) where.budgetMax.lte = query.budgetMax;
    }

    if (query.skillIds && query.skillIds.length > 0) {
      where.skills = {
        some: {
          skillId: { in: query.skillIds },
        },
      };
    }

    const orderBy: Prisma.ProjectOrderByWithRelationInput = {};
    if (query.sortBy === 'budgetMax') orderBy.budgetMax = query.sortOrder || 'desc';
    else if (query.sortBy === 'proposalsCount') orderBy.proposalsCount = query.sortOrder || 'desc';
    else orderBy.createdAt = query.sortOrder || 'desc';

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          skills: { include: { skill: true } },
          client: {
            select: {
              clientProfile: { select: { companyName: true, logoUrl: true, averageRating: true } },
            },
          },
          _count: { select: { proposals: true, bookmarks: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      meta: {
        page,
        pageSize,
        totalCount: total,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page * pageSize < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getFeatured() {
    return this.prisma.project.findMany({
      where: { isFeatured: true, status: 'OPEN' },
      take: 10,
      orderBy: { publishedAt: 'desc' },
      include: {
        category: true,
        skills: { include: { skill: true } },
        client: {
          select: {
            clientProfile: { select: { companyName: true, logoUrl: true } },
          },
        },
        _count: { select: { proposals: true } },
      },
    });
  }

  async create(userId: string, dto: CreateProjectDto) {
    const slug = this.helpers.generateSlug(dto.title);

    const project = await this.prisma.project.create({
      data: {
        clientId: userId,
        categoryId: dto.categoryId,
        title: dto.title,
        slug,
        description: dto.description,
        projectType: dto.projectType,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        durationDays: dto.durationDays,
        experienceLevel: dto.experienceLevel as any || 'INTERMEDIATE',
        isUrgent: dto.isUrgent || false,
        location: dto.location || 'remote',
        status: 'OPEN',
        publishedAt: new Date(),
        skills: {
          create: (dto.skills || []).map((s) => ({
            skillId: s.skillId,
            level: s.level as any || 'INTERMEDIATE',
            skill: { connect: { id: s.skillId } },
          })),
        },
        attachments: dto.attachments
          ? {
              create: dto.attachments.map((a) => ({
                fileUrl: a.fileUrl,
                fileName: a.fileName,
                fileType: a.fileType as any,
                fileSize: a.fileSize || 0,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        skills: { include: { skill: true } },
        attachments: true,
      },
    });

    return project;
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        category: true,
        skills: { include: { skill: true } },
        attachments: true,
        client: {
          select: {
            id: true,
            clientProfile: {
              select: {
                companyName: true,
                logoUrl: true,
                location: true,
                isVerified: true,
                averageRating: true,
                totalProjectsPosted: true,
              },
            },
          },
        },
        _count: { select: { proposals: true, bookmarks: true } },
      },
    });

    if (!project) throw new NotFoundException('Project not found');

    await this.prisma.project.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });

    return project;
  }

  async update(id: string, userId: string, dto: Partial<CreateProjectDto>) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.clientId !== userId) throw new ForbiddenException('Not your project');

    const data: any = { ...dto };
    delete data.skills;
    delete data.attachments;

    if (dto.title) {
      data.slug = this.helpers.generateSlug(dto.title);
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data,
      include: {
        category: true,
        skills: { include: { skill: true } },
      },
    });

    if (dto.skills) {
      await this.prisma.projectSkill.deleteMany({ where: { projectId: id } });
      for (const s of dto.skills) {
        await this.prisma.projectSkill.create({
          data: {
            project: { connect: { id } },
            skill: { connect: { id: s.skillId } },
            level: s.level as any || 'INTERMEDIATE',
          } as any,
        });
      }
    }

    return updated;
  }

  async remove(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.clientId !== userId) throw new ForbiddenException('Not your project');
    if (project.status !== 'DRAFT' && project.status !== 'OPEN') {
      throw new BadRequestException('Can only delete draft or open projects');
    }

    await this.prisma.project.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    return { message: 'Project deleted' };
  }

  async updateStatus(id: string, userId: string, status: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.clientId !== userId) throw new ForbiddenException('Not your project');

    return this.prisma.project.update({
      where: { id },
      data: { status: status as ProjectStatus, closedAt: status === 'CANCELLED' ? new Date() : undefined },
    });
  }

  async featureProject(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    return this.prisma.project.update({
      where: { id },
      data: { isFeatured: !project.isFeatured },
      select: { id: true, title: true, isFeatured: true },
    });
  }

  async toggleBookmark(projectId: string, userId: string) {
    const existing = await this.prisma.projectBookmark.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (existing) {
      await this.prisma.projectBookmark.delete({ where: { id: existing.id } });
      await this.prisma.project.update({ where: { id: projectId }, data: { savedCount: { decrement: 1 } } });
      return { bookmarked: false };
    }

    await this.prisma.projectBookmark.create({ data: { userId, projectId } });
    await this.prisma.project.update({ where: { id: projectId }, data: { savedCount: { increment: 1 } } });
    return { bookmarked: true };
  }

  async removeBookmark(projectId: string, userId: string) {
    const existing = await this.prisma.projectBookmark.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (existing) {
      await this.prisma.projectBookmark.delete({ where: { id: existing.id } });
      await this.prisma.project.update({ where: { id: projectId }, data: { savedCount: { decrement: 1 } } });
    }

    return { message: 'Bookmark removed' };
  }

  async report(projectId: string, userId: string, reason: string) {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'project.report',
        entityType: 'project',
        entityId: projectId,
        newValues: { reason },
      },
    });

    return { message: 'Report submitted' };
  }

  async getSimilar(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { skills: true },
    });

    if (!project) throw new NotFoundException('Project not found');

    const skillIds = project.skills.map((s) => s.skillId);

    return this.prisma.project.findMany({
      where: {
        id: { not: projectId },
        status: 'OPEN',
        categoryId: project.categoryId,
        OR: skillIds.length > 0
          ? [{ skills: { some: { skillId: { in: skillIds } } } }]
          : undefined,
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        skills: { include: { skill: true } },
        _count: { select: { proposals: true } },
      },
    });
  }
}
