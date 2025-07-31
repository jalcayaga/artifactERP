import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, InvoiceStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData() {
    const totalUsers = await this.prisma.user.count();
    const totalProducts = await this.prisma.product.count();
    const totalOrders = await this.prisma.order.count();
    const sales = await this.prisma.order.aggregate({
      _sum: { grandTotalAmount: true },
      where: { status: { in: [OrderStatus.DELIVERED, OrderStatus.SHIPPED] } },
    });

    const pendingInvoices = await this.prisma.invoice.count({
      where: { status: { in: [InvoiceStatus.DRAFT, InvoiceStatus.SENT] } },
    });

    const recentActivities = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalSalesAmount: sales._sum.grandTotalAmount || 0,
      pendingInvoices,
      recentActivities,
    };
  }
}