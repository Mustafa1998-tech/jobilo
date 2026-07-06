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
exports.AdminSecurityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminSecurityService = class AdminSecurityService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getIpWhitelist() { return this.prisma.ipWhitelist.findMany({ orderBy: { createdAt: 'desc' } }); }
    async addIpWhitelist(data) {
        return this.prisma.ipWhitelist.create({ data });
    }
    async removeIpWhitelist(id) {
        return this.prisma.ipWhitelist.delete({ where: { id } });
    }
    async getIpBlacklist() { return this.prisma.ipBlacklist.findMany({ orderBy: { createdAt: 'desc' } }); }
    async addIpBlacklist(data) {
        return this.prisma.ipBlacklist.create({
            data: {
                ipAddress: data.ipAddress,
                reason: data.reason,
                createdBy: data.createdBy,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            },
        });
    }
    async removeIpBlacklist(id) {
        return this.prisma.ipBlacklist.delete({ where: { id } });
    }
    async getDevices() {
        return this.prisma.userDevice.findMany({
            orderBy: { lastUsedAt: 'desc' },
            take: 100,
            include: { user: { select: { id: true, email: true } } },
        });
    }
    async revokeDevice(id) {
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
    async terminateSession(id) {
        return this.prisma.userSession.update({ where: { id }, data: { isActive: false } });
    }
};
exports.AdminSecurityService = AdminSecurityService;
exports.AdminSecurityService = AdminSecurityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminSecurityService);
//# sourceMappingURL=security.service.js.map