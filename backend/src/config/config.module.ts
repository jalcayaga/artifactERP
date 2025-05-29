
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './app.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true, // Ensures ConfigService is available globally
    }),
  ],
  providers: [ConfigService], // Provide ConfigService
  exports: [ConfigService],   // Export ConfigService if needed by other modules directly
})
export class AppConfigModule {}
