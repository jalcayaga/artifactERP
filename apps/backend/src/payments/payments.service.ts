import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Payment, InvoiceStatus, Prisma } from '@prisma/client'
import { CreatePaymentDto } from './dto/create-payment.dto'

import { InvoicesService } from '../invoices/invoices.service'

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private invoicesService: InvoicesService
  ) { }

  async create(
    tenantId: string,
    createPaymentDto: CreatePaymentDto
  ): Promise<Payment> {
    const { invoiceId, amount, ...paymentData } = createPaymentDto

    const result = await this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findFirst({
        where: { id: invoiceId, tenantId },
        include: { payments: true },
      })

      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${invoiceId} not found.`)
      }

      const newPayment = await tx.payment.create({
        data: {
          tenant: { connect: { id: tenantId } },
          ...paymentData,
          amount: new Prisma.Decimal(amount),
          invoice: { connect: { id: invoiceId } },
        },
      })

      const totalPaid = invoice.payments
        .reduce((acc, p) => acc.add(p.amount), new Prisma.Decimal(0))
        .add(newPayment.amount)

      let newStatus: InvoiceStatus = InvoiceStatus.PARTIALLY_PAID
      if (totalPaid.gte(invoice.grandTotal)) {
        newStatus = InvoiceStatus.PAID
      }

      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: newStatus },
      })

      return { payment: newPayment, status: newStatus }
    })

    // Process Post-Transaction Side Effects
    if (result.status === InvoiceStatus.PAID) {
      try {
        await this.invoicesService.emitExistingInvoice(tenantId, invoiceId)
      } catch (error) {
        console.error(`Error emitting invoice ${invoiceId} after payment:`, error)
        // We do not revert the payment as the payment logic WAS successful.
        // The Invoice is PAID but not EMITTED (or failed to emit).
        // User/Admin can retry emission manually.
      }
    }

    return result.payment
  }

  async findAll(tenantId: string, invoiceId?: string): Promise<Payment[]> {
    const where: Prisma.PaymentWhereInput = { tenantId }
    if (invoiceId) {
      where.invoiceId = invoiceId
    }

    return this.prisma.payment.findMany({
      where,
      orderBy: { paymentDate: 'desc' },
    })
  }

  async generatePaymentLink(tenantId: string, invoiceId: string, amount: number): Promise<{ url: string; provider: string }> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    const settings = (tenant?.settings as any)?.payments || {};

    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, tenantId }
    });

    if (!invoice) throw new NotFoundException('Invoice not found');

    // Check active provider
    if (settings.webpay?.enabled) {
      // In a real implementation, we would call Transbank SDK initTransaction here
      // using settings.webpay.commerceCode and settings.webpay.apiKey

      // For now, we return a simulated mock link that would handle the flow
      return {
        provider: 'Webpay',
        url: `https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0/transactions/mock/${invoice.invoiceNumber}`
      };
    }

    if (settings.mercadopago?.enabled) {
      return {
        provider: 'MercadoPago',
        url: `https://www.mercadopago.cl/checkout/v1/redirect?pref_id=mock-${invoice.id}`
      };
    }

    throw new Error('No active payment gateway configured for this tenant');
  }
}
