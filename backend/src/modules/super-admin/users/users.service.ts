import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers(params: { search?: string; role?: string; status?: string; verified?: string; dateFrom?: string; dateTo?: string; sortBy?: string; sortOrder?: string; page?: number; pageSize?: number }) {
    const { search, role, status, verified, dateFrom, dateTo, sortBy = 'createdAt', sortOrder = 'desc', page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { freelancerProfile: { firstName: { contains: search, mode: 'insensitive' } } },
        { freelancerProfile: { lastName: { contains: search, mode: 'insensitive' } } },
        { clientProfile: { companyName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (role) where.role = role;
    if (status) where.status = status;
    if (verified === 'true') where.emailVerifiedAt = { not: null };
    if (verified === 'false') where.emailVerifiedAt = null;
    if (dateFrom) where.createdAt = { ...where.createdAt, gte: new Date(dateFrom) };
    if (dateTo) where.createdAt = { ...where.createdAt, lte: new Date(dateTo) };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: pageSize,
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          emailVerifiedAt: true,
          loginAttempts: true,
          lockedUntil: true,
          lastLoginAt: true,
          createdAt: true,
          freelancerProfile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          clientProfile: { select: { companyName: true, logoUrl: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize), hasNextPage: page * pageSize < total, hasPreviousPage: page > 1 },
    };
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        freelancerProfile: { include: { skills: { include: { skill: true } } } },
        clientProfile: true,
        adminRoles: { include: { role: true } },
        badges: { include: { badge: true } },
      },
    });
    if (!user || user.deletedAt) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({ where: { id }, data: { status: status as any } });
  }

  async banUser(id: string, reason?: string, durationMinutes?: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const updateData: any = { status: 'BANNED' };
    if (durationMinutes) {
      updateData.lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
    }
    return this.prisma.user.update({ where: { id }, data: updateData });
  }

  async unbanUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({ where: { id }, data: { status: 'ACTIVE', lockedUntil: null, loginAttempts: 0 } });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), email: `deleted-${Date.now()}-${user.email}` },
    });
  }

  async resetPassword(id: string, newPassword: string) {
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(newPassword, 12);
    return this.prisma.user.update({ where: { id }, data: { passwordHash } });
  }

  async changeRole(id: string, role: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({ where: { id }, data: { role: role as any } });
  }

  async getUserActivity(id: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.prisma.adminActivityLog.findMany({
        where: { resourceId: id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.adminActivityLog.count({ where: { resourceId: id } }),
    ]);
    return { data, meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize), hasNextPage: page * pageSize < total, hasPreviousPage: page > 1 } };
  }
}
