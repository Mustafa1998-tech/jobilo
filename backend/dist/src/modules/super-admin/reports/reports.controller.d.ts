import { AdminReportsService } from './reports.service';
export declare class AdminReportsController {
    private readonly reportsService;
    constructor(reportsService: AdminReportsService);
    listReports(status?: string, page?: number, pageSize?: number): Promise<{
        data: ({
            project: {
                id: string;
                title: string;
            };
            reviewer: {
                id: string;
                email: string;
            };
            reporter: {
                id: string;
                email: string;
            };
            reportedUser: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ReportStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            projectId: string | null;
            reason: string;
            proposalId: string | null;
            resolvedAt: Date | null;
            reporterId: string;
            reportedUserId: string | null;
            messageId: string | null;
            reviewedBy: string | null;
            reviewNote: string | null;
            actionTaken: string | null;
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
    reviewReport(id: string, body: {
        action: string;
        note?: string;
    }, adminId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        projectId: string | null;
        reason: string;
        proposalId: string | null;
        resolvedAt: Date | null;
        reporterId: string;
        reportedUserId: string | null;
        messageId: string | null;
        reviewedBy: string | null;
        reviewNote: string | null;
        actionTaken: string | null;
    }>;
}
