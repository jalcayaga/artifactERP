import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { ContactPeopleService } from './contact-people.service'
import { CreateContactPersonDto } from './dto/create-contact-person.dto'
import { UpdateContactPersonDto } from './dto/update-contact-person.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard'
import { TenantId } from '../common/decorators/tenant.decorator'

@UseGuards(JwtAuthGuard)
@Controller('companies/:companyId/contact-people')
export class ContactPeopleController {
  constructor(private readonly contactPeopleService: ContactPeopleService) { }

  @Post()
  create(
    @TenantId() tenantId: string,
    @Param('companyId') companyId: string,
    @Body() createContactPersonDto: CreateContactPersonDto
  ) {
    return this.contactPeopleService.create(
      tenantId,
      companyId,
      createContactPersonDto
    )
  }

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Param('companyId') companyId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.contactPeopleService.findAll(tenantId, companyId, page, limit)
  }

  @Get(':id')
  findOne(
    @TenantId() tenantId: string,
    @Param('companyId') companyId: string,
    @Param('id') id: string
  ) {
    return this.contactPeopleService.findOne(tenantId, companyId, id)
  }

  @Patch(':id')
  update(
    @TenantId() tenantId: string,
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() updateContactPersonDto: UpdateContactPersonDto
  ) {
    return this.contactPeopleService.update(
      tenantId,
      companyId,
      id,
      updateContactPersonDto
    )
  }

  @Delete(':id')
  remove(
    @TenantId() tenantId: string,
    @Param('companyId') companyId: string,
    @Param('id') id: string
  ) {
    return this.contactPeopleService.remove(tenantId, companyId, id)
  }
}
