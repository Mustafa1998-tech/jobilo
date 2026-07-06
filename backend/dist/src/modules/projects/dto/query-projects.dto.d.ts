export declare class QueryProjectsDto {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    categoryId?: string;
    skillIds?: string[];
    status?: string;
    projectType?: 'FIXED' | 'HOURLY';
    budgetMin?: number;
    budgetMax?: number;
    durationMin?: number;
    durationMax?: number;
    experienceLevel?: string;
    location?: string;
    isUrgent?: boolean;
}
