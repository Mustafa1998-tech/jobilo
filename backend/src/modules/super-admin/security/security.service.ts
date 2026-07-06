import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminSecurityService {
  constructor(private readonly prisma: PrismaService) {}

  async getIpWhitelist() { return this.prisma.ipWhitelist.findMany({ orderBy: { createdAt: 'desc' } }); }

  async addIpWhitelist(data: { ipAddress: string; label?: string; createdBy: string }) {
    return this.prisma.ipWhitelist.create({ data });
  }

  async removeIpWhitelist(id: string) {
    return this.prisma.ipWhitelist.delete({ where: { id } });
  }

  async getIpBlacklist() { return this.prisma.ipBlacklist.findMany({ orderBy: { createdAt: 'desc' } }); }

  async addIpBlacklist(data: { ipAddress: string; reason?: string; createdBy: string; expiresAt?: string }) {
    return this.prisma.ipBlacklist.create({
      data: {
        ipAddress: data.ipAddress,
        reason: data.reason,
        createdBy: data.createdBy,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
  }

  async removeIpBlacklist(id: string) {
    return this.prisma.ipBlacklist.delete({ where: { id } });
  }

  async getDevices() {
    return this.prisma.userDevice.findMany({
      orderBy: { lastUsedAt: 'desc' },
      take: 100,
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async revokeDevice(id: string) {
    return this.prisma.userDevice.delete({ where: { id } });
  }

  async getSessions() {
    return this.prisma.userSession.findMany({
      where: { isActive: true },
      orderBy: { lastActivity: 'desc' },
      take: 100,
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async terminateSession(id: string) {
    return this.prisma.userSession.update({ where: { id }, data: { isActive: false } });
  }
}
