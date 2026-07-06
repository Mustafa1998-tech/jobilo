import { PrismaService } from '../../common/prisma.service';
import { AuthHelpersService } from '../../common/utils/auth-helpers.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly helpers;
    constructor(prisma: PrismaService, helpers: AuthHelpersService);
    register(dto: RegisterDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            locale: string;
            profile: {
                firstName: string;
                lastName: string;
                avatarUrl: string;
            } | {
                companyName: string;
                logoUrl: string;
            };
        };
    }>;
    logout(userId: string): Promise<void>;
    refreshToken(token: string): Promise<{
        accessToken: string;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        expiresAt: Date;
        deviceInfo: string;
        ipAddress: string;
        lastActivity: Date;
    }[]>;
    terminateSession(userId: string, sessionId: string): Promise<void>;
    terminateAllSessions(userId: string): Promise<void>;
}
