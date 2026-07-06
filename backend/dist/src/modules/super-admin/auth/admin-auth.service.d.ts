import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../common/prisma.service';
import { AuthHelpersService } from '../../../common/utils/auth-helpers.service';
export declare class AdminAuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly authHelpers;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, authHelpers: AuthHelpersService);
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        admin: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            roles: string[];
            permissions: string[];
            profile: {
                firstName: any;
                lastName: any;
            };
        };
    }>;
    logout(userId: string): Promise<void>;
    refreshToken(token: string): Promise<{
        accessToken: string;
    }>;
    getSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        refreshToken: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        isActive: boolean;
        lastActivity: Date;
    }[]>;
    terminateSession(userId: string, sessionId: string): Promise<void>;
    getLoginHistory(userId: string, page?: number, pageSize?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            location: string | null;
            deviceInfo: string | null;
            ipAddress: string;
            userAgent: string | null;
            success: boolean;
            failReason: string | null;
        }[];
        meta: {
            page: number;
            pageSize: number;
            totalCount: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    private getUserPermissions;
    private generateAccessToken;
    private generateRefreshToken;
    private logLoginAttempt;
}
