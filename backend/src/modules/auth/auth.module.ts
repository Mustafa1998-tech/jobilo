import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/prisma.service';
import { AuthHelpersService } from '../../common/utils/auth-helpers.service';
import { JwtStrategy } from '../../common/guards/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessSecret'),
        signOptions: { expiresIn: config.get<string>('jwt.accessExpiry') as any },
      }),
    } as any),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AuthHelpersService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
