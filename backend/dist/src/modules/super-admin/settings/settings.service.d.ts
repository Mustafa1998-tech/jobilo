import { PrismaService } from '../../../common/prisma.service';
export declare class AdminSettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getSetting;
    private setSetting;
    getPlatform(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updatePlatform(value: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
    getEmail(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updateEmail(value: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
    getStorage(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updateStorage(value: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
    getAi(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updateAi(value: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
    getNotifications(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updateNotifications(value: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
    getSeo(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updateSeo(value: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
    getSecurity(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updateSecurity(value: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
}
