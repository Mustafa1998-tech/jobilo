import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminLogsService {
  constructor(private readonly prisma: PrismaService) {}

  private async paginate<T>(
    model: any,
    where: any,
    page: number,
    pageSize: number,
    orderBy: any,
    include?: any,
  ) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      model.findMany({ where, orderBy, skip, take: pageSize, ...(include ? { include } : {}) }),
      model.count({ where }),
    ]);
    return {
      data,
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

  async getAuditLogs(params: { userId?: string; action?: string; module?: string; page?: number; pageSize?: number }) {
    const { userId, action, module, page = 1, pageSize = 20 } = params;
    const where: any = {};
    if (userId) where.userId = userId;
    if (action) where.action = { contains: action, mode: 'insensitive' };
    if (module) where.module = module;
    return this.paginate(this.prisma.adminActivityLog, where, page, pageSize, { createdAt: 'desc' }, { user: { select: { id: true, email: true } } });
  }

  async getLoginLogs(params: { userId?: string; success?: string; page?: number; pageSize?: number }) {
    const { userId, success, page = 1, pageSize = 20 } = params;
    const where: any = {};
    if (userId) where.userId = userId;
    if (success !== undefined) where.success = success === 'true';
    return this.paginate(this.prisma.adminLoginHistory, where, page, pageSize, { createdAt: 'desc' }, { user: { select: { id: true, email: true } } });
  }

  async getErrorLogs(params: { level?: string; resolved?: string; page?: number; pageSize?: number }) {
    const { level, resolved, page = 1, pageSize = 20 } = params;
    const where: any = {};
    if (level) where.level = level;
    if (resolved !== undefined) where.resolved = resolved === 'true';
    return this.paginate(this.prisma.errorLog, where, page, pageSize, { createdAt: 'desc' });
  }

  async getSecurityLogs(params: { type?: string; severity?: string; page?: number; pageSize?: number }) {
    const { type, severity, page = 1, pageSize = 20 } = params;
    const where: any = {};
    if (type) where.type = type;
    if (severity) where.severity = severity;
    return this.paginate(this.prisma.securityLog, where, page, pageSize, { createdAt: 'desc' }, { user: { select: { id: true, email: true } } });
  }
}
