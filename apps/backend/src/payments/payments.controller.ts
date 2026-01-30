import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

import { TenantId } from '../common/decorators/tenant.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post()
  @Roles('ADMIN', 'EDITOR')
  async create(
    @TenantId() tenantId: string,
    @Body() createPaymentDto: CreatePaymentDto
  ) {
    if (!tenantId) {
      throw new NotFoundException('Tenant ID is required')
    }
    return await this.paymentsService.create(tenantId, createPaymentDto)
  }

  @Get()
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  findAll(
    @TenantId() tenantId: string,
    @Query('invoiceId') invoiceId?: string
  ) {
    return this.paymentsService.findAll(tenantId, invoiceId)
  }

  @Post('link')
  @Roles('ADMIN', 'EDITOR')
  async generateLink(
    @TenantId() tenantId: string,
    @Body() body: { invoiceId: string; amount: number }
  ) {
    if (!tenantId) throw new NotFoundException('Tenant ID is required');
    return await this.paymentsService.generatePaymentLink(tenantId, body.invoiceId, body.amount);
  }
}
