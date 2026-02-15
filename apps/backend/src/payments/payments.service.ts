import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Payment, InvoiceStatus, Prisma } from '@prisma/client'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { InvoicesService } from '../invoices/invoices.service'
import {
  WebpayPlus,
  Options,
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  Environment
} from 'transbank-sdk'
import { MercadoPagoConfig, Payment as MpPayment, Preference } from 'mercadopago'

@Injectable()
export class PaymentsService {
  private mpClient: MercadoPagoConfig | null = null;

  constructor(
    private prisma: PrismaService,
    private invoicesService: InvoicesService
  ) { }

  private getTransbankOptions(environment: 'INTEGRATION' | 'PRODUCTION') {
    if (environment === 'PRODUCTION') {
      return new WebpayPlus.Transaction(new Options(
        process.env.TBK_COMMERCE_CODE,
        process.env.TBK_API_KEY,
        Environment.Production
      ));
    } else {
      return new WebpayPlus.Transaction(new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
      ));
    }
  }

  private getMercadoPagoClient(accessToken: string) {
    if (!this.mpClient) {
      this.mpClient = new MercadoPagoConfig({ accessToken: accessToken });
    }
    return this.mpClient;
  }

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

  // --- TRANSBANK WEBPAY PLUS ---

  async initWebpayTransaction(tenantId: string, invoiceId: string, amount: number, returnUrl: string) {
    // 1. Get Tenant Settings
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    const settings = (tenant?.settings as any)?.payments?.webpay || {};

    const isProduction = settings.environment === 'PRODUCTION';
    const buyOrder = `ORD-${invoiceId.slice(-8)}-${Date.now().toString().slice(-4)}`;
    const sessionId = `S-${Date.now()}`;

    // 2. Initialize Transaction
    const tx = this.getTransbankOptions(isProduction ? 'PRODUCTION' : 'INTEGRATION');

    try {
      const response = await tx.create(
        buyOrder,
        sessionId,
        amount,
        returnUrl
      );
      return {
        token: response.token,
        url: response.url,
        buyOrder
      };
    } catch (error) {
      console.error("Transbank Init Error:", error);
      throw new BadRequestException("Failed to initialize Webpay transaction");
    }
  }

  async commitWebpayTransaction(token: string, tenantId: string) {
    // In a real app we need to know the environment. Verification requires knowing which environment was used.
    // For now, we default to Integration if no env is found, or we should store the token->env mapping in Redis/DB.
    // Assuming Integration for simplicity or checking tenant config again.

    const tx = new WebpayPlus.Transaction(new Options(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY,
      Environment.Integration
    ));

    try {
      const response = await tx.commit(token);

      if (response.status === 'AUTHORIZED') {
        // Parse buyOrder to find invoice? Or pass invoiceId in session?
        // Ideally we saved the temporary tx in DB. 
        return response;
      }
      return response;
    } catch (error) {
      console.error("Transbank Commit Error:", error);
      throw new BadRequestException("Failed to commit Webpay transaction");
    }
  }


  // --- MERCADO PAGO QR ---

  async createMercadoPagoQR(tenantId: string, invoiceId: string, amount: number, description: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    const settings = (tenant?.settings as any)?.payments?.mercadopago || {};

    if (!settings.accessToken) {
      throw new BadRequestException("Mercado Pago Access Token not configured");
    }

    // Initialize MP
    const client = new MercadoPagoConfig({ accessToken: settings.accessToken });
    const payment = new MpPayment(client);

    try {
      // For QR we usually use 'Instore Orders' API or generate a dynamic QR data string.
      // Since the libraries vary, for POS (Point of Smart) we use logic. 
      // For simple dynamic QR (Pix/Transfer style), we might create a Payment Intent.
      // BUT, for a visual QR in POS, simplest is to create a Payment with "pending" status 
      // and return the 'point_of_interaction.transaction_data.qr_code'.

      const body = {
        transaction_amount: amount,
        description: description,
        payment_method_id: 'pix', // Standard for QR in many regions, for Chile usually 'account_money' or similar via specific flow?
        // Start: In Chile MP QR is often via 'pos' creation. 
        // Simplification: We will mock the Qr Data return for now as the MP SDK Node structure for QR POS is complex.
        payer: {
          email: 'test_user_123@testuser.com'
        }
      };

      // MOCK for Implementation Plan Purpose - Real MP QR integration requires creating a POS terminal in MP Area first.
      return {
        qr_data: `00020101021243650016com.mercadolibre02013063638f1192a-5b9...MOCK_QR_FOR_${amount}`,
        transaction_id: `MP-${Date.now()}`
      };

    } catch (error) {
      console.error("Mercado Pago QR Error:", error);
      throw new BadRequestException("Failed to generate Mercado Pago QR");
    }
  }
  async createMercadoPagoPreference(tenantId: string, invoiceId: string, amount: number, backUrls: { success: string, failure: string, pending: string }) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    const settings = (tenant?.settings as any)?.payments?.mercadopago || {};

    if (!settings.accessToken) {
      throw new BadRequestException("Mercado Pago Access Token not configured");
    }

    const client = new MercadoPagoConfig({ accessToken: settings.accessToken });
    const preference = new Preference(client);

    try {
      const result = await preference.create({
        body: {
          items: [
            {
              id: invoiceId,
              title: `Orden #${invoiceId}`,
              quantity: 1,
              unit_price: amount,
              currency_id: 'CLP'
            }
          ],
          back_urls: backUrls,
          auto_return: 'approved',
          external_reference: invoiceId,
          statement_descriptor: `ORDER-${invoiceId.slice(-8)}`
        }
      });

      return {
        id: result.id,
        init_point: settings.environment === 'PRODUCTION' ? result.init_point : result.sandbox_init_point
      };
    } catch (error) {
      console.error("Mercado Pago Preference Error:", error);
      throw new BadRequestException("Failed to create Mercado Pago Preference");
    }
  }
  async generatePaymentLink(tenantId: string, invoiceId: string, amount: number) {
    // Default to Webpay for now
    // Return URL should probably be configured in env or passed in. 
    // For SaaS subscription, likely a specific callback.
    const returnUrl = `${process.env.STOREFRONT_URL}/checkout/success?invoiceId=${invoiceId}`;

    // For now we use Webpay init
    try {
      const result = await this.initWebpayTransaction(tenantId, invoiceId, amount, returnUrl);
      return { url: result.url + '?token_ws=' + result.token };
    } catch (e) {
      console.warn("Webpay failed, trying fallback or logging error", e);
      throw new BadRequestException("Could not generate payment link");
    }
  }
}

