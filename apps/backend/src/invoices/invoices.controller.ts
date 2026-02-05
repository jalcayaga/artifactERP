import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common'
import { InvoicesService } from './invoices.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { InvoiceStatus } from '@prisma/client'
import { TenantId } from '../common/decorators/tenant.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) { }

  @Post()
  @Roles('SUPERADMIN', 'ADMIN', 'EDITOR')
  async createFromOrder(
    @TenantId() tenantId: string,
    @Body('orderId') orderId: string
  ) {
    return this.invoicesService.createFromOrder(tenantId, orderId)
  }

  @Get()
  @Roles('SUPERADMIN', 'ADMIN', 'EDITOR', 'VIEWER')
  async findAll(
    @TenantId() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: InvoiceStatus
  ) {
    return this.invoicesService.findAll(tenantId, page, limit, status)
  }

  @Post(':id/factoring')
  @Roles('SUPERADMIN', 'ADMIN', 'EDITOR')
  async cedeToFactoring(
    @TenantId() tenantId: string,
    @Param('id') id: string
  ) {
    return this.invoicesService.cedeToFactoring(tenantId, id)
  }

  @Get(':id')
  @Roles('SUPERADMIN', 'ADMIN', 'EDITOR', 'VIEWER')
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.invoicesService.findOne(tenantId, id)
  }
}
