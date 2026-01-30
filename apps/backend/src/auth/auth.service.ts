import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    tenantId: string,
    email: string,
    pass: string
  ): Promise<any> {
    const user = await this.usersService.findByEmail(tenantId, email)
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user
      return result
    }
    return null
  }

  async login(tenantId: string, loginDto: { email: string; password: string }) {
    try {
      console.log(
        '--- [AUTH DEBUG] Attempting to validate user:',
        loginDto.email
      )
      const user = await this.validateUser(
        tenantId,
        loginDto.email,
        loginDto.password
      )
      if (!user) {
        console.log(
          '--- [AUTH DEBUG] User validation failed for:',
          loginDto.email
        )
        throw new UnauthorizedException('Invalid credentials')
      }
      console.log('--- [AUTH DEBUG] User validated successfully:', user.email)

      const payload = {
        email: user.email,
        sub: user.id,
        roles: user.roles.map((role) => role.name),
        tenantId,
      }
      console.log('--- [AUTH DEBUG] Creating JWT payload:', payload)

      const accessToken = this.jwtService.sign(payload)
      console.log('--- [AUTH DEBUG] JWT signed successfully.')

      const userResponse = {
        id: user.id,
        email: user.email,
        roles: user.roles.map((role) => role.name),
        firstName: user.firstName,
        lastName: user.lastName,
        companies: user.companies,
        tenantId: tenantId,
      }

      console.log(
        '--- [AUTH DEBUG] Login successful, returning token and user.'
      )
      return {
        access_token: accessToken,
        user: userResponse,
      }
    } catch (error) {
      console.error(
        '--- [AUTH DEBUG] CRITICAL ERROR IN LOGIN METHOD ---',
        error
      )
      throw error // Re-throw the error to ensure NestJS handles it
    }
  }

  async getProfile(tenantId: string, email: string) {
    const fullUser = await this.usersService.findByEmail(tenantId, email)
    if (!fullUser) {
      throw new UnauthorizedException('Could not find user profile.')
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...profile } = fullUser
    return profile
  }
}
