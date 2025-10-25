import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, InvoiceStatus, QuoteStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(companyId: string) {
    try {
      const whereClause = { where: { companyId } };

      const totalUsers = await this.prisma.user.count({
        where: { companies: { some: { id: companyId } } },
      });

      const totalProducts = await this.prisma.product.count(); // Products are not company-specific in this model

      const totalOrders = await this.prisma.order.count(whereClause);

      const sales = await this.prisma.order.aggregate({
        _sum: { grandTotalAmount: true },
        where: {
          companyId,
          status: { in: [OrderStatus.DELIVERED, OrderStatus.SHIPPED] },
        },
      });

      const pendingInvoices = await this.prisma.invoice.count({
        where: {
          companyId,
          status: { in: [InvoiceStatus.DRAFT, InvoiceStatus.SENT] },
        },
      });

      const acceptedQuotes = await this.prisma.quote.count({
        where: {
          companyId,
          status: QuoteStatus.ACCEPTED,
        },
      });

      const recentActivities = await this.prisma.order.findMany({
        where: { companyId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          company: true,
        },
      });

      return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalSalesAmount: sales._sum.grandTotalAmount || 0,
        pendingInvoices,
        acceptedQuotes,
        recentActivities,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}