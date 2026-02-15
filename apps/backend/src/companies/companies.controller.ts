import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Roles } from '../common/decorators/roles.decorator'
import { UserRole } from '@artifact/core'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard'
import { TenantId } from '../common/decorators/tenant.decorator'

@UseGuards(JwtAuthGuard)
@Controller('companies')
@Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  create(
    @TenantId() tenantId: string,
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req
  ) {
    return this.companiesService.create(tenantId, createCompanyDto, req.user.id)
  }

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Req() req,
    @Query('isClient') isClient?: string,
    @Query('isSupplier') isSupplier?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit?: number
  ) {
    const filters: any = {}
    if (isClient) filters.isClient = isClient === 'true'
    if (isSupplier) filters.isSupplier = isSupplier === 'true'
    return this.companiesService.findAll(
      tenantId,
      req.user.id,
      req.user.roles || [], // Pass roles
      filters,
      page || 1,
      limit || 100
    )
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string, @Req() req) {
    return this.companiesService.findOne(tenantId, id, req.user.id, req.user.roles || [])
  }

  @Patch(':id')
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req
  ) {
    return this.companiesService.update(
      tenantId,
      id,
      req.user.id,
      req.user.roles || [],
      updateCompanyDto
    )
  }

  @Delete(':id')
  remove(@TenantId() tenantId: string, @Param('id') id: string, @Req() req) {
    return this.companiesService.remove(tenantId, id, req.user.id, req.user.roles || [])
  }
}
