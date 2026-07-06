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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
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
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateProfile(userId, role, data) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
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
                        data: skills.map((s) => ({
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
    async deleteAccount(userId) {
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
    async getPublicProfile(userId) {
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
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async getUserPortfolio(userId) {
        return this.prisma.portfolio.findMany({
            where: { userId },
            orderBy: { sortOrder: 'asc' },
            include: { category: true },
        });
    }
    async getUserReviews(userId) {
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
    async listUsers(query) {
        const page = query.page || 1;
        const pageSize = Math.min(query.pageSize || 20, 100);
        const skip = (page - 1) * pageSize;
        const where = { deletedAt: null };
        if (query.role)
            where.role = query.role;
        if (query.status)
            where.status = query.status;
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
    async changeRole(userId, role) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { role: role },
            select: { id: true, email: true, role: true },
        });
    }
    async changeStatus(userId, status) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: status },
            select: { id: true, email: true, status: true },
        });
    }
    async verifyUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role === 'FREELANCER') {
            await this.prisma.freelancerProfile.update({
                where: { userId },
                data: { isVerified: true, verifiedAt: new Date() },
            });
        }
        else {
            await this.prisma.clientProfile.update({
                where: { userId },
                data: { isVerified: true, verifiedAt: new Date() },
            });
        }
        return { message: 'User verified successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map