import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { DispatchesService } from './dispatches.service';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantId } from '../common/decorators/tenant.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dispatches')
export class DispatchesController {
    constructor(private readonly dispatchesService: DispatchesService) { }

    @Post()
    @Roles('SUPERADMIN', 'ADMIN')
    create(@TenantId() tenantId: string, @Body() createDispatchDto: CreateDispatchDto) {
        return this.dispatchesService.create(tenantId, createDispatchDto);
    }

    @Get()
    @Roles('SUPERADMIN', 'ADMIN', 'EDITOR', 'VIEWER')
    findAll(@TenantId() tenantId: string) {
        return this.dispatchesService.findAll(tenantId);
    }

    @Get(':id')
    @Roles('SUPERADMIN', 'ADMIN', 'EDITOR', 'VIEWER')
    async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.dispatchesService.findOne(tenantId, id);
    }

    @Get(':id/label')
    @Roles('SUPERADMIN', 'ADMIN', 'EDITOR', 'WAREHOUSE_MANAGER')
    async getLabel(@TenantId() tenantId: string, @Param('id') id: string, @Res() res: Response) {
        const zpl = await this.dispatchesService.generateZplLabel(tenantId, id);
        res.set('Content-Type', 'text/plain');
        res.send(zpl);
    }

    @Patch(':id')
    @Roles('SUPERADMIN', 'ADMIN')
    update(@TenantId() tenantId: string, @Param('id') id: string, @Body() updateDispatchDto: UpdateDispatchDto) {
        return this.dispatchesService.update(tenantId, id, updateDispatchDto);
    }
}
