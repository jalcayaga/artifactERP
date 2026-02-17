import { Controller, Post, Body, Param, Get, Patch, UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialWebhookDto, CreateSocialMessageDto } from './dto/social.dto';
import { SocialProvider } from '@prisma/client';

@Controller('social')
export class SocialController {
    constructor(private readonly socialService: SocialService) { }

    @Post('webhook/:tenantId')
    async handleWebhook(
        @Param('tenantId') tenantId: string,
        @Body() body: any // Dynamic body from Evolution API via n8n
    ) {
        // In a real implementation, n8n would normalize the body to CreateSocialMessageDto
        // For now, let's assume a simplified normalization or that n8n sends it correctly

        const instanceName = body.instance;
        const messageData = body.data;

        if (body.event === 'messages-upsert') {
            const dto: CreateSocialMessageDto = {
                externalId: messageData.key.id,
                platform: body.platform || 'WHATSAPP', // Expected from n8n
                from: messageData.key.remoteJid.split('@')[0],
                name: messageData.pushName || 'Unknown',
                content: messageData.message?.conversation || messageData.message?.extendedTextMessage?.text,
                mediaType: messageData.message?.imageMessage ? 'image' :
                    messageData.message?.audioMessage ? 'audio' :
                        messageData.message?.videoMessage ? 'video' :
                            messageData.message?.documentMessage ? 'document' : null,
            };

            return this.socialService.handleIncomingMessage(tenantId, instanceName, dto);
        }

        return { status: 'event ignored' };
    }

    @Get('conversations/:tenantId')
    async getConversations(@Param('tenantId') tenantId: string) {
        return this.socialService.getConversations(tenantId);
    }

    @Get('messages/:tenantId/:conversationId')
    async getMessages(
        @Param('tenantId') tenantId: string,
        @Param('conversationId') conversationId: string
    ) {
        return this.socialService.getMessages(tenantId, conversationId);
    }

    @Patch('conversations/:tenantId/:conversationId/read')
    async markAsRead(
        @Param('tenantId') tenantId: string,
        @Param('conversationId') conversationId: string
    ) {
        return this.socialService.markAsRead(tenantId, conversationId);
    }
}
