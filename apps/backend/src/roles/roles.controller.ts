import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RequiredPermissions } from '../common/decorators/required-permissions.decorator'
import { Permission } from '../common/types/permissions.types'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequiredPermissions(Permission.CreateRole)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto)
  }

  @Get()
  @RequiredPermissions(Permission.ReadRoles)
  findAll() {
    return this.rolesService.findAll()
  }

  @Get(':id')
  @RequiredPermissions(Permission.ReadRoles)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id)
  }

  @Patch(':id')
  @RequiredPermissions(Permission.UpdateRole)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto)
  }

  @Delete(':id')
  @RequiredPermissions(Permission.DeleteRole)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id)
  }
}
