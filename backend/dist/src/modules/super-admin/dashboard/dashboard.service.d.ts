import { PrismaService } from '../../../common/prisma.service';
export declare class AdminDashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalUsers: number;
        totalClients: number;
        totalFreelancers: number;
        totalCompanies: number;
        openProjects: number;
        completedProjects: number;
        canceledProjects: number;
        pendingReports: number;
        activeDisputes: number;
        totalMessages: number;
        activeUsers: number;
        bannedUsers: number;
    }>;
    getRevenue(): Promise<{
        totalRevenue: number;
        dailyRevenue: number;
        monthlyRevenue: number;
        yearlyRevenue: number;
        paidSubscriptions: number;
    }>;
    getRecentRegistrations(limit?: number): Promise<{
        freelancerProfile: {
            firstName: string;
            lastName: string;
        };
        clientProfile: {
            companyName: string;
        };
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }[]>;
    getRecentActivity(limit?: number): Promise<({
        user: {
            freelancerProfile: {
                firstName: string;
                lastName: string;
            };
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        ipAddress: string | null;
        action: string;
        userAgent: string | null;
        module: string;
        resourceId: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    })[]>;
}
