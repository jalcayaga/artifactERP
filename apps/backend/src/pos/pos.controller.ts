import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PosService } from './pos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pos')
export class PosController {
    constructor(private readonly posService: PosService) { }

    @Post('registers')
    @Roles('ADMIN', 'SUPERADMIN')
    async createRegister(
        @TenantId() tenantId: string,
        @Body('name') name: string,
        @Body('code') code?: string
    ) {
        return this.posService.createRegister(tenantId, name, code);
    }

    @Get('registers')
    async getRegisters(@TenantId() tenantId: string) {
        return this.posService.getRegisters(tenantId);
    }

    @Post('shifts/open')
    async openShift(
        @TenantId() tenantId: string,
        @Request() req,
        @Body('registerId') registerId: string,
        @Body('initialCash') initialCash: number
    ) {
        console.log(`[PosController] openShift called. Tenant: ${tenantId}, Register: ${registerId}, Cash: ${initialCash}`);
        return this.posService.openShift(tenantId, registerId, req.user.id, initialCash);
    }

    @Post('shifts/:id/close')
    async closeShift(
        @TenantId() tenantId: string,
        @Param('id') shiftId: string,
        @Body('finalCash') finalCash: number,
        @Body('notes') notes?: string
    ) {
        return this.posService.closeShift(tenantId, shiftId, finalCash, notes);
    }

    @Get('shifts/:id')
    async getShift(@TenantId() tenantId: string, @Param('id') shiftId: string) {
        return this.posService.getShiftSummary(tenantId, shiftId);
    }
}
