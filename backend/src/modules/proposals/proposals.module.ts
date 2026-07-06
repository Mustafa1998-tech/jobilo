import { Module } from '@nestjs/common';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { PrismaService } from '../../common/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ProposalsController],
  providers: [ProposalsService, PrismaService],
  exports: [ProposalsService],
})
export class ProposalsModule {}
