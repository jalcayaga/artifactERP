import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { RequiredPermissions } from '../common/decorators/required-permissions.decorator'
import { Permission } from '../common/types/permissions.types'

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @RequiredPermissions(Permission.CreatePermission)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto)
  }

  @Get()
  @RequiredPermissions(Permission.ReadPermissions)
  findAll() {
    return this.permissionsService.findAll()
  }

  @Get(':id')
  @RequiredPermissions(Permission.ReadPermissions)
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id)
  }

  @Patch(':id')
  @RequiredPermissions(Permission.UpdatePermission)
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto
  ) {
    return this.permissionsService.update(id, updatePermissionDto)
  }

  @Delete(':id')
  @RequiredPermissions(Permission.DeletePermission)
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id)
  }
}
