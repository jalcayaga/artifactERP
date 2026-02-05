import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { TenantId } from '../common/decorators/tenant.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get()
  @Roles('SUPERADMIN', 'ADMIN', 'EDITOR', 'VIEWER')
  getDashboardData(
    @TenantId() tenantId: string,
    @Query('companyId') companyId?: string
  ) {
    return this.dashboardService.getDashboardData(tenantId, companyId)
  }
}
