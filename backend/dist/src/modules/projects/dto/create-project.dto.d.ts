export declare class CreateProjectDto {
    title: string;
    description: string;
    categoryId: string;
    projectType: 'FIXED' | 'HOURLY';
    budgetMin?: number;
    budgetMax?: number;
    durationDays: number;
    experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    skills: {
        skillId: string;
        level?: string;
    }[];
    attachments?: {
        fileUrl: string;
        fileName: string;
        fileType: string;
        fileSize?: number;
    }[];
    isUrgent?: boolean;
    location?: string;
}
