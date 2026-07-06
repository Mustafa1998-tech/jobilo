export declare class CreateProposalDto {
    coverLetter: string;
    bidAmount: number;
    durationDays: number;
    attachments?: {
        fileUrl: string;
        fileName: string;
        fileType: string;
    }[];
}
