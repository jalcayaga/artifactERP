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
import { ReceptionsService } from './receptions.service'
import { CreateReceptionDto } from './dto/create-reception.dto'
import { UpdateReceptionDto } from './dto/update-reception.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TenantId } from '../common/decorators/tenant.decorator'

@Controller('receptions')
@UseGuards(JwtAuthGuard)
export class ReceptionsController {
    constructor(private readonly receptionsService: ReceptionsService) { }

    @Post()
    create(
        @TenantId() tenantId: string,
        @Body() createReceptionDto: CreateReceptionDto
    ) {
        return this.receptionsService.create(tenantId, createReceptionDto)
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.receptionsService.findAll(tenantId)
    }

    @Get(':id')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.receptionsService.findOne(tenantId, id)
    }

    @Patch(':id')
    update(
        @TenantId() tenantId: string,
        @Param('id') id: string,
        @Body() updateReceptionDto: UpdateReceptionDto
    ) {
        return this.receptionsService.update(tenantId, id, updateReceptionDto)
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.receptionsService.remove(tenantId, id)
    }
}
