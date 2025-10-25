import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { TenantId } from '../common/decorators/tenant.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@TenantId() tenantId: string, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(tenantId, createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@TenantId() tenantId: string) {
    return this.usersService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.usersService.findOne(tenantId, id);
  }

  @Patch(':id')
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const isAdmin = req.user.role === UserRole.ADMIN;
    if (!isAdmin && req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile.');
    }

    const payload: UpdateUserDto = { ...updateUserDto };

    if (!isAdmin) {
      delete (payload as any).role;
      delete (payload as any).isActive;
      delete (payload as any).email;
    }

    return this.usersService.update(tenantId, id, payload, {
      allowRoleChange: isAdmin,
      allowStatusChange: isAdmin,
      allowEmailChange: isAdmin,
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.usersService.remove(tenantId, id);
  }
}
