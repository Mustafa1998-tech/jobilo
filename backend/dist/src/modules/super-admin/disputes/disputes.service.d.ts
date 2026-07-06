import { PrismaService } from '../../../common/prisma.service';
export declare class AdminDisputesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listDisputes(params: {
        status?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        data: ({
            project: {
                id: string;
                title: string;
            };
            contract: {
                id: string;
            };
            opener: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.DisputeStatus;
            createdAt: Date;
            updatedAt: Date;
            contractId: string;
            projectId: string;
            reason: string;
            openedBy: string;
            resolution: string | null;
            resolvedBy: string | null;
            resolvedAt: Date | null;
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
    getDispute(id: string): Promise<{
        project: {
            id: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            experienceLevel: import(".prisma/client").$Enums.SkillLevel;
            location: string | null;
            categoryId: string;
            isFeatured: boolean;
            slug: string;
            projectType: string;
            budgetMin: import("@prisma/client-runtime-utils").Decimal | null;
            budgetMax: import("@prisma/client-runtime-utils").Decimal | null;
            isUrgent: boolean;
            proposalsCount: number;
            clientId: string;
            budgetFixed: import("@prisma/client-runtime-utils").Decimal | null;
            hourlyMin: import("@prisma/client-runtime-utils").Decimal | null;
            hourlyMax: import("@prisma/client-runtime-utils").Decimal | null;
            durationDays: number;
            isNdaRequired: boolean;
            averageBid: import("@prisma/client-runtime-utils").Decimal | null;
            viewsCount: number;
            savedCount: number;
            publishedAt: Date | null;
            closedAt: Date | null;
        };
        contract: {
            client: {
                clientProfile: {
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
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                emailVerifiedAt: Date | null;
                phoneVerifiedAt: Date | null;
                passwordHash: string;
                role: import(".prisma/client").$Enums.UserRole;
                status: import(".prisma/client").$Enums.UserStatus;
                isProfileComplete: boolean;
                isTwoFactorEnabled: boolean;
                twoFactorSecret: string | null;
                loginAttempts: number;
                lockedUntil: Date | null;
                lastLoginAt: Date | null;
                lastIp: string | null;
                locale: string;
                timezone: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
            freelancer: {
                freelancerProfile: {
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
                };
            } & {
                id: string;
                email: string;
                phone: string | null;
                emailVerifiedAt: Date | null;
                phoneVerifiedAt: Date | null;
                passwordHash: string;
                role: import(".prisma/client").$Enums.UserRole;
                status: import(".prisma/client").$Enums.UserStatus;
                isProfileComplete: boolean;
                isTwoFactorEnabled: boolean;
                twoFactorSecret: string | null;
                loginAttempts: number;
                lockedUntil: Date | null;
                lastLoginAt: Date | null;
                lastIp: string | null;
                locale: string;
                timezone: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ContractStatus;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
            projectId: string;
            freelancerId: string;
            proposalId: string | null;
            terms: string | null;
            isNdaSigned: boolean;
            startedAt: Date | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
        };
        messages: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            attachments: import("@prisma/client/runtime/client").JsonValue | null;
            disputeId: string;
            content: string;
        })[];
        opener: {
            freelancerProfile: {
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
            };
            clientProfile: {
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
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            emailVerifiedAt: Date | null;
            phoneVerifiedAt: Date | null;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            isProfileComplete: boolean;
            isTwoFactorEnabled: boolean;
            twoFactorSecret: string | null;
            loginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            lastIp: string | null;
            locale: string;
            timezone: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        participants: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            role: string;
            createdAt: Date;
            userId: string;
            disputeId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.DisputeStatus;
        createdAt: Date;
        updatedAt: Date;
        contractId: string;
        projectId: string;
        reason: string;
        openedBy: string;
        resolution: string | null;
        resolvedBy: string | null;
        resolvedAt: Date | null;
    }>;
    resolveDispute(id: string, data: {
        decision: string;
        notes?: string;
        refundAmount?: number;
        adminId: string;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.DisputeStatus;
        createdAt: Date;
        updatedAt: Date;
        contractId: string;
        projectId: string;
        reason: string;
        openedBy: string;
        resolution: string | null;
        resolvedBy: string | null;
        resolvedAt: Date | null;
    }>;
    closeDispute(id: string, adminId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.DisputeStatus;
        createdAt: Date;
        updatedAt: Date;
        contractId: string;
        projectId: string;
        reason: string;
        openedBy: string;
        resolution: string | null;
        resolvedBy: string | null;
        resolvedAt: Date | null;
    }>;
}
