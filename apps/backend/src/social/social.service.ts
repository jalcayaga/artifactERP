import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocialProvider, Prisma } from '@prisma/client';
import { CreateSocialMessageDto } from './dto/social.dto';

@Injectable()
export class SocialService {
    private readonly logger = new Logger(SocialService.name);

    constructor(private prisma: PrismaService) { }

    async handleIncomingMessage(tenantId: string, instanceName: string, dto: CreateSocialMessageDto) {
        // 1. Find Social Account
        const account = await this.prisma.socialAccount.findUnique({
            where: {
                tenantId_instanceName: {
                    tenantId,
                    instanceName,
                },
            },
        });

        if (!account) {
            this.logger.error(`Social account ${instanceName} not found for tenant ${tenantId}`);
            return;
        }

        // 2. Find or Create Conversation
        let conversation = await this.prisma.socialConversation.findUnique({
            where: {
                accountId_externalId: {
                    accountId: account.id,
                    externalId: dto.from,
                },
            },
        });

        if (!conversation) {
            // Auto-link context: Search if contact already exists in companies by phone/email
            const contact = await this.findMatchingCompany(tenantId, dto.from);

            conversation = await this.prisma.socialConversation.create({
                data: {
                    tenantId,
                    accountId: account.id,
                    platform: dto.platform,
                    externalId: dto.from,
                    contactId: contact?.id || null,
                    unreadCount: 1,
                },
            });
        } else {
            // Update unread count if it's an incoming message
            await this.prisma.socialConversation.update({
                where: { id: conversation.id },
                data: {
                    unreadCount: { increment: 1 },
                    updatedAt: new Date(),
                },
            });
        }

        // 3. Persist Message
        const message = await this.prisma.socialMessage.create({
            data: {
                tenantId,
                conversationId: conversation.id,
                direction: 'IN',
                content: dto.content,
                mediaPath: dto.mediaUrl, // TODO: Implement Supabase Storage download/upload
                mediaType: dto.mediaType,
                externalId: dto.externalId,
            },
        });

        // 4. Update conversation's last message
        await this.prisma.socialConversation.update({
            where: { id: conversation.id },
            data: {
                lastMessage: dto.content || `[${dto.mediaType || 'Archivo'}]`,
            },
        });

        return message;
    }

    private async findMatchingCompany(tenantId: string, phone: string) {
        // Basic cleaning of phone number for search (WhatsApp numbers often have 569...)
        const cleanPhone = phone.replace(/\D/g, '');

        // Try different phone variations if needed, but for now exact match or partial
        return this.prisma.company.findFirst({
            where: {
                tenantId,
                OR: [
                    { phone: { contains: cleanPhone } },
                    { phone: { contains: phone } },
                ],
            },
        });
    }

    async getConversations(tenantId: string) {
        return this.prisma.socialConversation.findMany({
            where: { tenantId },
            include: {
                contact: true,
                messages: {
                    take: 1,
                    orderBy: { timestamp: 'desc' },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async getMessages(tenantId: string, conversationId: string) {
        return this.prisma.socialMessage.findMany({
            where: { tenantId, conversationId },
            orderBy: { timestamp: 'asc' },
        });
    }

    async markAsRead(tenantId: string, conversationId: string) {
        return this.prisma.socialConversation.update({
            where: { id: conversationId, tenantId },
            data: { unreadCount: 0 },
        });
    }
}
