import { Controller, Post, Get, Body, Param, Headers, Logger, Header } from '@nestjs/common';
import { FacebookCatalogService } from './facebook-catalog.service';
import { IntegrationsService } from './integrations.service';
import { OrderSource } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@Controller('integrations')
export class IntegrationsController {
    private readonly logger = new Logger(IntegrationsController.name);

    constructor(
        private readonly integrationsService: IntegrationsService,
        private readonly facebookCatalogService: FacebookCatalogService,
    ) { }

    @Public()
    @Post('webhook/:tenantId/:provider')
    async handleWebhook(
        @Param('tenantId') tenantId: string,
        @Param('provider') provider: string,
        @Body() payload: any,
    ) {
        this.logger.log(`Received webhook for tenant ${tenantId} from ${provider}`);

        // Normalize provider string to OrderSource enum
        const source = provider.toUpperCase() as OrderSource;

        return this.integrationsService.handleIncomingWebhook(tenantId, source, payload);
    }

    @Public()
    @Get('catalog/facebook/:tenantId')
    @Header('Content-Type', 'application/xml')
    async getFacebookCatalog(@Param('tenantId') tenantId: string) {
        return this.facebookCatalogService.generateXmlFeed(tenantId);
    }
}
