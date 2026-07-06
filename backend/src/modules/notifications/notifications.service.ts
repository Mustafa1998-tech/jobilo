import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async send(userId: string, type: string, title: string, body?: string, data?: any) {
    // TODO: Implement notification sending (in-app + email + push)
    console.log(`[Notification] User: ${userId}, Type: ${type}, Title: ${title}`);
  }
}
