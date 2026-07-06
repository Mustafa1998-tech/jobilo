import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        locale: true,
        timezone: true,
        emailVerifiedAt: true,
        createdAt: true,
        freelancerProfile: {
          include: {
            skills: { include: { skill: true } },
          },
        },
        clientProfile: true,
        socialLinks: true,
        portfolios: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, role: string, data: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) throw new NotFoundException('User not found');

    if (role === 'FREELANCER' || user.role === 'FREELANCER') {
      const { skills, ...profileData } = data;

      await this.prisma.freelancerProfile.upsert({
        where: { userId },
        create: { userId, ...profileData },
        update: profileData,
      });

      if (skills && Array.isArray(skills)) {
        await this.prisma.freelancerSkill.deleteMany({
          where: { freelancerProfile: { userId } },
        });

        const freelancerProfile = await this.prisma.freelancerProfile.findUnique({
          where: { userId },
          select: { id: true },
        });

        if (freelancerProfile && skills.length > 0) {
          await this.prisma.freelancerSkill.createMany({
            data: skills.map((s: any) => ({
              freelancerProfileId: freelancerProfile.id,
              skillId: s.skillId,
              level: s.level || 'INTERMEDIATE',
              isTop: s.isTop || false,
            })),
          });
        }
      }
    }

    if (role === 'CLIENT' || user.role === 'CLIENT') {
      await this.prisma.clientProfile.upsert({
        where: { userId },
        create: { userId, ...data },
        update: data,
      });
    }

    return this.getProfile(userId);
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'DELETED',
        deletedAt: new Date(),
        email: `deleted-${userId}@jobilo.com`,
      },
    });
    return { message: 'Account deleted successfully' };
  }

  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, status: 'ACTIVE' },
      select: {
        id: true,
        role: true,
        createdAt: true,
        freelancerProfile: {
          select: {
            firstName: true,
            lastName: true,
            title: true,
            bio: true,
            avatarUrl: true,
            hourlyRate: true,
            experienceLevel: true,
            averageRating: true,
            totalProjects: true,
            languages: true,
            education: true,
            certifications: true,
            skills: {
              include: { skill: true },
              orderBy: { isTop: 'desc' },
            },
          },
        },
        clientProfile: {
          select: {
            companyName: true,
            companyWebsite: true,
            industry: true,
            description: true,
            logoUrl: true,
            location: true,
            isVerified: true,
            totalProjectsPosted: true,
            averageRating: true,
          },
        },
        socialLinks: { where: { isPublic: true } },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUserPortfolio(userId: string) {
    return this.prisma.portfolio.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' },
      include: { category: true },
    });
  }

  async getUserReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { revieweeId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: {
          select: {
            freelancerProfile: { select: { firstName: true, lastName: true, avatarUrl: true } },
            clientProfile: { select: { companyName: true, logoUrl: true } },
          },
        },
      },
    });
  }

  async listUsers(query: any) {
    const page = query.page || 1;
    const pageSize = Math.min(query.pageSize || 20, 100);
    const skip = (page - 1) * pageSize;

    const where: any = { deletedAt: null };
    if (query.role) where.role = query.role;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { freelancerProfile: { firstName: { contains: query.search, mode: 'insensitive' } } },
        { freelancerProfile: { lastName: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          emailVerifiedAt: true,
          createdAt: true,
          lastLoginAt: true,
          freelancerProfile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          clientProfile: { select: { companyName: true, logoUrl: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
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

  async changeRole(userId: string, role: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
      select: { id: true, email: true, role: true },
    });
  }

  async changeStatus(userId: string, status: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: status as any },
      select: { id: true, email: true, status: true },
    });
  }

  async verifyUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.role === 'FREELANCER') {
      await this.prisma.freelancerProfile.update({
        where: { userId },
        data: { isVerified: true, verifiedAt: new Date() },
      });
    } else {
      await this.prisma.clientProfile.update({
        where: { userId },
        data: { isVerified: true, verifiedAt: new Date() },
      });
    }

    return { message: 'User verified successfully' };
  }
}
