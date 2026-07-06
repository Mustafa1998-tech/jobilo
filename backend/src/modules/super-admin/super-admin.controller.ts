import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuperAdminService } from './super-admin.service';

@ApiTags('Super Admin')
@Controller({ path: 'super-admin', version: '1' })
export class SuperAdminController {
  constructor(private readonly service: SuperAdminService) {}

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
