import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service'; // Changed to absolute path
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (!payload?.tenantId) {
      throw new UnauthorizedException('Tenant context missing in token payload');
    }

    const user = await this.usersService.findOneById(payload.tenantId, payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    // You might want to return the full user object or a subset of it
    const { password, ...result } = user;
    return result;
  }
}
