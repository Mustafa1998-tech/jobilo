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
var AdminAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../../common/prisma.service");
const auth_helpers_service_1 = require("../../../common/utils/auth-helpers.service");
const crypto = require("crypto");
let AdminAuthService = AdminAuthService_1 = class AdminAuthService {
    constructor(prisma, jwtService, configService, authHelpers) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.authHelpers = authHelpers;
        this.logger = new common_1.Logger(AdminAuthService_1.name);
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                adminProfile: true,
                adminRoles: { include: { role: true } },
            },
        });
        if (!user) {
            await this.logLoginAttempt(null, email, false, 'USER_NOT_FOUND');
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.adminRoles.length > 0;
        if (!isAdmin) {
            await this.logLoginAttempt(user.id, email, false, 'NOT_ADMIN');
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.status === 'BANNED') {
            await this.logLoginAttempt(user.id, email, false, 'ACCOUNT_BANNED');
            throw new common_1.UnauthorizedException('Your account has been banned');
        }
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            await this.logLoginAttempt(user.id, email, false, 'ACCOUNT_LOCKED');
            const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
            throw new common_1.UnauthorizedException(`Account is locked. Try again in ${minutes} minutes`);
        }
        const isValidPassword = await this.authHelpers.comparePassword(password, user.passwordHash);
        if (!isValidPassword) {
            const attempts = user.loginAttempts + 1;
            const updateData = { loginAttempts: attempts };
            if (attempts >= 5) {
                updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            }
            await this.prisma.user.update({ where: { id: user.id }, data: updateData });
            await this.logLoginAttempt(user.id, email, false, 'INVALID_PASSWORD');
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date(), lastIp: email },
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
                    firstName: user.freelancerProfile?.firstName || user.clientProfile?.companyName || '',
                    lastName: user.freelancerProfile?.lastName || '',
                },
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
            include: { user: true },
        });
        if (!session || !session.isActive || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const user = session.user;
        const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
        if (!isAdmin) {
            throw new common_1.UnauthorizedException('Not an admin account');
        }
        const permissions = await this.getUserPermissions(user.id);
        const accessToken = this.generateAccessToken(user.id, user.email, user.role);
        return { accessToken };
    }
    async getSessions(userId) {
        return this.prisma.userSession.findMany({
            where: { userId, isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async terminateSession(userId, sessionId) {
        await this.prisma.userSession.updateMany({
            where: { id: sessionId, userId },
            data: { isActive: false },
        });
    }
    async getLoginHistory(userId, page = 1, pageSize = 20) {
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
    async getUserPermissions(userId) {
        const roles = await this.prisma.adminUserRole.findMany({
            where: { userId },
            include: {
                role: {
                    include: { permissions: { include: { permission: true } } },
                },
            },
        });
        const permissions = roles.flatMap(ur => ur.role.permissions.map(rp => `${rp.permission.module}_${rp.permission.action}`));
        return [...new Set(permissions)];
    }
    generateAccessToken(userId, email, role) {
        const payload = { sub: userId, email, role, type: 'admin' };
        const secret = this.configService.get('JWT_ACCESS_SECRET') || 'dev-access-secret';
        return this.jwtService.sign(payload, {
            secret,
            expiresIn: '15m',
        });
    }
    generateRefreshToken(userId) {
        return crypto.randomUUID();
    }
    async logLoginAttempt(userId, email, success, failReason) {
        try {
            await this.prisma.adminLoginHistory.create({
                data: {
                    userId: userId || '00000000-0000-0000-0000-000000000000',
                    ipAddress: 'unknown',
                    success,
                    failReason,
                },
            });
        }
        catch (e) {
            this.logger.error('Failed to log login attempt', e);
        }
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = AdminAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        auth_helpers_service_1.AuthHelpersService])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map