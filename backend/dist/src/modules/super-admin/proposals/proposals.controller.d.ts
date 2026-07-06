import { AdminProposalsService } from './proposals.service';
export declare class AdminProposalsController {
    private readonly proposalsService;
    constructor(proposalsService: AdminProposalsService);
    listProposals(status?: string, projectId?: string, freelancerId?: string, page?: number, pageSize?: number): Promise<{
        data: ({
            project: {
                id: string;
                title: string;
            };
            freelancer: {
                freelancerProfile: {
                    firstName: string;
                    lastName: string;
                };
                id: string;
                email: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ProposalStatus;
            createdAt: Date;
            updatedAt: Date;
            durationDays: number;
            projectId: string;
            freelancerId: string;
            coverLetter: string;
            bidAmount: import("@prisma/client-runtime-utils").Decimal;
            aiScore: import("@prisma/client-runtime-utils").Decimal | null;
            isAiGenerated: boolean;
            isSeen: boolean;
            seenAt: Date | null;
            submittedAt: Date;
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
    getProposal(id: string): Promise<{
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
        attachments: {
            id: string;
            createdAt: Date;
            fileUrl: string;
            fileName: string;
            fileType: import(".prisma/client").$Enums.FileType;
            fileSize: number;
            proposalId: string;
        }[];
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
        status: import(".prisma/client").$Enums.ProposalStatus;
        createdAt: Date;
        updatedAt: Date;
        durationDays: number;
        projectId: string;
        freelancerId: string;
        coverLetter: string;
        bidAmount: import("@prisma/client-runtime-utils").Decimal;
        aiScore: import("@prisma/client-runtime-utils").Decimal | null;
        isAiGenerated: boolean;
        isSeen: boolean;
        seenAt: Date | null;
        submittedAt: Date;
    }>;
    deleteProposal(id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ProposalStatus;
        createdAt: Date;
        updatedAt: Date;
        durationDays: number;
        projectId: string;
        freelancerId: string;
        coverLetter: string;
        bidAmount: import("@prisma/client-runtime-utils").Decimal;
        aiScore: import("@prisma/client-runtime-utils").Decimal | null;
        isAiGenerated: boolean;
        isSeen: boolean;
        seenAt: Date | null;
        submittedAt: Date;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ProposalStatus;
        createdAt: Date;
        updatedAt: Date;
        durationDays: number;
        projectId: string;
        freelancerId: string;
        coverLetter: string;
        bidAmount: import("@prisma/client-runtime-utils").Decimal;
        aiScore: import("@prisma/client-runtime-utils").Decimal | null;
        isAiGenerated: boolean;
        isSeen: boolean;
        seenAt: Date | null;
        submittedAt: Date;
    }>;
}
