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
exports.AdminUsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminUsersService = class AdminUsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listUsers(params) {
        const { search, role, status, verified, dateFrom, dateTo, sortBy = 'createdAt', sortOrder = 'desc', page = 1, pageSize = 20 } = params;
        const skip = (page - 1) * pageSize;
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { freelancerProfile: { firstName: { contains: search, mode: 'insensitive' } } },
                { freelancerProfile: { lastName: { contains: search, mode: 'insensitive' } } },
                { clientProfile: { companyName: { contains: search, mode: 'insensitive' } } },
            ];
        }
        if (role)
            where.role = role;
        if (status)
            where.status = status;
        if (verified === 'true')
            where.emailVerifiedAt = { not: null };
        if (verified === 'false')
            where.emailVerifiedAt = null;
        if (dateFrom)
            where.createdAt = { ...where.createdAt, gte: new Date(dateFrom) };
        if (dateTo)
            where.createdAt = { ...where.createdAt, lte: new Date(dateTo) };
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
    async getUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                freelancerProfile: { include: { skills: { include: { skill: true } } } },
                clientProfile: true,
                adminRoles: { include: { role: true } },
                badges: { include: { badge: true } },
            },
        });
        if (!user || user.deletedAt)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateUser(id, data) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({ where: { id }, data });
    }
    async updateStatus(id, status) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({ where: { id }, data: { status: status } });
    }
    async banUser(id, reason, durationMinutes) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const updateData = { status: 'BANNED' };
        if (durationMinutes) {
            updateData.lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
        }
        return this.prisma.user.update({ where: { id }, data: updateData });
    }
    async unbanUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({ where: { id }, data: { status: 'ACTIVE', lockedUntil: null, loginAttempts: 0 } });
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), email: `deleted-${Date.now()}-${user.email}` },
        });
    }
    async resetPassword(id, newPassword) {
        const bcrypt = require('bcrypt');
        const passwordHash = await bcrypt.hash(newPassword, 12);
        return this.prisma.user.update({ where: { id }, data: { passwordHash } });
    }
    async changeRole(id, role) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({ where: { id }, data: { role: role } });
    }
    async getUserActivity(id, page = 1, pageSize = 20) {
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
};
exports.AdminUsersService = AdminUsersService;
exports.AdminUsersService = AdminUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminUsersService);
//# sourceMappingURL=users.service.js.map