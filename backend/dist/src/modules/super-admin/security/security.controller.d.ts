import { AdminSecurityService } from './security.service';
export declare class AdminSecurityController {
    private readonly service;
    constructor(service: AdminSecurityService);
    getIpWhitelist(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ipAddress: string;
        isActive: boolean;
        label: string | null;
        createdBy: string;
    }[]>;
    addIpWhitelist(body: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ipAddress: string;
        isActive: boolean;
        label: string | null;
        createdBy: string;
    }>;
    removeIpWhitelist(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ipAddress: string;
        isActive: boolean;
        label: string | null;
        createdBy: string;
    }>;
    getIpBlacklist(): Promise<{
        id: string;
        createdAt: Date;
        expiresAt: Date | null;
        ipAddress: string;
        isActive: boolean;
        reason: string | null;
        createdBy: string;
    }[]>;
    addIpBlacklist(body: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        expiresAt: Date | null;
        ipAddress: string;
        isActive: boolean;
        reason: string | null;
        createdBy: string;
    }>;
    removeIpBlacklist(id: string): Promise<{
        id: string;
        createdAt: Date;
        expiresAt: Date | null;
        ipAddress: string;
        isActive: boolean;
        reason: string | null;
        createdBy: string;
    }>;
    getDevices(): Promise<({
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        ipAddress: string | null;
        platform: string | null;
        deviceId: string;
        browser: string | null;
        os: string | null;
        isTrusted: boolean;
        lastUsedAt: Date;
    })[]>;
    revokeDevice(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        ipAddress: string | null;
        platform: string | null;
        deviceId: string;
        browser: string | null;
        os: string | null;
        isTrusted: boolean;
        lastUsedAt: Date;
    }>;
    getSessions(): Promise<({
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        refreshToken: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        isActive: boolean;
        lastActivity: Date;
    })[]>;
    terminateSession(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        refreshToken: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        isActive: boolean;
        lastActivity: Date;
    }>;
}
