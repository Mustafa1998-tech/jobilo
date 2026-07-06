import { AdminAnalyticsService } from './analytics.service';
export declare class AdminAnalyticsController {
    private readonly service;
    constructor(service: AdminAnalyticsService);
    getOverview(): Promise<{
        newUsersThisMonth: number;
        newUsersLastMonth: number;
        userGrowth: number;
        userGrowthRate: number;
        newProjectsThisMonth: number;
        newContractsThisMonth: number;
    }>;
    getUserAnalytics(): Promise<{
        usersByRole: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.UserGroupByOutputType, "role"[]> & {
            _count: number;
        })[];
        usersByMonth: unknown;
    }>;
    getRevenueAnalytics(): Promise<{
        revenueByMonth: any[];
    }>;
    getTopSkills(limit?: number): Promise<{
        skill: {
            id: string;
            name: string;
            nameAr: string;
        };
        count: number;
    }[]>;
    getTopFreelancers(limit?: number): Promise<({
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        title: string | null;
        bio: string | null;
        avatarUrl: string | null;
        bannerUrl: string | null;
        hourlyRate: import("@prisma/client-runtime-utils").Decimal | null;
        fixedRate: import("@prisma/client-runtime-utils").Decimal | null;
        experienceLevel: import(".prisma/client").$Enums.SkillLevel;
        yearsExperience: number | null;
        availableForHire: boolean;
        isVerified: boolean;
        verifiedAt: Date | null;
        totalProjects: number;
        totalHours: import("@prisma/client-runtime-utils").Decimal | null;
        averageRating: import("@prisma/client-runtime-utils").Decimal | null;
        completedProjects: number;
        responseTime: number | null;
        responseRate: import("@prisma/client-runtime-utils").Decimal | null;
        languages: import("@prisma/client/runtime/client").JsonValue | null;
        education: import("@prisma/client/runtime/client").JsonValue | null;
        certifications: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
    })[]>;
    getTopClients(limit?: number): Promise<({
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        bannerUrl: string | null;
        isVerified: boolean;
        verifiedAt: Date | null;
        averageRating: import("@prisma/client-runtime-utils").Decimal | null;
        userId: string;
        companyName: string;
        companyWebsite: string | null;
        companySize: string | null;
        industry: string | null;
        logoUrl: string | null;
        location: string | null;
        totalProjectsPosted: number;
        hireRate: import("@prisma/client-runtime-utils").Decimal | null;
    })[]>;
}
