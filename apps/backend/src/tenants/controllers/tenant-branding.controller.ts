import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import {
  TenantContext,
  TenantId,
  RequestTenant,
} from '../../common/decorators/tenant.decorator'
import { TenantsService } from '../tenants.service'
import { UpdateBrandingDto } from '../dto/update-branding.dto'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/branding')
export class TenantBrandingController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @Roles('ADMIN', 'EDITOR', 'SUPERADMIN')
  async getBranding(@TenantContext() tenant: RequestTenant | undefined) {
    if (!tenant) {
      return null
    }
    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.displayName,
      branding: tenant.branding || null,
    }
  }

  @Put()
  @Roles('ADMIN', 'EDITOR', 'SUPERADMIN')
  async updateBranding(
    @TenantId() tenantId: string,
    @Body() dto: UpdateBrandingDto
  ) {
    await this.tenantsService.upsertBranding(tenantId, dto)
    const tenant = await this.tenantsService.findById(tenantId)
    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.displayName,
      branding: tenant.branding,
    }
  }
}
