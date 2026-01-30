import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common'
import { TenantsService } from './tenants.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { Public } from '../common/decorators/public.decorator'
import { RegisterTenantDto } from './dto/register-tenant.dto'
import { TenantId } from '../common/decorators/tenant.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) { }

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterTenantDto) {
    return this.tenantsService.register(registerDto)
  }

  @Get('config')
  getMyConfig(@TenantId() tenantId: string) {
    return this.tenantsService.findById(tenantId)
  }

  @Post('branding')
  @Roles('ADMIN', 'SUPERADMIN')
  updateBranding(@TenantId() tenantId: string, @Body() brandingData: any) {
    return this.tenantsService.upsertBranding(tenantId, brandingData)
  }

  @Post('settings')
  @Roles('ADMIN', 'SUPERADMIN')
  updateSettings(@TenantId() tenantId: string, @Body() settingsData: any) {
    return this.tenantsService.updateSettings(tenantId, settingsData)
  }

  @Public()
  @Get('public/resolve')
  resolvePublicConfig(@Query('host') host: string) {
    if (!host) return this.tenantsService.findBySlug('artifact');

    // Logic similar to middleware
    const rootDomain = 'artifact.cl'; // This should ideally come from config
    const isPlatformSubdomain = host.endsWith(rootDomain) && host !== rootDomain;

    if (isPlatformSubdomain) {
      const slug = host.replace(`.${rootDomain}`, '');
      return this.tenantsService.findBySlug(slug);
    }

    return this.tenantsService.findByDomain(host);
  }

  @Public()
  @Get('public/:slug')
  getPublicConfig(@Param('slug') slug: string) {
    return this.tenantsService.findBySlug(slug)
  }

  @Get()
  @Roles('SUPERADMIN')
  list() {
    return this.tenantsService.list()
  }

  @Get(':slug')
  @Roles('SUPERADMIN')
  findBySlug(@Param('slug') slug: string) {
    return this.tenantsService.findBySlug(slug)
  }
}
