
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { Order, Product, ProductType, OrderStatus, PaymentStatus } from '@prisma/client';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item.');
    }

    return this.prisma.client.$transaction(async (tx) => {
      let subTotalAmount = 0;
      let totalVatAmount = 0;
      const orderItemsData = [];

      for (const itemDto of createOrderDto.items) {
        const product: Product | null = await tx.product.findUnique({ where: { id: itemDto.productId } });
        if (!product) {
          throw new NotFoundException(`Product with ID ${itemDto.productId} not found.`);
        }
        if (!product.isPublished) {
            throw new BadRequestException(`Product "${product.name}" is not available for purchase.`);
        }

        if (product.productType === ProductType.PRODUCT && product.currentStock !== null) {
          if (product.currentStock < itemDto.quantity) {
            throw new ConflictException(
              `Not enough stock for product "${product.name}". Requested: ${itemDto.quantity}, Available: ${product.currentStock}.`
            );
          }
        }
        
        const unitPrice = product.price;
        const totalItemPrice = Number(unitPrice) * itemDto.quantity;
        const vatRate = createOrderDto.vatRatePercent !== undefined ? createOrderDto.vatRatePercent : 19.0;
        const itemVat = totalItemPrice * (vatRate / 100);

        subTotalAmount += totalItemPrice;
        totalVatAmount += itemVat;

        orderItemsData.push({
          productId: product.id,
          productNameSnapshot: product.name,
          productSkuSnapshot: product.sku,
          quantity: itemDto.quantity,
          unitPriceSnapshot: unitPrice,
          totalItemPrice: totalItemPrice,
          itemVatAmount: itemVat,
        });

        if (product.productType === ProductType.PRODUCT && product.currentStock !== null) {
          await tx.product.update({
            where: { id: product.id },
            data: { currentStock: { decrement: itemDto.quantity } },
          });
        }
      }

      const shippingAmount = createOrderDto.shippingAmount || 0;
      const discountAmount = createOrderDto.discountAmount || 0;
      const grandTotalAmount = subTotalAmount + totalVatAmount + shippingAmount - discountAmount;

      const newOrder = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING_PAYMENT,
          paymentStatus: PaymentStatus.PENDING,
          subTotalAmount,
          vatAmount: totalVatAmount,
          vatRatePercent: createOrderDto.vatRatePercent !== undefined ? createOrderDto.vatRatePercent : 19.0,
          discountAmount,
          shippingAmount,
          grandTotalAmount,
          currency: createOrderDto.currency || 'CLP',
          shippingAddress: createOrderDto.shippingAddress ? JSON.stringify(createOrderDto.shippingAddress) : undefined,
          billingAddress: createOrderDto.billingAddress ? JSON.stringify(createOrderDto.billingAddress) : undefined,
          customerNotes: createOrderDto.customerNotes,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: { orderItems: { include: {product: true} } },
      });

      return newOrder;
    });
  }

  async findUserOrders(userId: string, page: number = 1, limit: number = 10): Promise<{data: Order[], total: number, pages: number}> {
    const skip = (page - 1) * limit;
    const total = await this.prisma.client.order.count({ where: { userId } });
    const data = await this.prisma.client.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          select: { 
            id: true, 
            productNameSnapshot: true, 
            quantity: true, 
            unitPriceSnapshot: true,
            totalItemPrice: true, 
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: limit,
    });
    return {data, total, pages: Math.ceil(total/limit)};
  }

  async findOneUserOrder(orderId: string, userId: string): Promise<Order | null> {
    const order = await this.prisma.client.order.findFirst({
      where: { id: orderId, userId },
      include: {
        orderItems: {
          include: {
            product: { 
              select: { id: true, name: true, sku: true, images: true, productType: true }
            } 
          }
        },
        user: { 
            select: { firstName: true, lastName: true, email: true}
        }
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found or does not belong to the user.`);
    }
    return order;
  }
}
