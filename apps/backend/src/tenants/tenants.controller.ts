import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @Roles(UserRole.SUPERADMIN)
  list() {
    return this.tenantsService.list();
  }

  @Get(':slug')
  @Roles(UserRole.SUPERADMIN)
  findBySlug(@Param('slug') slug: string) {
    return this.tenantsService.findBySlug(slug);
  }
}
