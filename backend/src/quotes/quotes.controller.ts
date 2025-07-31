import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, BadRequestException, Query, DefaultValuePipe, ParseIntPipe, Request, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Response } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async create(@Body() createQuoteDto: CreateQuoteDto, @Request() req) {
    try {
      return await this.quotesService.create(createQuoteDto, req.user.userId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.quotesService.findAll(page, limit);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  async findOne(@Param('id') id: string) {
    try {
      return await this.quotesService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Get(':id/pdf')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  @HttpCode(HttpStatus.NOT_FOUND)
  getPdf() {
    // This functionality is deprecated in favor of official DTE PDFs.
    return { message: 'PDF generation for quotes is not available. Use official DTE PDF if applicable.' };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async update(@Param('id') id: string, @Body() updateQuoteDto: UpdateQuoteDto, @Request() req) {
    try {
      return await this.quotesService.update(id, updateQuoteDto, req.user.userId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    try {
      return await this.quotesService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }
}
