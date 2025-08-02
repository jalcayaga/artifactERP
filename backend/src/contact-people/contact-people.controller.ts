import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ContactPeopleService } from './contact-people.service';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { UpdateContactPersonDto } from './dto/update-contact-person.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('companies/:companyId/contact-people')
export class ContactPeopleController {
  constructor(private readonly contactPeopleService: ContactPeopleService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createContactPersonDto: CreateContactPersonDto,
  ) {
    return this.contactPeopleService.create(companyId, createContactPersonDto);
  }

  @Get()
  findAll(
    @Param('companyId') companyId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.contactPeopleService.findAll(companyId, page, limit);
  }

  @Get(':id')
  findOne(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.contactPeopleService.findOne(companyId, id);
  }

  @Patch(':id')
  update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() updateContactPersonDto: UpdateContactPersonDto,
  ) {
    return this.contactPeopleService.update(companyId, id, updateContactPersonDto);
  }

  @Delete(':id')
  remove(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.contactPeopleService.remove(companyId, id);
  }
}