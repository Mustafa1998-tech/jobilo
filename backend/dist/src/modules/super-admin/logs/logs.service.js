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
exports.AdminLogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminLogsService = class AdminLogsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async paginate(model, where, page, pageSize, orderBy, include) {
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
    async getAuditLogs(params) {
        const { userId, action, module, page = 1, pageSize = 20 } = params;
        const where = {};
        if (userId)
            where.userId = userId;
        if (action)
            where.action = { contains: action, mode: 'insensitive' };
        if (module)
            where.module = module;
        return this.paginate(this.prisma.adminActivityLog, where, page, pageSize, { createdAt: 'desc' }, { user: { select: { id: true, email: true } } });
    }
    async getLoginLogs(params) {
        const { userId, success, page = 1, pageSize = 20 } = params;
        const where = {};
        if (userId)
            where.userId = userId;
        if (success !== undefined)
            where.success = success === 'true';
        return this.paginate(this.prisma.adminLoginHistory, where, page, pageSize, { createdAt: 'desc' }, { user: { select: { id: true, email: true } } });
    }
    async getErrorLogs(params) {
        const { level, resolved, page = 1, pageSize = 20 } = params;
        const where = {};
        if (level)
            where.level = level;
        if (resolved !== undefined)
            where.resolved = resolved === 'true';
        return this.paginate(this.prisma.errorLog, where, page, pageSize, { createdAt: 'desc' });
    }
    async getSecurityLogs(params) {
        const { type, severity, page = 1, pageSize = 20 } = params;
        const where = {};
        if (type)
            where.type = type;
        if (severity)
            where.severity = severity;
        return this.paginate(this.prisma.securityLog, where, page, pageSize, { createdAt: 'desc' }, { user: { select: { id: true, email: true } } });
    }
};
exports.AdminLogsService = AdminLogsService;
exports.AdminLogsService = AdminLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminLogsService);
//# sourceMappingURL=logs.service.js.map