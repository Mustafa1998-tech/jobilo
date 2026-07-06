import { SuperAdminService } from './super-admin.service';
export declare class SuperAdminController {
    private readonly service;
    constructor(service: SuperAdminService);
    health(): {
        status: string;
        timestamp: string;
    };
}
