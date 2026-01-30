import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma, OrderStatus, InvoiceStatus, QuoteStatus } from '@prisma/client'

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }

  async getDashboardData(tenantId: string, companyId?: string) {
    try {
      const orderWhere: Prisma.OrderWhereInput = { tenantId }
      if (companyId) {
        orderWhere.companyId = companyId
      }

      const invoiceWhere: Prisma.InvoiceWhereInput = { tenantId }
      if (companyId) {
        invoiceWhere.companyId = companyId
      }

      const quoteWhere: Prisma.QuoteWhereInput = { tenantId }
      if (companyId) {
        quoteWhere.companyId = companyId
      }

      const userWhere: Prisma.UserWhereInput = { tenantId }
      if (companyId) {
        userWhere.companies = { some: { id: companyId } }
      }

      const subscriptionWhere: Prisma.SubscriptionWhereInput = { tenantId }
      if (companyId) {
        subscriptionWhere.companyId = companyId
      }

      const totalUsers = await this.prisma.user.count({ where: userWhere })

      const totalProducts = await this.prisma.product.count({
        where: { tenantId },
      })

      const totalOrders = await this.prisma.order.count({ where: orderWhere })

      const sales = await this.prisma.order.aggregate({
        _sum: { grandTotalAmount: true },
        where: {
          ...orderWhere,
          status: { in: [OrderStatus.DELIVERED, OrderStatus.SHIPPED] },
        },
      })

      const pendingInvoices = await this.prisma.invoice.count({
        where: {
          ...invoiceWhere,
          status: { in: [InvoiceStatus.DRAFT, InvoiceStatus.SENT] },
        },
      })

      const acceptedQuotes = await this.prisma.quote.count({
        where: {
          ...quoteWhere,
          status: QuoteStatus.ACCEPTED,
        },
      })

      const activeSubscriptions = await this.prisma.subscription.count({
        where: { ...subscriptionWhere, status: 'ACTIVE' },
      })

      const monthlySubs = await this.prisma.subscription.aggregate({
        _sum: { price: true },
        where: { ...subscriptionWhere, status: 'ACTIVE', interval: 'MONTHLY' },
      })

      const yearlySubs = await this.prisma.subscription.aggregate({
        _sum: { price: true },
        where: { ...subscriptionWhere, status: 'ACTIVE', interval: 'YEARLY' },
      })

      const totalMrr = (monthlySubs._sum.price?.toNumber() || 0) + (yearlySubs._sum.price?.toNumber() || 0) / 12;

      const recentActivities = await this.prisma.order.findMany({
        where: orderWhere,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          company: true,
        },
      })

      return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalSalesAmount: sales._sum.grandTotalAmount || 0,
        pendingInvoices,
        acceptedQuotes,
        activeSubscriptions,
        mrr: totalMrr,
        recentActivities,
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw error
    }
  }
}
