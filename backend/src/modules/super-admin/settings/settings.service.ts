import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getSetting(key: string) {
    const setting = await this.prisma.platformSetting.findUnique({ where: { key } });
    return setting?.value || null;
  }

  private async setSetting(key: string, value: any, userId?: string) {
    return this.prisma.platformSetting.upsert({
      where: { key },
      create: { key, value, updatedBy: userId },
      update: { value, updatedBy: userId },
    });
  }

  async getPlatform() { return this.getSetting('platform'); }
  async updatePlatform(value: any, userId: string) { return this.setSetting('platform', value, userId); }

  async getEmail() { return this.getSetting('email'); }
  async updateEmail(value: any, userId: string) { return this.setSetting('email', value, userId); }

  async getStorage() { return this.getSetting('storage'); }
  async updateStorage(value: any, userId: string) { return this.setSetting('storage', value, userId); }

  async getAi() { return this.getSetting('ai'); }
  async updateAi(value: any, userId: string) { return this.setSetting('ai', value, userId); }

  async getNotifications() { return this.getSetting('notifications'); }
  async updateNotifications(value: any, userId: string) { return this.setSetting('notifications', value, userId); }

  async getSeo() { return this.getSetting('seo'); }
  async updateSeo(value: any, userId: string) { return this.setSetting('seo', value, userId); }

  async getSecurity() { return this.getSetting('security'); }
  async updateSecurity(value: any, userId: string) { return this.setSetting('security', value, userId); }
}
