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
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Proposals')
@Controller({ path: 'proposals', version: '1' })
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post('projects/:projectId')
  @UseGuards(AuthGuard('jwt'))
  @Roles('FREELANCER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a proposal for a project' })
  async create(
    @Param('projectId') projectId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProposalDto,
  ) {
    return this.proposalsService.create(projectId, userId, dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my proposals' })
  async findAll(@CurrentUser('id') userId: string, @Query() query: any) {
    return this.proposalsService.findAll(userId, query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get proposal details' })
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.proposalsService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update proposal' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: Partial<CreateProposalDto>,
  ) {
    return this.proposalsService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Withdraw proposal' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.proposalsService.remove(id, userId);
  }

  @Patch(':id/accept')
  @UseGuards(AuthGuard('jwt'))
  @Roles('CLIENT')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a proposal (Client)' })
  async accept(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.proposalsService.accept(id, userId);
  }

  @Patch(':id/reject')
  @UseGuards(AuthGuard('jwt'))
  @Roles('CLIENT')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a proposal' })
  async reject(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.proposalsService.reject(id, userId);
  }

  @Patch(':id/shortlist')
  @UseGuards(AuthGuard('jwt'))
  @Roles('CLIENT')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Shortlist a proposal' })
  async shortlist(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.proposalsService.shortlist(id, userId);
  }
}
