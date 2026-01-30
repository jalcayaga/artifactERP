import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  Patch,
  Delete,
} from '@nestjs/common'
import { SalesService } from './sales.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

import { CreateSaleDto } from './dto/create-sale.dto'
import { UpdateSaleDto } from './dto/update-sale.dto'
import { TenantId } from '../common/decorators/tenant.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles('ADMIN', 'EDITOR')
  async create(
    @TenantId() tenantId: string,
    @Body() createSaleDto: CreateSaleDto
  ) {
    if (!tenantId) {
      throw new NotFoundException('Tenant ID is required')
    }
    return await this.salesService.create(tenantId, createSaleDto)
  }

  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  findAll(
    @TenantId() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: string
  ) {
    if (!tenantId) {
      throw new NotFoundException('Tenant ID is required')
    }
    return this.salesService.findAll(tenantId, page, limit, { status })
  }

  @Get(':id')
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    if (!tenantId) {
      throw new NotFoundException('Tenant ID is required')
    }
    const order = await this.salesService.findOne(tenantId, id)
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`)
    }
    return order
  }

  @Patch(':id')
  @Roles('ADMIN', 'EDITOR')
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto
  ) {
    if (!tenantId) {
      throw new NotFoundException('Tenant ID is required')
    }
    return this.salesService.update(tenantId, id, updateSaleDto)
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    if (!tenantId) {
      throw new NotFoundException('Tenant ID is required')
    }
    return this.salesService.remove(tenantId, id)
  }
}
