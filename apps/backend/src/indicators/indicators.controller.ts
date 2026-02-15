import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('indicators')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class IndicatorsController {
    constructor(private readonly indicatorsService: IndicatorsService) { }

    @Get('latest')
    async getLatest() {
        return this.indicatorsService.getLatestIndicators();
    }

    @Post('update')
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
    async triggerUpdate() {
        return this.indicatorsService.fetchAndSaveIndicators();
    }
}
