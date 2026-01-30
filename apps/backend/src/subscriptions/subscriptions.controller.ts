import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @Get()
    @Roles('ADMIN', 'SUPERADMIN')
    findAll(@Request() req: any) {
        return this.subscriptionsService.findAll(req.user.tenantId);
    }

    @Post('manual-renewal')
    @Roles('SUPERADMIN')
    async manualRenewal() {
        await this.subscriptionsService.processRenewals();
        return { message: 'Renewal process triggered manually' };
    }

    @Post('cron-renewal')
    @UseGuards(ApiKeyGuard)
    async cronRenewal() {
        await this.subscriptionsService.processRenewals();
        return { message: 'Renewal cron triggered successfully' };
    }
}
