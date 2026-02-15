import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant.decorator';

@UseGuards(JwtAuthGuard)
@Controller('pricing')
export class PricingController {
    constructor(private readonly pricingService: PricingService) { }

    @Post('lists')
    async createPriceList(
        @TenantId() tenantId: string,
        @Body('name') name: string,
        @Body('currency') currency?: string
    ) {
        return this.pricingService.createPriceList(tenantId, name, currency as any);
    }

    @Get('lists')
    async getPriceLists(@TenantId() tenantId: string) {
        return this.pricingService.getPriceLists(tenantId);
    }

    @Post('products')
    async setProductPrice(
        @Body('priceListId') priceListId: string,
        @Body('productId') productId: string,
        @Body('price') price: number
    ) {
        return this.pricingService.setProductPrice(priceListId, productId, price);
    }

    @Get('products/:productId')
    async getPrice(
        @TenantId() tenantId: string,
        @Param('productId') productId: string,
        @Query('list') list?: string
    ) {
        return this.pricingService.getPrice(tenantId, productId, (list || 'Web') as any);
    }
}
