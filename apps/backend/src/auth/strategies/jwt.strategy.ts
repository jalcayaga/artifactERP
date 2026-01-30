import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from 'src/users/users.service' // Changed to absolute path
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })
    console.log(
      '--- [JWTStrategy DEBUG] JWT_SECRET used:',
      configService.get<string>('JWT_SECRET')
    ) // DEBUG LINE
  }

  async validate(payload: any) {
    console.log('--- [JWTStrategy DEBUG] Payload received:', payload)
    if (!payload?.tenantId) {
      console.log(
        '--- [JWTStrategy DEBUG] Tenant context missing in token payload'
      ) // DEBUG LINE
      throw new UnauthorizedException('Tenant context missing in token payload')
    }

    const user = await this.usersService.findOneById(
      payload.tenantId,
      payload.sub
    )
    console.log('--- [JWTStrategy DEBUG] User found by findOneById:', user)
    if (!user) {
      console.log(
        '--- [JWTStrategy DEBUG] User not found for payload:',
        payload
      ) // DEBUG LINE
      throw new UnauthorizedException()
    }
    console.log(
      '--- [JWTStrategy DEBUG] User validated successfully in strategy:',
      user.email
    ) // DEBUG LINE
    return user
  }
}
