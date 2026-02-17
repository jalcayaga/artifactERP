import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelOffer, Prisma, OrderSource } from '@prisma/client';
import { CreateChannelOfferDto, UpdateChannelOfferDto } from './dto/channel-offer.dto';

@Injectable()
export class ChannelOffersService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, data: CreateChannelOfferDto): Promise<ChannelOffer> {
        // Check if offer already exists for this channel and product
        const existing = await this.prisma.channelOffer.findUnique({
            where: {
                tenantId_channel_productId: {
                    tenantId,
                    channel: data.channel,
                    productId: data.productId,
                },
            },
        });

        if (existing) {
            throw new ConflictException(`Offer already exists for product ${data.productId} on channel ${data.channel}`);
        }

        // Verify product belongs to tenant
        const product = await this.prisma.product.findFirst({
            where: { id: data.productId, tenantId },
        });

        if (!product) {
            throw new ForbiddenException(`Product ${data.productId} does not belong to the current tenant.`);
        }

        return this.prisma.channelOffer.create({
            data: {
                tenantId,
                channel: data.channel,
                productId: data.productId,
                price: new Prisma.Decimal(data.price),
                isActive: data.isActive ?? true,
                metadata: data.metadata ?? {},
                allowedLotIds: data.allowedLotIds ?? [],
            },
        });
    }

    async findAll(tenantId: string, channel?: OrderSource): Promise<ChannelOffer[]> {
        return this.prisma.channelOffer.findMany({
            where: {
                tenantId,
                ...(channel && { channel }),
            },
            include: {
                product: true,
            },
        });
    }

    async findOne(tenantId: string, id: string): Promise<ChannelOffer> {
        const offer = await this.prisma.channelOffer.findFirst({
            where: { id, tenantId },
            include: { product: true },
        });

        if (!offer) {
            throw new NotFoundException(`Channel offer with ID ${id} not found.`);
        }

        return offer;
    }

    async update(tenantId: string, id: string, data: UpdateChannelOfferDto): Promise<ChannelOffer> {
        const offer = await this.findOne(tenantId, id);

        const updateData: Prisma.ChannelOfferUpdateInput = {};

        if (data.price !== undefined) {
            updateData.price = new Prisma.Decimal(data.price);
        }
        if (data.isActive !== undefined) {
            updateData.isActive = data.isActive;
        }
        if (data.metadata !== undefined) {
            updateData.metadata = data.metadata;
        }
        if (data.allowedLotIds !== undefined) {
            updateData.allowedLotIds = data.allowedLotIds;
        }

        return this.prisma.channelOffer.update({
            where: { id: offer.id },
            data: updateData,
        });
    }

    async remove(tenantId: string, id: string): Promise<ChannelOffer> {
        const offer = await this.findOne(tenantId, id);
        return this.prisma.channelOffer.delete({
            where: { id: offer.id },
        });
    }

    async findByProductAndChannel(tenantId: string, productId: string, channel: OrderSource): Promise<ChannelOffer | null> {
        return this.prisma.channelOffer.findUnique({
            where: {
                tenantId_channel_productId: {
                    tenantId,
                    channel,
                    productId,
                },
            },
        });
    }
}
