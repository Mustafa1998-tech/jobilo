export declare class RegisterDto {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: 'FREELANCER' | 'CLIENT';
    agreeToTerms: boolean;
    locale?: string;
}
