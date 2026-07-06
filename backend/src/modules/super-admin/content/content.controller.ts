import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminContentService } from './content.service';
import { AdminJwtAuthGuard } from '../guards/admin-auth.guard';
import { AdminPermissions } from '../decorators/admin-permissions.decorator';

@ApiTags('Super Admin - Content')
@Controller({ path: 'super-admin/content', version: '1' })
@UseGuards(AdminJwtAuthGuard)
export class AdminContentController {
  constructor(private readonly service: AdminContentService) {}

  @Get('pages')
  @AdminPermissions({ module: 'CONTENT', action: 'READ' })
  async listPages() { return this.service.listPages(); }

  @Get('pages/:id')
  @AdminPermissions({ module: 'CONTENT', action: 'READ' })
  async getPage(@Param('id') id: string) { return this.service.getPage(id); }

  @Post('pages')
  @AdminPermissions({ module: 'CONTENT', action: 'CREATE' })
  async createPage(@Body() data: any) { return this.service.createPage(data); }

  @Patch('pages/:id')
  @AdminPermissions({ module: 'CONTENT', action: 'UPDATE' })
  async updatePage(@Param('id') id: string, @Body() data: any) { return this.service.updatePage(id, data); }

  @Delete('pages/:id')
  @AdminPermissions({ module: 'CONTENT', action: 'DELETE' })
  async deletePage(@Param('id') id: string) { return this.service.deletePage(id); }

  @Get('blog')
  @AdminPermissions({ module: 'BLOG', action: 'READ' })
  async listBlogPosts(@Query('page') page?: number, @Query('pageSize') pageSize?: number) { return this.service.listBlogPosts({ page, pageSize }); }

  @Get('blog/:id')
  @AdminPermissions({ module: 'BLOG', action: 'READ' })
  async getBlogPost(@Param('id') id: string) { return this.service.getBlogPost(id); }

  @Post('blog')
  @AdminPermissions({ module: 'BLOG', action: 'CREATE' })
  async createBlogPost(@Body() data: any) { return this.service.createBlogPost(data); }

  @Patch('blog/:id')
  @AdminPermissions({ module: 'BLOG', action: 'UPDATE' })
  async updateBlogPost(@Param('id') id: string, @Body() data: any) { return this.service.updateBlogPost(id, data); }

  @Delete('blog/:id')
  @AdminPermissions({ module: 'BLOG', action: 'DELETE' })
  async deleteBlogPost(@Param('id') id: string) { return this.service.deleteBlogPost(id); }

  @Get('faq-categories')
  @AdminPermissions({ module: 'FAQ', action: 'READ' })
  async listFaqCategories() { return this.service.listFaqCategories(); }

  @Post('faq-categories')
  @AdminPermissions({ module: 'FAQ', action: 'CREATE' })
  async createFaqCategory(@Body() data: any) { return this.service.createFaqCategory(data); }

  @Get('faqs')
  @AdminPermissions({ module: 'FAQ', action: 'READ' })
  async listFaqs() { return this.service.listFaqs(); }

  @Post('faqs')
  @AdminPermissions({ module: 'FAQ', action: 'CREATE' })
  async createFaq(@Body() data: any) { return this.service.createFaq(data); }

  @Patch('faqs/:id')
  @AdminPermissions({ module: 'FAQ', action: 'UPDATE' })
  async updateFaq(@Param('id') id: string, @Body() data: any) { return this.service.updateFaq(id, data); }

  @Delete('faqs/:id')
  @AdminPermissions({ module: 'FAQ', action: 'DELETE' })
  async deleteFaq(@Param('id') id: string) { return this.service.deleteFaq(id); }

  @Get('banners')
  @AdminPermissions({ module: 'BANNERS', action: 'READ' })
  async listBanners() { return this.service.listBanners(); }

  @Post('banners')
  @AdminPermissions({ module: 'BANNERS', action: 'CREATE' })
  async createBanner(@Body() data: any) { return this.service.createBanner(data); }

  @Patch('banners/:id')
  @AdminPermissions({ module: 'BANNERS', action: 'UPDATE' })
  async updateBanner(@Param('id') id: string, @Body() data: any) { return this.service.updateBanner(id, data); }

  @Delete('banners/:id')
  @AdminPermissions({ module: 'BANNERS', action: 'DELETE' })
  async deleteBanner(@Param('id') id: string) { return this.service.deleteBanner(id); }
}
