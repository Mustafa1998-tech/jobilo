import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export interface PermissionRequirement {
    module: string;
    action: string;
}
export declare const ADMIN_PERMISSIONS_KEY = "admin_permissions";
export declare class AdminPermissionsGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
