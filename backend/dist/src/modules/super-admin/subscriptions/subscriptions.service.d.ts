import { PrismaService } from '../../../common/prisma.service';
export declare class AdminSubscriptionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listPlans(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
        nameAr: string | null;
        descriptionAr: string | null;
        features: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    getPlan(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
        nameAr: string | null;
        descriptionAr: string | null;
        features: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    createPlan(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
        nameAr: string | null;
        descriptionAr: string | null;
        features: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    updatePlan(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
        nameAr: string | null;
        descriptionAr: string | null;
        features: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    deletePlan(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
        nameAr: string | null;
        descriptionAr: string | null;
        features: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    togglePlan(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
        nameAr: string | null;
        descriptionAr: string | null;
        features: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    listSubscriptions(params: {
        status?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
            };
            plan: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            planId: string;
            currentPeriodStart: Date;
            currentPeriodEnd: Date;
            canceledAt: Date | null;
            trialEndsAt: Date | null;
        })[];
        meta: {
            page: number;
            pageSize: number;
            totalCount: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
}
