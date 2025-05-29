
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET environment variable is not set.');
        }
        
        const expiresInConfig = configService.get<string>('JWT_EXPIRES_IN') || '60m';
        // Attempt to parse expiresInConfig as a number if it's purely digits, otherwise use the string.
        const expiresInValue: string | number = /^\d+$/.test(expiresInConfig)
          ? parseInt(expiresInConfig, 10)
          : expiresInConfig;

        return {
          secret: secret,
          signOptions: { expiresIn: expiresInValue as any }, // Adjusted to 'as any' for StringValue issue
        };
      },
    }),
    ConfigModule, // Ensure ConfigService is available
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}