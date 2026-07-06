"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../../common/prisma.service");
const auth_helpers_service_1 = require("../../common/utils/auth-helpers.service");
let AuthService = class AuthService {
    constructor(prisma, helpers) {
        this.prisma = prisma;
        this.helpers = helpers;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        if (dto.password !== dto.confirmPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
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
    async login(dto) {
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
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.status === 'BANNED') {
            throw new common_1.UnauthorizedException('Account has been banned');
        }
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new common_1.UnauthorizedException('Account is locked. Try again later.');
        }
        const isValid = await this.helpers.comparePassword(dto.password, user.passwordHash);
        if (!isValid) {
            const attempts = user.loginAttempts + 1;
            const updateData = { loginAttempts: attempts };
            if (attempts >= 5) {
                updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            }
            await this.prisma.user.update({ where: { id: user.id }, data: updateData });
            throw new common_1.UnauthorizedException('Invalid email or password');
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
        const tokenId = (0, uuid_1.v4)();
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
    async logout(userId) {
        await this.prisma.userSession.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false },
        });
    }
    async refreshToken(token) {
        const session = await this.prisma.userSession.findUnique({
            where: { refreshToken: token },
            include: { user: { select: { id: true, email: true, role: true, status: true } } },
        });
        if (!session || !session.isActive || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        if (session.user.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException('Account is not active');
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
    async verifyEmail(dto) {
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
            throw new common_1.BadRequestException('Invalid or expired OTP');
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
    async resendVerification(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true, status: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.status === 'ACTIVE')
            throw new common_1.BadRequestException('Email already verified');
        const recentCodes = await this.prisma.emailVerification.count({
            where: {
                email,
                type: 'verification',
                createdAt: { gt: new Date(Date.now() - 60 * 1000) },
            },
        });
        if (recentCodes >= 1) {
            throw new common_1.BadRequestException('Please wait 1 minute before requesting a new code');
        }
        const dailyCount = await this.prisma.emailVerification.count({
            where: {
                email,
                type: 'verification',
                createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            },
        });
        if (dailyCount >= 5) {
            throw new common_1.BadRequestException('Maximum daily verification requests reached');
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
        return { message: 'Verification code sent' };
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true },
        });
        if (!user) {
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
        return { message: 'If the email exists, a reset code has been sent' };
    }
    async resetPassword(dto) {
        if (dto.password !== dto.confirmPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
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
            throw new common_1.BadRequestException('Invalid or expired reset code');
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
    async changePassword(userId, dto) {
        if (dto.newPassword !== dto.confirmNewPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { passwordHash: true },
        });
        const isValid = await this.helpers.comparePassword(dto.currentPassword, user.passwordHash);
        if (!isValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const passwordHash = await this.helpers.hashPassword(dto.newPassword);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
        return { message: 'Password changed successfully' };
    }
    async getSessions(userId) {
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
    async terminateSession(userId, sessionId) {
        const session = await this.prisma.userSession.findFirst({
            where: { id: sessionId, userId },
        });
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        await this.prisma.userSession.update({
            where: { id: sessionId },
            data: { isActive: false },
        });
    }
    async terminateAllSessions(userId) {
        await this.prisma.userSession.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_helpers_service_1.AuthHelpersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map