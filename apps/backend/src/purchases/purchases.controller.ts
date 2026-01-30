import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common'
import { PurchasesService } from './purchases.service'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { UpdatePurchaseDto } from './dto/update-purchase.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TenantId } from '../common/decorators/tenant.decorator'

@UseGuards(JwtAuthGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  create(
    @TenantId() tenantId: string,
    @Body() createPurchaseDto: CreatePurchaseDto
  ) {
    return this.purchasesService.create(tenantId, createPurchaseDto)
  }

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.purchasesService.findAll(tenantId, page, limit)
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.purchasesService.findOne(tenantId, id)
  }

  @Patch(':id')
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto
  ) {
    return this.purchasesService.update(tenantId, id, updatePurchaseDto)
  }

  @Delete(':id')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.purchasesService.remove(tenantId, id)
  }
}
