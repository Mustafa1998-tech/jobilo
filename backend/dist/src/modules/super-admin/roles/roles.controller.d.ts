import { AdminRolesService } from './roles.service';
export declare class AdminRolesController {
    private readonly service;
    constructor(service: AdminRolesService);
    listRoles(): Promise<({
        _count: {
            users: number;
            permissions: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        nameAr: string | null;
        isSystem: boolean;
        priority: number;
    })[]>;
    getRole(id: string): Promise<{
        users: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            createdAt: Date;
            userId: string;
            roleId: string;
        })[];
        permissions: ({
            permission: {
                id: string;
                createdAt: Date;
                description: string | null;
                action: import(".prisma/client").$Enums.AdminAction;
                module: import(".prisma/client").$Enums.AdminModule;
            };
        } & {
            createdAt: Date;
            roleId: string;
            permissionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        nameAr: string | null;
        isSystem: boolean;
        priority: number;
    }>;
    createRole(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        nameAr: string | null;
        isSystem: boolean;
        priority: number;
    }>;
    updateRole(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        nameAr: string | null;
        isSystem: boolean;
        priority: number;
    }>;
    deleteRole(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        nameAr: string | null;
        isSystem: boolean;
        priority: number;
    }>;
    updatePermissions(id: string, permissionIds: string[]): Promise<{
        users: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            createdAt: Date;
            userId: string;
            roleId: string;
        })[];
        permissions: ({
            permission: {
                id: string;
                createdAt: Date;
                description: string | null;
                action: import(".prisma/client").$Enums.AdminAction;
                module: import(".prisma/client").$Enums.AdminModule;
            };
        } & {
            createdAt: Date;
            roleId: string;
            permissionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        nameAr: string | null;
        isSystem: boolean;
        priority: number;
    }>;
    listPermissions(): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        action: import(".prisma/client").$Enums.AdminAction;
        module: import(".prisma/client").$Enums.AdminModule;
    }[]>;
}
