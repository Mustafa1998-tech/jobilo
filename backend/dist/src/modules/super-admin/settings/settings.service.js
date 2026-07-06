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
exports.AdminSettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma.service");
let AdminSettingsService = class AdminSettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSetting(key) {
        const setting = await this.prisma.platformSetting.findUnique({ where: { key } });
        return setting?.value || null;
    }
    async setSetting(key, value, userId) {
        return this.prisma.platformSetting.upsert({
            where: { key },
            create: { key, value, updatedBy: userId },
            update: { value, updatedBy: userId },
        });
    }
    async getPlatform() { return this.getSetting('platform'); }
    async updatePlatform(value, userId) { return this.setSetting('platform', value, userId); }
    async getEmail() { return this.getSetting('email'); }
    async updateEmail(value, userId) { return this.setSetting('email', value, userId); }
    async getStorage() { return this.getSetting('storage'); }
    async updateStorage(value, userId) { return this.setSetting('storage', value, userId); }
    async getAi() { return this.getSetting('ai'); }
    async updateAi(value, userId) { return this.setSetting('ai', value, userId); }
    async getNotifications() { return this.getSetting('notifications'); }
    async updateNotifications(value, userId) { return this.setSetting('notifications', value, userId); }
    async getSeo() { return this.getSetting('seo'); }
    async updateSeo(value, userId) { return this.setSetting('seo', value, userId); }
    async getSecurity() { return this.getSetting('security'); }
    async updateSecurity(value, userId) { return this.setSetting('security', value, userId); }
};
exports.AdminSettingsService = AdminSettingsService;
exports.AdminSettingsService = AdminSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminSettingsService);
//# sourceMappingURL=settings.service.js.map