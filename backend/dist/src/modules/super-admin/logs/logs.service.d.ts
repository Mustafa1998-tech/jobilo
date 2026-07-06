import { PrismaService } from '../../../common/prisma.service';
export declare class AdminLogsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private paginate;
    getAuditLogs(params: {
        userId?: string;
        action?: string;
        module?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        data: any;
        meta: {
            page: number;
            pageSize: number;
            totalCount: any;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    getLoginLogs(params: {
        userId?: string;
        success?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        data: any;
        meta: {
            page: number;
            pageSize: number;
            totalCount: any;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    getErrorLogs(params: {
        level?: string;
        resolved?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        data: any;
        meta: {
            page: number;
            pageSize: number;
            totalCount: any;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    getSecurityLogs(params: {
        type?: string;
        severity?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        data: any;
        meta: {
            page: number;
            pageSize: number;
            totalCount: any;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
}
