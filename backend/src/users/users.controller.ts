
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto'; // Placeholder
import { Public } from '../common/decorators/public.decorator';
// JwtAuthGuard is applied globally. @Public makes POST public. GET will be protected.

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public() // Allow unauthenticated user creation (e.g., registration)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // This route is protected by the global JwtAuthGuard
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id') // Protected
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  // @Patch(':id') // Protected - Placeholder for update
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  // @Delete(':id') // Protected - Placeholder for delete
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  // }
}