import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Projects')
@Controller({ path: 'projects', version: '1' })
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List projects with search, filters, pagination' })
  async findAll(@Query() query: QueryProjectsDto) {
    return this.projectsService.findAll(query);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured projects' })
  async getFeatured() {
    return this.projectsService.getFeatured();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles('CLIENT')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(userId, dto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get project details' })
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Get(':id/similar')
  @Public()
  @ApiOperation({ summary: 'Get similar projects (AI-based)' })
  async getSimilar(@Param('id') id: string) {
    return this.projectsService.getSimilar(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: Partial<CreateProjectDto>,
  ) {
    return this.projectsService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete project' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.remove(id, userId);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change project status' })
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('status') status: string,
  ) {
    return this.projectsService.updateStatus(id, userId, status);
  }

  @Post(':id/feature')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Feature a project (Admin)' })
  async featureProject(@Param('id') id: string) {
    return this.projectsService.featureProject(id);
  }

  @Post(':id/bookmark')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save/bookmark a project' })
  async bookmark(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.toggleBookmark(id, userId);
  }

  @Delete(':id/bookmark')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove bookmark' })
  async removeBookmark(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.removeBookmark(id, userId);
  }

  @Post(':id/report')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report a project' })
  async report(@Param('id') id: string, @CurrentUser('id') userId: string, @Body('reason') reason: string) {
    return this.projectsService.report(id, userId, reason);
  }
}
