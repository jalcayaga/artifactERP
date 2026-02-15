import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant.decorator';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get('sku/:sku')
    async getStockBySku(@TenantId() tenantId: string, @Param('sku') sku: string) {
        return this.inventoryService.getStockBySku(tenantId, sku);
    }

    @Get('barcode/:code')
    async getStockByBarcode(@TenantId() tenantId: string, @Param('code') code: string) {
        return this.inventoryService.getStockByBarcode(tenantId, code);
    }
}
