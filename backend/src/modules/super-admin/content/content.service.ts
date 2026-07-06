import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminContentService {
  constructor(private readonly prisma: PrismaService) {}

  // Pages
  async listPages() { return this.prisma.contentPage.findMany({ orderBy: { createdAt: 'desc' } }); }
  async getPage(id: string) { const p = await this.prisma.contentPage.findUnique({ where: { id } }); if (!p) throw new NotFoundException(); return p; }
  async createPage(data: any) { return this.prisma.contentPage.create({ data }); }
  async updatePage(id: string, data: any) { return this.prisma.contentPage.update({ where: { id }, data }); }
  async deletePage(id: string) { return this.prisma.contentPage.delete({ where: { id } }); }

  // Blog
  async listBlogPosts(params: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' }, skip, take: pageSize, include: { author: { select: { id: true, email: true } } } }),
      this.prisma.blogPost.count(),
    ]);
    return { data, meta: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize), hasNextPage: page * pageSize < total, hasPreviousPage: page > 1 } };
  }
  async getBlogPost(id: string) { const p = await this.prisma.blogPost.findUnique({ where: { id } }); if (!p) throw new NotFoundException(); return p; }
  async createBlogPost(data: any) { return this.prisma.blogPost.create({ data }); }
  async updateBlogPost(id: string, data: any) { return this.prisma.blogPost.update({ where: { id }, data }); }
  async deleteBlogPost(id: string) { return this.prisma.blogPost.delete({ where: { id } }); }

  // FAQ
  async listFaqCategories() { return this.prisma.faqCategory.findMany({ orderBy: { sortOrder: 'asc' }, include: { faqs: { orderBy: { sortOrder: 'asc' } } } }); }
  async createFaqCategory(data: any) { return this.prisma.faqCategory.create({ data }); }
  async listFaqs() { return this.prisma.faq.findMany({ orderBy: { sortOrder: 'asc' }, include: { category: true } }); }
  async createFaq(data: any) { return this.prisma.faq.create({ data }); }
  async updateFaq(id: string, data: any) { return this.prisma.faq.update({ where: { id }, data }); }
  async deleteFaq(id: string) { return this.prisma.faq.delete({ where: { id } }); }

  // Banners
  async listBanners() { return this.prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } }); }
  async createBanner(data: any) { return this.prisma.banner.create({ data }); }
  async updateBanner(id: string, data: any) { return this.prisma.banner.update({ where: { id }, data }); }
  async deleteBanner(id: string) { return this.prisma.banner.delete({ where: { id } }); }
}
