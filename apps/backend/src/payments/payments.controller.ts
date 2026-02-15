import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  NotFoundException,
  BadRequestException,
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
  @Roles('SUPERADMIN', 'ADMIN', 'EDITOR')
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
  @Roles('SUPERADMIN', 'ADMIN', 'EDITOR', 'VIEWER')
  findAll(
    @TenantId() tenantId: string,
    @Query('invoiceId') invoiceId?: string
  ) {
    return this.paymentsService.findAll(tenantId, invoiceId)
  }

  @Post('link')
  @Roles('SUPERADMIN', 'ADMIN', 'EDITOR')
  async generateLink(
    @TenantId() tenantId: string,
    @Body() body: { invoiceId: string; amount: number }
  ) {
    if (!tenantId) throw new NotFoundException('Tenant ID is required');
    // Deprecated in favor of specific endpoints below, keeping for backward compatibility if needed
    throw new BadRequestException("Use specific provider endpoints");
  }

  @Post('transbank/init')
  @Roles('SUPERADMIN', 'ADMIN', 'EDITOR', 'CASHIER')
  async initWebpay(
    @TenantId() tenantId: string,
    @Body() body: { invoiceId: string; amount: number; returnUrl: string }
  ) {
    return this.paymentsService.initWebpayTransaction(tenantId, body.invoiceId, body.amount, body.returnUrl);
  }

  @Post('transbank/commit')
  @Roles('SUPERADMIN', 'ADMIN', 'EDITOR', 'CASHIER')
  async commitWebpay(
    @TenantId() tenantId: string,
    @Body() body: { token: string }
  ) {
    return this.paymentsService.commitWebpayTransaction(body.token, tenantId);
  }

  @Post('mercadopago/qr')
  @Roles('SUPERADMIN', 'ADMIN', 'EDITOR', 'CASHIER')
  async generateQr(
    @TenantId() tenantId: string,
    @Body() body: { invoiceId: string; amount: number; description: string }
  ) {
    return this.paymentsService.createMercadoPagoQR(tenantId, body.invoiceId, body.amount, body.description);
  }
}
