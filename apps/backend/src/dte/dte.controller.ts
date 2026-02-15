import { Controller, Post, Param, UseGuards, Body } from '@nestjs/common';
import { DteService } from './dte.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dte')
export class DteController {
    constructor(private readonly dteService: DteService) { }

    @Post(':invoiceId/issue')
    @Roles('ADMIN', 'SUPERADMIN')
    async issueDte(
        @TenantId() tenantId: string,
        @Param('invoiceId') invoiceId: string
    ) {
        return this.dteService.generateDte(tenantId, invoiceId);
    }

    @Post('caf/:companyId')
    @Roles('ADMIN', 'SUPERADMIN')
    async uploadCaf(
        @TenantId() tenantId: string,
        @Param('companyId') companyId: string,
        @Body('cafXml') cafXml: string
    ) {
        return this.dteService.registerCaf(tenantId, companyId, cafXml);
    }

    @Post(':invoiceId/submit')
    @Roles('ADMIN', 'SUPERADMIN')
    async submitDte(
        @TenantId() tenantId: string,
        @Param('invoiceId') invoiceId: string
    ) {
        return this.dteService.submitInvoiceToSii(tenantId, invoiceId);
    }
}
