import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CouriersService } from './couriers.service';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantId } from '../common/decorators/tenant.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('couriers')
export class CouriersController {
    constructor(private readonly couriersService: CouriersService) { }

    @Post()
    @Roles('SUPERADMIN', 'ADMIN')
    create(@TenantId() tenantId: string, @Body() createCourierDto: CreateCourierDto) {
        return this.couriersService.create(tenantId, createCourierDto);
    }

    @Get()
    @Roles('SUPERADMIN', 'ADMIN', 'EDITOR', 'VIEWER')
    findAll(@TenantId() tenantId: string) {
        return this.couriersService.findAll(tenantId);
    }

    @Get(':id')
    @Roles('SUPERADMIN', 'ADMIN', 'EDITOR', 'VIEWER')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.couriersService.findOne(tenantId, id);
    }

    @Patch(':id')
    @Roles('SUPERADMIN', 'ADMIN')
    update(@TenantId() tenantId: string, @Param('id') id: string, @Body() updateCourierDto: UpdateCourierDto) {
        return this.couriersService.update(tenantId, id, updateCourierDto);
    }

    @Delete(':id')
    @Roles('SUPERADMIN', 'ADMIN')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.couriersService.remove(tenantId, id);
    }
}
