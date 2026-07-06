import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export interface PermissionRequirement {
  module: string;
  action: string;
}

export const ADMIN_PERMISSIONS_KEY = 'admin_permissions';

@Injectable()
export class AdminPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionRequirement[]>(
      ADMIN_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    const hasAllPermissions = requiredPermissions.every(req =>
      user.permissions?.includes(`${req.module}_${req.action}`)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }

    return true;
  }
}
