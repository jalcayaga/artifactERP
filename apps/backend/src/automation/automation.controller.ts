
import { Controller, Get, Query, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { N8nGuard } from './guards/n8n.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('automation')
export class AutomationController {
    constructor(private readonly automationService: AutomationService) { }

    @Public() // We use N8nGuard explicitly to support non-JWT auth from n8n
    @UseGuards(N8nGuard)
    @Get('products')
    async searchProducts(
        @Query('tenantId') tenantId: string,
        @Query('term') term: string
    ) {
        if (!tenantId || !term) {
            throw new UnauthorizedException('tenantId and term are required');
        }
        return this.automationService.getEnrichedProductSearch(tenantId, term);
    }

    @Public()
    @UseGuards(N8nGuard)
    @Get('client')
    async getClient(
        @Query('tenantId') tenantId: string,
        @Query('phone') phone: string
    ) {
        if (!tenantId || !phone) {
            throw new UnauthorizedException('tenantId and phone are required');
        }
        return this.automationService.getClientByPhone(tenantId, phone);
    }
}
