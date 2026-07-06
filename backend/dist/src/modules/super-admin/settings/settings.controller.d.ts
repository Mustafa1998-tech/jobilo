import { AdminSettingsService } from './settings.service';
export declare class AdminSettingsController {
    private readonly service;
    constructor(service: AdminSettingsService);
    getPlatform(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updatePlatform(body: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
    getEmail(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updateEmail(body: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
    getStorage(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updateStorage(body: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
    getAi(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updateAi(body: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
    getNotifications(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updateNotifications(body: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
    getSeo(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updateSeo(body: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
    getSecurity(): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray>;
    updateSecurity(body: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/client").JsonValue;
        key: string;
        updatedBy: string | null;
    }>;
}
