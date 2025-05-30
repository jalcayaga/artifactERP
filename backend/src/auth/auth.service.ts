
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client'; // Import User type

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> { // Use User type
    const user = await this.usersService.findOneByEmail(email);
    if (user && typeof user.password === 'string' && await bcrypt.compare(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as Omit<User, 'password'>; // Use User type
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const userValidationResult = await this.validateUser(loginDto.email, loginDto.password);
    if (!userValidationResult) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const fullUser = await this.usersService.findOneByEmail(userValidationResult.email);
    if (!fullUser || !fullUser.isActive) {
        throw new UnauthorizedException('User account is inactive or not found.');
    }
    const payload = { email: fullUser.email, sub: fullUser.id, role: fullUser.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: fullUser.id,
        email: fullUser.email,
        firstName: fullUser.firstName, 
        lastName: fullUser.lastName,   
        role: fullUser.role,
      }
    };
  }
}