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
import { WarehousesService } from './warehouses.service'
import { CreateWarehouseDto } from './dto/create-warehouse.dto'
import { UpdateWarehouseDto } from './dto/update-warehouse.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TenantId } from '../common/decorators/tenant.decorator'

@Controller('warehouses')
@UseGuards(JwtAuthGuard)
export class WarehousesController {
    constructor(private readonly warehousesService: WarehousesService) { }

    @Post()
    create(
        @TenantId() tenantId: string,
        @Body() createWarehouseDto: CreateWarehouseDto
    ) {
        return this.warehousesService.create(tenantId, createWarehouseDto)
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.warehousesService.findAll(tenantId)
    }

    @Get(':id')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.warehousesService.findOne(tenantId, id)
    }

    @Patch(':id')
    update(
        @TenantId() tenantId: string,
        @Param('id') id: string,
        @Body() updateWarehouseDto: UpdateWarehouseDto
    ) {
        return this.warehousesService.update(tenantId, id, updateWarehouseDto)
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.warehousesService.remove(tenantId, id)
    }
}
