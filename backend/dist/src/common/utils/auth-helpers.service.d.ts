import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export declare class AuthHelpersService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hash: string): Promise<boolean>;
    generateAccessToken(payload: {
        sub: string;
        email: string;
        role: string;
    }): string;
    generateRefreshToken(payload: {
        sub: string;
        tokenId: string;
        type: string;
    }): string;
    generateOtp(): string;
    generateSlug(title: string): string;
}
