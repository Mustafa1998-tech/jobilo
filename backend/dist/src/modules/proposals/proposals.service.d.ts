import { PrismaService } from '../../common/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
export declare class ProposalsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(projectId: string, userId: string, dto: CreateProposalDto): Promise<{
        project: {
            title: string;
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
    findAll(userId: string, query: any): Promise<{
        data: ({
            project: {
                category: {
                    name: string;
                };
                id: string;
                status: import(".prisma/client").$Enums.ProjectStatus;
                title: string;
                slug: string;
                budgetMin: import("@prisma/client-runtime-utils").Decimal;
                budgetMax: import("@prisma/client-runtime-utils").Decimal;
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
            page: any;
            pageSize: number;
            totalCount: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string): Promise<{
        project: {
            id: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            title: string;
            budgetMin: import("@prisma/client-runtime-utils").Decimal;
            budgetMax: import("@prisma/client-runtime-utils").Decimal;
            clientId: string;
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
                firstName: string;
                lastName: string;
                title: string;
                avatarUrl: string;
                averageRating: import("@prisma/client-runtime-utils").Decimal;
            };
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
    update(id: string, userId: string, dto: Partial<CreateProposalDto>): Promise<{
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
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    accept(id: string, userId: string): Promise<{
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
    }>;
    reject(id: string, userId: string): Promise<{
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
    shortlist(id: string, userId: string): Promise<{
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
    private calcAverageBid;
}
