import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Invoice, InvoiceStatus, Prisma } from '@prisma/client';
import { DteService, DteFacturaData } from '../dte/dte.service';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    private prisma: PrismaService,
    private dteService: DteService,
  ) {}

  async createFromOrder(orderId: string): Promise<Invoice> {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { orderItems: { include: { product: true } }, company: true },
      });

      if (!order) throw new NotFoundException(`Order with ID ${orderId} not found.`);
      const existingInvoice = await tx.invoice.findFirst({ where: { orderId } });
      if (existingInvoice) throw new ConflictException(`Order with ID ${orderId} has already been invoiced.`);
      if (!order.company.rut || !order.company.giro) throw new ConflictException(`Company for order ${orderId} is missing RUT or Giro.`);

      const invoiceCount = await tx.invoice.count();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${invoiceCount + 1}`;

      const newInvoice = await tx.invoice.create({
        data: {
          orderId: orderId,
          companyId: order.companyId,
          invoiceNumber,
          status: InvoiceStatus.DRAFT,
          issueDate: new Date(),
          subTotalAmount: order.subTotalAmount,
          vatAmount: order.vatAmount,
          grandTotal: order.grandTotalAmount,
          items: {
            create: order.orderItems.map(item => ({
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
      });

      const dteData: DteFacturaData = {
        receptorRut: newInvoice.company.rut,
        receptorRazon: newInvoice.company.name,
        receptorDireccion: newInvoice.company.address,
        receptorComuna: newInvoice.company.city,
        receptorCiudad: newInvoice.company.city,
        receptorGiro: newInvoice.company.giro,
        fechaEmision: newInvoice.issueDate.toISOString().split('T')[0],
        items: newInvoice.items.map(item => ({
          nombre: item.product.name,
          cantidad: item.quantity,
          precio: item.unitPrice.toNumber(),
        })),
        totalAfecto: newInvoice.subTotalAmount.toNumber(),
        totalIva: newInvoice.vatAmount.toNumber(),
        totalFinal: newInvoice.grandTotal.toNumber(),
      };

      try {
        const dteResult = await this.dteService.emitirFactura(dteData);
        return await tx.invoice.update({
          where: { id: newInvoice.id },
          data: {
            status: InvoiceStatus.SENT,
            dteStatus: dteResult.status,
            dteFolio: parseInt(dteResult.folio, 10),
            dteXmlUrl: dteResult.xmlUrl,
            dtePdfUrl: dteResult.pdfUrl,
          },
        });
      } catch (error) {
        await tx.invoice.update({ where: { id: newInvoice.id }, data: { dteStatus: 'REJECTED' } });
        throw error;
      }
    });
  }

  async findAll(page: number, limit: number, status?: InvoiceStatus): Promise<{ data: Invoice[]; total: number; pages: number; currentPage: number }> {
    const skip = (page - 1) * limit;
    const where: Prisma.InvoiceWhereInput = {};
    if (status) {
      where.status = status;
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
    ]);
    return { data, total, pages: Math.ceil(total / limit), currentPage: page };
  }

  async findOne(id: string): Promise<Invoice | null> {
    return this.prisma.invoice.findUnique({ where: { id }, include: { items: { include: { product: true } }, company: true, order: true, payments: true } });
  }
}