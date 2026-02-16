import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';
import { ProductsService } from '../products/products.service';
import { DispatchStatus } from '@prisma/client';

@Injectable()
export class DispatchesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly productsService: ProductsService,
    ) { }

    async create(tenantId: string, createDispatchDto: CreateDispatchDto) {
        const { orderId, ...rest } = createDispatchDto;

        // 1. Validate Order exists and belongs to tenant
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: true,
                user: true, // To get customer address if needed
            },
        });

        if (!order || order.tenantId !== tenantId) {
            throw new NotFoundException('Order not found');
        }

        // 2. Check if a dispatch already exists for this order (Simple 1:1 logic for now, can be 1:N later)
        const existingDispatch = await this.prisma.dispatch.findFirst({
            where: { orderId },
        });

        if (existingDispatch) {
            throw new BadRequestException('A dispatch already exists for this order.');
        }

        return this.prisma.$transaction(async (tx) => {
            // 3. Create Dispatch Header
            const dispatch = await tx.dispatch.create({
                data: {
                    tenantId,
                    orderId,
                    status: DispatchStatus.ISSUED, // Automatically issued for now
                    originAddress: rest.originAddress || 'Bodega Central', // Default logic
                    destinationAddress: rest.destinationAddress || 'Dirección Cliente', // Placeholder
                    ...rest,
                },
            });

            // 4. Create Dispatch Items & Deduct Stock
            // We assume full dispatch of the order for MVP
            for (const item of order.orderItems) {
                // Create Dispatch Item record
                await tx.dispatchItem.create({
                    data: {
                        dispatchId: dispatch.id,
                        orderItemId: item.id,
                        quantity: item.quantity,
                    },
                });

                // DEDUCT PHYSICAL STOCK
                // Assuming ProductsService has a method to finalize/deduct stock.
                // If not, we implement the logic here using the reserved lots.
                // Based on previous analysis, we need to find the lots reserved for this OrderItem.

                const reservedLots = await tx.orderItemLot.findMany({
                    where: { orderItemId: item.id }
                });

                for (const reserved of reservedLots) {
                    await tx.lot.update({
                        where: { id: reserved.lotId },
                        data: {
                            currentQuantity: { decrement: reserved.quantityTaken },
                            committedQuantity: { decrement: reserved.quantityTaken } // Release the commitment as it is now "out"
                        }
                    });
                }
            }

            return dispatch;
        });
    }

    async findAll(tenantId: string, page: number = 1, limit: number = 10, orderId?: string) {
        const skip = (page - 1) * limit;
        const where: any = { tenantId };

        if (orderId) {
            where.orderId = orderId;
        }

        const [data, total] = await this.prisma.$transaction([
            this.prisma.dispatch.findMany({
                where,
                skip,
                take: limit,
                include: {
                    order: {
                        select: {
                            id: true,
                            user: { select: { firstName: true, lastName: true } },
                            company: { select: { name: true } }
                        }
                    },
                    courier: {
                        select: { name: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.dispatch.count({ where }),
        ]);

        return {
            data,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    async findOne(tenantId: string, id: string) {
        const dispatch = await this.prisma.dispatch.findFirst({
            where: { id, tenantId },
            include: {
                items: {
                    include: {
                        orderItem: {
                            include: { product: true }
                        }
                    }
                },
                order: {
                    include: {
                        user: true,
                        company: true
                    }
                },
                courier: true,
            },
        });

        if (!dispatch) {
            throw new NotFoundException(`Dispatch with ID ${id} not found`);
        }
        return dispatch;
    }

    async update(tenantId: string, id: string, updateDispatchDto: UpdateDispatchDto) {
        await this.findOne(tenantId, id);
        return this.prisma.dispatch.update({
            where: { id },
            data: updateDispatchDto,
        });
    }

    async generateZplLabel(tenantId: string, id: string) {
        const dispatch = await this.findOne(tenantId, id);

        // Sanitize data
        const destName = (dispatch.order?.user?.firstName + ' ' + (dispatch.order?.user?.lastName || '')).toUpperCase().substring(0, 30);
        const destAddress = (dispatch.destinationAddress || '').toUpperCase().substring(0, 40);
        const companyName = (dispatch.order?.company?.name || 'ARTIFACT ERP').toUpperCase().substring(0, 30);
        const dispatchId = dispatch.id.split('-').pop(); // Short ID for display
        const date = new Date().toLocaleDateString('es-CL');
        const skuList = dispatch.items.map(i => i.orderItem.product.sku).join(', ').substring(0, 40);

        // ZPL Code for 4x4 or 4x6 label (approximately)
        // ^XA - Start
        // ^FO - Field Origin (x,y)
        // ^A0N - Font Scalable
        // ^B Q - QR Code
        // ^BC - Code 128 Barcode
        // ^GB - Graphic Box

        return `
^XA
^PW812
^LL1218
^FO50,50^GB712,1118,4^FS

^FO100,100^A0N,60,60^FD${companyName}^FS
^FO100,180^A0N,30,30^FDORIGEN: ${dispatch.originAddress || 'BODEGA CENTRAL'}^FS
^FO100,220^GB612,0,2^FS

^FO100,250^A0N,40,40^FDDESTINATARIO:^FS
^FO100,300^A0N,50,50^FD${destName}^FS
^FO100,360^A0N,30,30^FDDireccion: ${destAddress}^FS

^FO100,450^GB612,0,2^FS

^FO100,480^A0N,40,40^FDCONTENIDO:^FS
^FO100,530^A0N,30,30^FD${skuList}^FS

^FO100,650^BQN,2,10^FDQA,${dispatch.id}^FS
^FO350,680^BCN,100,Y,N,N^FD${dispatch.id}^FS

^FO100,850^A0N,30,30^FDFECHA: ${date} | GUIA: ${dispatch.dispatchNumber || 'S/N'}^FS
^XZ
        `.trim();
    }
}
