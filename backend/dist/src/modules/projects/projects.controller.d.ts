import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
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
                    averageRating: import("@prisma/client-runtime-utils").Decimal;
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
                averageRating: import("@prisma/client-runtime-utils").Decimal;
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
    }>;
    getSimilar(id: string): Promise<({
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
    })[]>;
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
    }>;
    featureProject(id: string): Promise<{
        id: string;
        title: string;
        isFeatured: boolean;
    }>;
    bookmark(id: string, userId: string): Promise<{
        bookmarked: boolean;
    }>;
    removeBookmark(id: string, userId: string): Promise<{
        message: string;
    }>;
    report(id: string, userId: string, reason: string): Promise<{
        message: string;
    }>;
}
