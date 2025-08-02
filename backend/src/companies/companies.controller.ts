import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @Req() req) {
    const companyData = {
      ...createCompanyDto,
      user: {
        connect: { id: req.user.id },
      },
    };
    return this.companiesService.create(companyData);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('isClient') isClient?: string,
    @Query('isSupplier') isSupplier?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const filters = {
      isClient: isClient === 'true' ? true : undefined,
      isSupplier: isSupplier === 'true' ? true : undefined,
    };
    return this.companiesService.findAll(req.user.id, filters, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.companiesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @Req() req) {
    return this.companiesService.update(id, req.user.id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.companiesService.remove(id, req.user.id);
  }
}
