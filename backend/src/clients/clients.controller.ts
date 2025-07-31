import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createClientDto: CreateClientDto, @Request() req) {
    const data = { ...createClientDto, user: { connect: { id: req.user.userId } } };
    return this.clientsService.create(data);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  findAll(@Request() req) {
    return this.clientsService.findAll(req.user.userId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  findOne(@Param('id') id: string, @Request() req) {
    return this.clientsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @Request() req) {
    const data = { ...updateClientDto, user: { connect: { id: req.user.userId } } };
    return this.clientsService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.clientsService.remove(id, req.user.userId);
  }
}