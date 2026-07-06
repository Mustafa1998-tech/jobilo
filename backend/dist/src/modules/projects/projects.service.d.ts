import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { AuthHelpersService } from '../../common/utils/auth-helpers.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
export declare class ProjectsService {
    private readonly prisma;
    private readonly helpers;
    constructor(prisma: PrismaService, helpers: AuthHelpersService);
    findAll(query: QueryProjectsDto): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
            _count: {
                proposals: number;
                bookmarks: number;
            };
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
                skillId: string;
                projectId: string;
            })[];
            client: {
                clientProfile: {
                    averageRating: Prisma.Decimal;
                    companyName: string;
                    logoUrl: string;
                };
            };
        } & {
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
            budgetMin: Prisma.Decimal | null;
            budgetMax: Prisma.Decimal | null;
            isUrgent: boolean;
            proposalsCount: number;
            clientId: string;
            budgetFixed: Prisma.Decimal | null;
            hourlyMin: Prisma.Decimal | null;
            hourlyMax: Prisma.Decimal | null;
            durationDays: number;
            isNdaRequired: boolean;
            averageBid: Prisma.Decimal | null;
            viewsCount: number;
            savedCount: number;
            publishedAt: Date | null;
            closedAt: Date | null;
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
    getFeatured(): Promise<({
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
        _count: {
            proposals: number;
        };
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
            skillId: string;
            projectId: string;
        })[];
        client: {
            clientProfile: {
                companyName: string;
                logoUrl: string;
            };
        };
    } & {
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
        budgetMin: Prisma.Decimal | null;
        budgetMax: Prisma.Decimal | null;
        isUrgent: boolean;
        proposalsCount: number;
        clientId: string;
        budgetFixed: Prisma.Decimal | null;
        hourlyMin: Prisma.Decimal | null;
        hourlyMax: Prisma.Decimal | null;
        durationDays: number;
        isNdaRequired: boolean;
        averageBid: Prisma.Decimal | null;
        viewsCount: number;
        savedCount: number;
        publishedAt: Date | null;
        closedAt: Date | null;
    })[]>;
    create(userId: string, dto: CreateProjectDto): Promise<{
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
            skillId: string;
            projectId: string;
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            projectId: string;
            fileUrl: string;
            fileName: string;
            fileType: import(".prisma/client").$Enums.FileType;
            fileSize: number;
        }[];
    } & {
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
        budgetMin: Prisma.Decimal | null;
        budgetMax: Prisma.Decimal | null;
        isUrgent: boolean;
        proposalsCount: number;
        clientId: string;
        budgetFixed: Prisma.Decimal | null;
        hourlyMin: Prisma.Decimal | null;
        hourlyMax: Prisma.Decimal | null;
        durationDays: number;
        isNdaRequired: boolean;
        averageBid: Prisma.Decimal | null;
        viewsCount: number;
        savedCount: number;
        publishedAt: Date | null;
        closedAt: Date | null;
    }>;
    findOne(id: string): Promise<{
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
        _count: {
            proposals: number;
            bookmarks: number;
        };
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
            skillId: string;
            projectId: string;
        })[];
        client: {
            clientProfile: {
                isVerified: boolean;
                averageRating: Prisma.Decimal;
                companyName: string;
                logoUrl: string;
                location: string;
                totalProjectsPosted: number;
            };
            id: string;
        };
        attachments: {
            id: string;
            createdAt: Date;
            projectId: string;
            fileUrl: string;
            fileName: string;
            fileType: import(".prisma/client").$Enums.FileType;
            fileSize: number;
        }[];
    } & {
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
        budgetMin: Prisma.Decimal | null;
        budgetMax: Prisma.Decimal | null;
        isUrgent: boolean;
        proposalsCount: number;
        clientId: string;
        budgetFixed: Prisma.Decimal | null;
        hourlyMin: Prisma.Decimal | null;
        hourlyMax: Prisma.Decimal | null;
        durationDays: number;
        isNdaRequired: boolean;
        averageBid: Prisma.Decimal | null;
        viewsCount: number;
        savedCount: number;
        publishedAt: Date | null;
        closedAt: Date | null;
    }>;
    update(id: string, userId: string, dto: Partial<CreateProjectDto>): Promise<{
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
            skillId: string;
            projectId: string;
        })[];
    } & {
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
        budgetMin: Prisma.Decimal | null;
        budgetMax: Prisma.Decimal | null;
        isUrgent: boolean;
        proposalsCount: number;
        clientId: string;
        budgetFixed: Prisma.Decimal | null;
        hourlyMin: Prisma.Decimal | null;
        hourlyMax: Prisma.Decimal | null;
        durationDays: number;
        isNdaRequired: boolean;
        averageBid: Prisma.Decimal | null;
        viewsCount: number;
        savedCount: number;
        publishedAt: Date | null;
        closedAt: Date | null;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    updateStatus(id: string, userId: string, status: string): Promise<{
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
        budgetMin: Prisma.Decimal | null;
        budgetMax: Prisma.Decimal | null;
        isUrgent: boolean;
        proposalsCount: number;
        clientId: string;
        budgetFixed: Prisma.Decimal | null;
        hourlyMin: Prisma.Decimal | null;
        hourlyMax: Prisma.Decimal | null;
        durationDays: number;
        isNdaRequired: boolean;
        averageBid: Prisma.Decimal | null;
        viewsCount: number;
        savedCount: number;
        publishedAt: Date | null;
        closedAt: Date | null;
    }>;
    featureProject(id: string): Promise<{
        id: string;
        title: string;
        isFeatured: boolean;
    }>;
    toggleBookmark(projectId: string, userId: string): Promise<{
        bookmarked: boolean;
    }>;
    removeBookmark(projectId: string, userId: string): Promise<{
        message: string;
    }>;
    report(projectId: string, userId: string, reason: string): Promise<{
        message: string;
    }>;
    getSimilar(projectId: string): Promise<({
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
        _count: {
            proposals: number;
        };
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
            skillId: string;
            projectId: string;
        })[];
    } & {
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
        budgetMin: Prisma.Decimal | null;
        budgetMax: Prisma.Decimal | null;
        isUrgent: boolean;
        proposalsCount: number;
        clientId: string;
        budgetFixed: Prisma.Decimal | null;
        hourlyMin: Prisma.Decimal | null;
        hourlyMax: Prisma.Decimal | null;
        durationDays: number;
        isNdaRequired: boolean;
        averageBid: Prisma.Decimal | null;
        viewsCount: number;
        savedCount: number;
        publishedAt: Date | null;
        closedAt: Date | null;
    })[]>;
}
