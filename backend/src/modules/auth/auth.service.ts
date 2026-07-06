import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { PrismaService } from '../../common/prisma.service';
import { AuthHelpersService } from '../../common/utils/auth-helpers.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helpers: AuthHelpersService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const passwordHash = await this.helpers.hashPassword(dto.password);
    const otp = this.helpers.generateOtp();

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: dto.role,
        locale: dto.locale || 'ar',
        freelancerProfile: dto.role === 'FREELANCER' ? {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        } : undefined,
        clientProfile: dto.role === 'CLIENT' ? {
          create: {
            companyName: `${dto.firstName} ${dto.lastName}`,
          },
        } : undefined,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    await this.prisma.emailVerification.create({
      data: {
        email: dto.email,
        otp,
        type: 'verification',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // TODO: Send email with OTP via Resend

    const accessToken = this.helpers.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Registration successful. Please verify your email.',
      accessToken,
      user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        status: true,
        loginAttempts: true,
        lockedUntil: true,
        locale: true,
        freelancerProfile: { select: { firstName: true, lastName: true, avatarUrl: true } },
        clientProfile: { select: { companyName: true, logoUrl: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'BANNED') {
      throw new UnauthorizedException('Account has been banned');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is locked. Try again later.');
    }

    const isValid = await this.helpers.comparePassword(dto.password, user.passwordHash);
    if (!isValid) {
      const attempts = user.loginAttempts + 1;
      const updateData: any = { loginAttempts: attempts };
      if (attempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await this.prisma.user.update({ where: { id: user.id }, data: updateData });
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const accessToken = this.helpers.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const tokenId = uuid();
    const refreshToken = this.helpers.generateRefreshToken({
      sub: user.id,
      tokenId,
      type: 'refresh',
    });

    const expiryMs = dto.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + expiryMs),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        locale: user.locale,
        profile: user.freelancerProfile || user.clientProfile,
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
      include: { user: { select: { id: true, email: true, role: true, status: true } } },
    });

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (session.user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    const accessToken = this.helpers.generateAccessToken({
      sub: session.user.id,
      email: session.user.email,
      role: session.user.role,
    });

    await this.prisma.userSession.update({
      where: { id: session.id },
      data: { lastActivity: new Date() },
    });

    return { accessToken };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const verification = await this.prisma.emailVerification.findFirst({
      where: {
        email: dto.email,
        otp: dto.otp,
        type: 'verification',
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.emailVerification.update({
      where: { id: verification.id },
      data: { usedAt: new Date() },
    });

    await this.prisma.user.update({
      where: { email: dto.email },
      data: { status: 'ACTIVE', emailVerifiedAt: new Date() },
    });

    return { message: 'Email verified successfully' };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, status: true },
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.status === 'ACTIVE') throw new BadRequestException('Email already verified');

    const recentCodes = await this.prisma.emailVerification.count({
      where: {
        email,
        type: 'verification',
        createdAt: { gt: new Date(Date.now() - 60 * 1000) },
      },
    });

    if (recentCodes >= 1) {
      throw new BadRequestException('Please wait 1 minute before requesting a new code');
    }

    const dailyCount = await this.prisma.emailVerification.count({
      where: {
        email,
        type: 'verification',
        createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    if (dailyCount >= 5) {
      throw new BadRequestException('Maximum daily verification requests reached');
    }

    const otp = this.helpers.generateOtp();
    await this.prisma.emailVerification.create({
      data: {
        email,
        otp,
        type: 'verification',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // TODO: Send email

    return { message: 'Verification code sent' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset code has been sent' };
    }

    const otp = this.helpers.generateOtp();
    await this.prisma.emailVerification.create({
      data: {
        email: dto.email,
        otp,
        type: 'password_reset',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    // TODO: Send email with reset code

    return { message: 'If the email exists, a reset code has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const verification = await this.prisma.emailVerification.findFirst({
      where: {
        email: dto.email,
        otp: dto.otp,
        type: 'password_reset',
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    const passwordHash = await this.helpers.hashPassword(dto.password);

    await this.prisma.$transaction([
      this.prisma.emailVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { email: dto.email },
        data: { passwordHash },
      }),
    ]);

    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    const isValid = await this.helpers.comparePassword(dto.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await this.helpers.hashPassword(dto.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password changed successfully' };
  }

  async getSessions(userId: string) {
    return this.prisma.userSession.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        lastActivity: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { lastActivity: 'desc' },
    });
  }

  async terminateSession(userId: string, sessionId: string) {
    const session = await this.prisma.userSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) throw new NotFoundException('Session not found');

    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }

  async terminateAllSessions(userId: string) {
    await this.prisma.userSession.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
  }
}
