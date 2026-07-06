import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../common/prisma.service';
import { AuthHelpersService } from '../../../common/utils/auth-helpers.service';
import * as crypto from 'crypto';

@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authHelpers: AuthHelpersService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        adminProfile: true,
        adminRoles: { include: { role: true } },
      },
    });

    if (!user) {
      await this.logLoginAttempt(null, email, false, 'USER_NOT_FOUND');
      throw new UnauthorizedException('Invalid email or password');
    }

    const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.adminRoles.length > 0;
    if (!isAdmin) {
      await this.logLoginAttempt(user.id, email, false, 'NOT_ADMIN');
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'BANNED') {
      await this.logLoginAttempt(user.id, email, false, 'ACCOUNT_BANNED');
      throw new UnauthorizedException('Your account has been banned');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await this.logLoginAttempt(user.id, email, false, 'ACCOUNT_LOCKED');
      const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(`Account is locked. Try again in ${minutes} minutes`);
    }

    const isValidPassword = await this.authHelpers.comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      const attempts = user.loginAttempts + 1;
      const updateData: any = { loginAttempts: attempts };
      if (attempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await this.prisma.user.update({ where: { id: user.id }, data: updateData });
      await this.logLoginAttempt(user.id, email, false, 'INVALID_PASSWORD');
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const permissions = await this.getUserPermissions(user.id);

    const accessToken = this.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken,
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await this.logLoginAttempt(user.id, email, true, null);

    return {
      accessToken,
      refreshToken,
      admin: {
        id: user.id,
        email: user.email,
        role: user.role,
        roles: user.adminRoles.map(ur => ur.role.name),
        permissions,
        profile: {
          firstName: (user as any).freelancerProfile?.firstName || (user as any).clientProfile?.companyName || '',
          lastName: (user as any).freelancerProfile?.lastName || '',
        },
      },
    };
  }

  async logout(userId: string) {
    await this.prisma.userSession.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
  }

  async refreshToken(token: string) {
    const session = await this.prisma.userSession.findUnique({
      where: { refreshToken: token },
      include: { user: true },
    });

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = session.user;
    const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
    if (!isAdmin) {
      throw new UnauthorizedException('Not an admin account');
    }

    const permissions = await this.getUserPermissions(user.id);
    const accessToken = this.generateAccessToken(user.id, user.email, user.role);

    return { accessToken };
  }

  async getSessions(userId: string) {
    return this.prisma.userSession.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async terminateSession(userId: string, sessionId: string) {
    await this.prisma.userSession.updateMany({
      where: { id: sessionId, userId },
      data: { isActive: false },
    });
  }

  async getLoginHistory(userId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.prisma.adminLoginHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.adminLoginHistory.count({ where: { userId } }),
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

  private async getUserPermissions(userId: string): Promise<string[]> {
    const roles = await this.prisma.adminUserRole.findMany({
      where: { userId },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } },
        },
      },
    });

    const permissions = roles.flatMap(ur =>
      ur.role.permissions.map(rp => `${rp.permission.module}_${rp.permission.action}`)
    );
    return [...new Set(permissions)];
  }

  private generateAccessToken(userId: string, email: string, role: string): string {
    const payload = { sub: userId, email, role, type: 'admin' };
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(userId: string): string {
    return crypto.randomUUID();
  }

  private async logLoginAttempt(userId: string | null, email: string, success: boolean, failReason: string | null) {
    try {
      await this.prisma.adminLoginHistory.create({
        data: {
          userId: userId || '00000000-0000-0000-0000-000000000000',
          ipAddress: 'unknown',
          success,
          failReason,
        },
      });
    } catch (e) {
      this.logger.error('Failed to log login attempt', e);
    }
  }
}
