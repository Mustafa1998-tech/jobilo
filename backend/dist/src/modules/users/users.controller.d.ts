import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<{
        freelancerProfile: {
            skills: ({
                skill: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    isActive: boolean;
                    categoryId: string | null;
                    nameAr: string | null;
                    icon: string | null;
                };
            } & {
                level: import(".prisma/client").$Enums.SkillLevel;
                id: string;
                createdAt: Date;
                freelancerProfileId: string;
                isTop: boolean;
                skillId: string;
            })[];
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
        id: string;
        email: string;
        emailVerifiedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        locale: string;
        timezone: string;
        createdAt: Date;
        portfolios: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            userId: string;
            tags: import("@prisma/client/runtime/client").JsonValue | null;
            sortOrder: number;
            categoryId: string | null;
            url: string | null;
            mediaUrls: import("@prisma/client/runtime/client").JsonValue | null;
            isFeatured: boolean;
            freelancerProfileId: string | null;
        }[];
        socialLinks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            isPublic: boolean;
            url: string;
            platform: string;
        }[];
    }>;
    updateProfile(userId: string, role: string, body: any): Promise<{
        freelancerProfile: {
            skills: ({
                skill: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    isActive: boolean;
                    categoryId: string | null;
                    nameAr: string | null;
                    icon: string | null;
                };
            } & {
                level: import(".prisma/client").$Enums.SkillLevel;
                id: string;
                createdAt: Date;
                freelancerProfileId: string;
                isTop: boolean;
                skillId: string;
            })[];
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
        id: string;
        email: string;
        emailVerifiedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        locale: string;
        timezone: string;
        createdAt: Date;
        portfolios: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            userId: string;
            tags: import("@prisma/client/runtime/client").JsonValue | null;
            sortOrder: number;
            categoryId: string | null;
            url: string | null;
            mediaUrls: import("@prisma/client/runtime/client").JsonValue | null;
            isFeatured: boolean;
            freelancerProfileId: string | null;
        }[];
        socialLinks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            isPublic: boolean;
            url: string;
            platform: string;
        }[];
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    getPublicProfile(id: string): Promise<{
        freelancerProfile: {
            firstName: string;
            lastName: string;
            title: string;
            bio: string;
            avatarUrl: string;
            hourlyRate: import("@prisma/client-runtime-utils").Decimal;
            experienceLevel: import(".prisma/client").$Enums.SkillLevel;
            totalProjects: number;
            averageRating: import("@prisma/client-runtime-utils").Decimal;
            languages: import("@prisma/client/runtime/client").JsonValue;
            education: import("@prisma/client/runtime/client").JsonValue;
            certifications: import("@prisma/client/runtime/client").JsonValue;
            skills: ({
                skill: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    isActive: boolean;
                    categoryId: string | null;
                    nameAr: string | null;
                    icon: string | null;
                };
            } & {
                level: import(".prisma/client").$Enums.SkillLevel;
                id: string;
                createdAt: Date;
                freelancerProfileId: string;
                isTop: boolean;
                skillId: string;
            })[];
        };
        clientProfile: {
            description: string;
            isVerified: boolean;
            averageRating: import("@prisma/client-runtime-utils").Decimal;
            companyName: string;
            companyWebsite: string;
            industry: string;
            logoUrl: string;
            location: string;
            totalProjectsPosted: number;
        };
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
        socialLinks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            isPublic: boolean;
            url: string;
            platform: string;
        }[];
    }>;
    getUserPortfolio(id: string): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            sortOrder: number;
            nameAr: string | null;
            icon: string | null;
            slug: string;
            color: string | null;
            parentId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        userId: string;
        tags: import("@prisma/client/runtime/client").JsonValue | null;
        sortOrder: number;
        categoryId: string | null;
        url: string | null;
        mediaUrls: import("@prisma/client/runtime/client").JsonValue | null;
        isFeatured: boolean;
        freelancerProfileId: string | null;
    })[]>;
    getUserReviews(id: string): Promise<({
        reviewer: {
            freelancerProfile: {
                firstName: string;
                lastName: string;
                avatarUrl: string;
            };
            clientProfile: {
                companyName: string;
                logoUrl: string;
            };
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ReviewType;
        contractId: string;
        reviewerId: string;
        revieweeId: string;
        rating: number;
        quality: number | null;
        communication: number | null;
        adherence: number | null;
        timeliness: number | null;
        comment: string | null;
        isFlagged: boolean;
    })[]>;
    listUsers(query: any): Promise<{
        data: {
            freelancerProfile: {
                firstName: string;
                lastName: string;
                avatarUrl: string;
            };
            clientProfile: {
                companyName: string;
                logoUrl: string;
            };
            id: string;
            email: string;
            emailVerifiedAt: Date;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            lastLoginAt: Date;
            createdAt: Date;
        }[];
        meta: {
            page: any;
            pageSize: number;
            totalCount: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    changeRole(id: string, role: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    changeStatus(id: string, status: string): Promise<{
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    verifyUser(id: string): Promise<{
        message: string;
    }>;
}
