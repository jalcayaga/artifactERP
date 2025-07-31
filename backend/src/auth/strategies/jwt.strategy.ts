
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service'; // Important for checking if user exists/is active

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService, // Inject UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    // Payload contains { email, sub (userId), role, iat, exp }
    // You can use the userId (payload.sub) to fetch the user from the database
    // This allows for additional checks, e.g., if the user is still active or role changed
    const user = await this.usersService.findOneById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive.');
    }
    // Return the user object (or a subset of it) to be attached to req.user
    // Exclude password and other sensitive fields
    return { userId: payload.sub, email: payload.email, role: user.role };
  }
}