import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Payment, InvoiceStatus, Prisma } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { invoiceId, amount, ...paymentData } = createPaymentDto;

    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId },
        include: { payments: true },
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${invoiceId} not found.`);
      }

      const newPayment = await tx.payment.create({
        data: {
          ...paymentData,
          amount: new Prisma.Decimal(amount),
          invoice: { connect: { id: invoiceId } },
        },
      });

      const totalPaid = invoice.payments.reduce((acc, p) => acc.add(p.amount), new Prisma.Decimal(0)).add(newPayment.amount);

      let newStatus: InvoiceStatus = InvoiceStatus.PARTIALLY_PAID;
      if (totalPaid.gte(invoice.grandTotal)) {
        newStatus = InvoiceStatus.PAID;
      }

      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: newStatus },
      });

      return newPayment;
    });
  }

  async findAll(invoiceId?: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { invoiceId },
      orderBy: { paymentDate: 'desc' },
    });
  }
}
