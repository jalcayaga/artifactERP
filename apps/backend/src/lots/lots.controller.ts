import { Controller, Get, Param, Body, Patch, UseGuards } from '@nestjs/common'
import { LotsService } from './lots.service'
import { UpdateLotDto } from './dto/update-lot.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { TenantId } from '../common/decorators/tenant.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.lotsService.findAll(tenantId)
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.lotsService.findOne(tenantId, id)
  }

  @Patch(':id')
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateLotDto: UpdateLotDto
  ) {
    return this.lotsService.update(tenantId, id, updateLotDto)
  }
}
