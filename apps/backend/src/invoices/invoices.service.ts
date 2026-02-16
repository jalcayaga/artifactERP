import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Invoice, InvoiceStatus, Prisma } from '@prisma/client'
import { DteService, DteFacturaData } from '../dte/dte.service'

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name)

  constructor(
    private prisma: PrismaService,
    private dteService: DteService
  ) { }

  async createFromOrder(tenantId: string, orderId: string): Promise<Invoice> {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, tenantId },
        include: { orderItems: { include: { product: true } }, company: true },
      })

      if (!order)
        throw new NotFoundException(`Order with ID ${orderId} not found.`)
      const existingInvoice = await tx.invoice.findFirst({
        where: { orderId, tenantId },
      })
      if (existingInvoice)
        throw new ConflictException(
          `Order with ID ${orderId} has already been invoiced.`
        )
      if (!order.company.rut || !order.company.giro)
        throw new ConflictException(
          `Company for order ${orderId} is missing RUT or Giro.`
        )

      const invoiceCount = await tx.invoice.count({ where: { tenantId } })
      const invoiceNumber = `INV-${new Date().getFullYear()}-${invoiceCount + 1}`

      const newInvoice = await tx.invoice.create({
        data: {
          tenantId,
          orderId: orderId,
          companyId: order.companyId,
          invoiceNumber,
          status: InvoiceStatus.DRAFT,
          issueDate: new Date(),
          subTotalAmount: order.subTotalAmount,
          vatAmount: order.vatAmount,
          grandTotal: order.grandTotalAmount,
          items: {
            create: order.orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              itemVatAmount: item.itemVatAmount,
              totalPriceWithVat: item.totalPriceWithVat,
            })),
          },
          dteProvider: 'Facto.cl',
          dteStatus: 'PENDING',
        },
        include: { items: { include: { product: true } }, company: true },
      })

      const dteData: DteFacturaData = {
        receptorRut: newInvoice.company.rut,
        receptorRazon: newInvoice.company.name,
        receptorDireccion: newInvoice.company.address,
        receptorComuna: newInvoice.company.city,
        receptorCiudad: newInvoice.company.city,
        receptorGiro: newInvoice.company.giro,
        fechaEmision: newInvoice.issueDate.toISOString().split('T')[0],
        items: newInvoice.items.map((item) => ({
          nombre: item.product.name,
          cantidad: item.quantity,
          precio: item.unitPrice.toNumber(),
        })),
        totalAfecto: newInvoice.subTotalAmount.toNumber(),
        totalIva: newInvoice.vatAmount.toNumber(),
        totalFinal: newInvoice.grandTotal.toNumber(),
      }

      try {
        const dteResult = await this.dteService.emitirFactura(tenantId, dteData)
        return await tx.invoice.update({
          where: { id: newInvoice.id },
          data: {
            status: InvoiceStatus.SENT,
            dteStatus: dteResult.status,
            dteFolio: parseInt(dteResult.folio, 10),
            dteXmlUrl: dteResult.xmlUrl,
            dtePdfUrl: dteResult.pdfUrl,
          },
        })
      } catch (error) {
        await tx.invoice.update({
          where: { id: newInvoice.id },
          data: { dteStatus: 'REJECTED' },
        })
        throw error
      }
    })
  }

  async findAll(
    tenantId: string,
    page: number,
    limit: number,
    status?: InvoiceStatus,
    dteType?: number
  ): Promise<{
    data: Invoice[]
    total: number
    pages: number
    currentPage: number
  }> {
    const skip = (page - 1) * limit
    const where: Prisma.InvoiceWhereInput = { tenantId }
    if (status) {
      where.status = status
    }
    if (dteType) {
      where.dteType = dteType
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { company: true, payments: true },
      }),
      this.prisma.invoice.count({ where }),
    ])
    return { data, total, pages: Math.ceil(total / limit), currentPage: page }
  }

  async emitExistingInvoice(tenantId: string, invoiceId: string): Promise<Invoice> {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, tenantId },
      include: {
        company: true,
        items: { include: { product: true } }
      }
    })

    if (!invoice) throw new NotFoundException(`Invoice ${invoiceId} not found`)
    if (invoice.status === InvoiceStatus.VOID) throw new ConflictException('Invoice is VOID')
    if (invoice.dteStatus === 'ACCEPTED') throw new ConflictException('Invoice already emitted')

    const dteData: DteFacturaData = {
      receptorRut: invoice.company.rut!,
      receptorRazon: invoice.company.name,
      receptorDireccion: invoice.company.address || '',
      receptorComuna: invoice.company.city || '',
      receptorCiudad: invoice.company.city || '',
      receptorGiro: invoice.company.giro || 'Servicios',
      fechaEmision: invoice.issueDate.toISOString().split('T')[0],
      items: invoice.items.map((item) => ({
        nombre: item.product.name,
        cantidad: item.quantity,
        precio: item.unitPrice.toNumber(),
      })),
      totalAfecto: invoice.subTotalAmount.toNumber(),
      totalIva: invoice.vatAmount.toNumber(),
      totalFinal: invoice.grandTotal.toNumber(),
    }

    try {
      const dteResult = await this.dteService.emitirFactura(tenantId, dteData)
      return await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: InvoiceStatus.SENT, // Or PAID if paid
          dteStatus: dteResult.status,
          dteFolio: parseInt(dteResult.folio, 10),
          dteXmlUrl: dteResult.xmlUrl,
          dtePdfUrl: dteResult.pdfUrl,
        },
      })
    } catch (error) {
      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: { dteStatus: 'REJECTED' },
      })
      throw error
    }
  }

  async findOne(tenantId: string, id: string): Promise<Invoice | null> {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, tenantId },
      include: {
        items: { include: { product: true } },
        company: true,
        order: true,
        payments: true,
      },
    })
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found.`)
    }
    return invoice
  }

  async cedeToFactoring(tenantId: string, id: string) {
    const invoice = await this.findOne(tenantId, id)
    // Here we would call the Factoring provider API based on tenant.settings.factoring
    this.logger.log(`Ceding invoice ${invoice?.invoiceNumber} to factoring for tenant ${tenantId}`)

    return {
      message: `Invoice ${invoice?.invoiceNumber} ceded to factoring successfully.`,
      status: 'CEDED',
      date: new Date()
    }
  }
}
