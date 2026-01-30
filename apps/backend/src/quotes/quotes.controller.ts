import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { QuotesService } from './quotes.service'
import { CreateQuoteDto } from './dto/create-quote.dto'
import { UpdateQuoteDto } from './dto/update-quote.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

import { TenantId } from '../common/decorators/tenant.decorator'
import { QuoteStatus } from '@prisma/client'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @Roles('ADMIN', 'EDITOR')
  async create(
    @TenantId() tenantId: string,
    @Body() createQuoteDto: CreateQuoteDto,
    @Request() req
  ) {
    if (!tenantId) {
      throw new NotFoundException('Tenant ID is required')
    }
    return await this.quotesService.create(
      tenantId,
      createQuoteDto,
      req.user.id
    )
  }

  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  findAll(
    @TenantId() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: QuoteStatus | 'all'
  ) {
    const normalizedStatus =
      status && status !== 'all' ? (status as QuoteStatus) : undefined
    return this.quotesService.findAll(tenantId, page, limit, normalizedStatus)
  }

  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    if (!tenantId) {
      throw new NotFoundException('Tenant ID is required')
    }
    return await this.quotesService.findOne(tenantId, id)
  }

  @Get(':id/pdf')
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @HttpCode(HttpStatus.NOT_FOUND)
  getPdf() {
    // This functionality is deprecated in favor of official DTE PDFs.
    return {
      message:
        'PDF generation for quotes is not available. Use official DTE PDF if applicable.',
    }
  }

  @Patch(':id')
  @Roles('ADMIN', 'EDITOR')
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateQuoteDto: UpdateQuoteDto,
    @Request() req
  ) {
    if (!tenantId) {
      throw new NotFoundException('Tenant ID is required')
    }
    return await this.quotesService.update(
      tenantId,
      id,
      updateQuoteDto,
      req.user.id
    )
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    if (!tenantId) {
      throw new NotFoundException('Tenant ID is required')
    }
    return await this.quotesService.remove(tenantId, id)
  }
}
