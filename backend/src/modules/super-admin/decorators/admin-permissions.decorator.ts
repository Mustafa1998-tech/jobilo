import { SetMetadata } from '@nestjs/common';

export const ADMIN_PERMISSIONS_KEY = 'admin_permissions';

export interface PermissionRequirement {
  module: string;
  action: string;
}

export const AdminPermissions = (permissions: PermissionRequirement) =>
  SetMetadata(ADMIN_PERMISSIONS_KEY, [permissions]);

export const AdminPermissionsMulti = (permissions: PermissionRequirement[]) =>
  SetMetadata(ADMIN_PERMISSIONS_KEY, permissions);
