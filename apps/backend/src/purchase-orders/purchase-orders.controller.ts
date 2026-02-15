import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common'
import { PurchaseOrdersService } from './purchase-orders.service'
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto'
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TenantId } from '../common/decorators/tenant.decorator'

@Controller('purchase-orders')
@UseGuards(JwtAuthGuard)
export class PurchaseOrdersController {
    constructor(private readonly purchaseOrdersService: PurchaseOrdersService) { }

    @Post()
    create(
        @TenantId() tenantId: string,
        @Body() createPurchaseOrderDto: CreatePurchaseOrderDto
    ) {
        return this.purchaseOrdersService.create(tenantId, createPurchaseOrderDto)
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        // Extend with optional filtering? For now basic.
        return this.purchaseOrdersService.findAll(tenantId)
    }

    @Get(':id')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.purchaseOrdersService.findOne(tenantId, id)
    }

    @Patch(':id')
    update(
        @TenantId() tenantId: string,
        @Param('id') id: string,
        @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto
    ) {
        return this.purchaseOrdersService.update(tenantId, id, updatePurchaseOrderDto)
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.purchaseOrdersService.remove(tenantId, id)
    }
}
