import { AdminLogsService } from './logs.service';
export declare class AdminLogsController {
    private readonly service;
    constructor(service: AdminLogsService);
    getAuditLogs(userId?: string, action?: string, module?: string, page?: number, pageSize?: number): Promise<{
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
    getLoginLogs(userId?: string, success?: string, page?: number, pageSize?: number): Promise<{
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
    getErrorLogs(level?: string, resolved?: string, page?: number, pageSize?: number): Promise<{
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
    getSecurityLogs(type?: string, severity?: string, page?: number, pageSize?: number): Promise<{
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
