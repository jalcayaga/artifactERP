import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard'
import { TenantId } from '../common/decorators/tenant.decorator'

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(
    @TenantId() tenantId: string,
    @Body() createOrderDto: CreateOrderDto,
    @Request() req
  ) {
    return this.ordersService.create(tenantId, createOrderDto, req.user.id)
  }

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.ordersService.findAll(tenantId, page, limit, req.user.id)
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.ordersService.findOne(tenantId, id)
  }

  @Patch(':id')
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return this.ordersService.update(tenantId, id, updateOrderDto)
  }
}
