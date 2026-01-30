import { Controller, Post, Body, Request, Get } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { Public } from '../common/decorators/public.decorator'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'

import { TenantId } from '../common/decorators/tenant.decorator'
// JwtAuthGuard is applied globally, so @Public() is needed for login
// For profile, the global guard will protect it by default.

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Public() // Mark this route as public
  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, devuelve token JWT',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@TenantId() tenantId: string, @Body() loginDto: LoginDto) {
    return this.authService.login(tenantId, loginDto)
  }

  @Public() // Mark this route as public
  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema (rol CLIENT por defecto)',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o usuario ya existe',
  })
  async register(
    @TenantId() tenantId: string,
    @Body() createUserDto: CreateUserDto
  ) {
    const userPayload: CreateUserDto = {
      ...createUserDto,
      roles: createUserDto.roles ?? ['CLIENT'],
    }
    return this.usersService.create(tenantId, userPayload)
  }

  // This route is protected by the global JwtAuthGuard
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description: 'Devuelve la información del usuario actual',
  })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  getProfile(@TenantId() tenantId: string, @Request() req) {
    // req.user is populated by JwtStrategy
    return this.authService.getProfile(tenantId, req.user.email)
  }
}
