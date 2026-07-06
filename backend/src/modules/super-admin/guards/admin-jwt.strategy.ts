import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../common/prisma.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  type?: string;
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
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
      throw new UnauthorizedException('Admin not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Admin account is not active');
    }

    const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
    if (!isAdmin && user.adminRoles.length === 0) {
      throw new UnauthorizedException('Not an admin account');
    }

    const permissions = user.adminRoles.flatMap(ur =>
      ur.role.permissions.map(rp => `${rp.permission.module}_${rp.permission.action}`)
    );

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      roles: user.adminRoles.map(ur => ur.role.name),
      permissions: [...new Set(permissions)],
    };
  }
}
