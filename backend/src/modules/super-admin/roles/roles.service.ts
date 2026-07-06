import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminRolesService {
  constructor(private readonly prisma: PrismaService) {}

  async listRoles() {
    return this.prisma.adminRole.findMany({
      orderBy: { priority: 'asc' },
      include: {
        _count: { select: { users: true, permissions: true } },
      },
    });
  }

  async getRole(id: string) {
    const role = await this.prisma.adminRole.findUnique({
      where: { id },
      include: {
        permissions: { include: { permission: true } },
        users: { include: { user: { select: { id: true, email: true } } } },
      },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async createRole(data: { name: string; nameAr?: string; description?: string; priority?: number }) {
    return this.prisma.adminRole.create({ data });
  }

  async updateRole(id: string, data: any) {
    return this.prisma.adminRole.update({ where: { id }, data });
  }

  async deleteRole(id: string) {
    const role = await this.prisma.adminRole.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    if (role.isSystem) throw new BadRequestException('Cannot delete system role');
    return this.prisma.adminRole.delete({ where: { id } });
  }

  async updatePermissions(id: string, permissionIds: string[]) {
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
}
