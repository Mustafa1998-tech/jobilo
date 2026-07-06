"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminJwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminJwtStrategy = class AdminJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'admin-jwt') {
    constructor(configService, prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_ACCESS_SECRET') || 'dev-access-secret',
        });
        this.prisma = prisma;
    }
    async validate(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                adminProfile: true,
                adminRoles: {
                    include: {
                        role: {
                            include: {
                                permissions: { include: { permission: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Admin not found');
        }
        if (user.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException('Admin account is not active');
        }
        const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
        if (!isAdmin && user.adminRoles.length === 0) {
            throw new common_1.UnauthorizedException('Not an admin account');
        }
        const permissions = user.adminRoles.flatMap(ur => ur.role.permissions.map(rp => `${rp.permission.module}_${rp.permission.action}`));
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            roles: user.adminRoles.map(ur => ur.role.name),
            permissions: [...new Set(permissions)],
        };
    }
};
exports.AdminJwtStrategy = AdminJwtStrategy;
exports.AdminJwtStrategy = AdminJwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], AdminJwtStrategy);
//# sourceMappingURL=admin-jwt.strategy.js.map