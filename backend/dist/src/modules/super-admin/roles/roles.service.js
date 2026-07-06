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
exports.AdminRolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminRolesService = class AdminRolesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listRoles() {
        return this.prisma.adminRole.findMany({
            orderBy: { priority: 'asc' },
            include: {
                _count: { select: { users: true, permissions: true } },
            },
        });
    }
    async getRole(id) {
        const role = await this.prisma.adminRole.findUnique({
            where: { id },
            include: {
                permissions: { include: { permission: true } },
                users: { include: { user: { select: { id: true, email: true } } } },
            },
        });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        return role;
    }
    async createRole(data) {
        return this.prisma.adminRole.create({ data });
    }
    async updateRole(id, data) {
        return this.prisma.adminRole.update({ where: { id }, data });
    }
    async deleteRole(id) {
        const role = await this.prisma.adminRole.findUnique({ where: { id } });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        if (role.isSystem)
            throw new common_1.BadRequestException('Cannot delete system role');
        return this.prisma.adminRole.delete({ where: { id } });
    }
    async updatePermissions(id, permissionIds) {
        await this.prisma.adminRolePermission.deleteMany({ where: { roleId: id } });
        if (permissionIds.length > 0) {
            await this.prisma.adminRolePermission.createMany({
                data: permissionIds.map(permissionId => ({ roleId: id, permissionId })),
            });
        }
        return this.getRole(id);
    }
    async listPermissions() {
        return this.prisma.adminPermission.findMany({
            orderBy: [{ module: 'asc' }, { action: 'asc' }],
        });
    }
};
exports.AdminRolesService = AdminRolesService;
exports.AdminRolesService = AdminRolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminRolesService);
//# sourceMappingURL=roles.service.js.map