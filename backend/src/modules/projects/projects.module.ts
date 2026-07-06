import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../../common/prisma.service';
import { AuthHelpersService } from '../../common/utils/auth-helpers.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessSecret'),
        signOptions: { expiresIn: config.get<string>('jwt.accessExpiry') as any },
      }),
    } as any),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, AuthHelpersService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
