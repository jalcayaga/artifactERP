import { Controller, Post, Body, Request, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Public } from "../common/decorators/public.decorator";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { UserRole } from "@prisma/client";
// JwtAuthGuard is applied globally, so @Public() is needed for login
// For profile, the global guard will protect it by default.

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public() // Mark this route as public
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public() // Mark this route as public
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({
      ...createUserDto,
      role: createUserDto.role as UserRole,
    });
  }

  // This route is protected by the global JwtAuthGuard
  @Get("profile")
  getProfile(@Request() req) {
    // req.user is populated by JwtStrategy
    return req.user;
  }
}
