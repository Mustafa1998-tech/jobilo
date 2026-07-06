export declare const ADMIN_PERMISSIONS_KEY = "admin_permissions";
export interface PermissionRequirement {
    module: string;
    action: string;
}
export declare const AdminPermissions: (permissions: PermissionRequirement) => import("@nestjs/common").CustomDecorator<string>;
export declare const AdminPermissionsMulti: (permissions: PermissionRequirement[]) => import("@nestjs/common").CustomDecorator<string>;
