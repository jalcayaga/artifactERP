
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppConfigModule } from './config/config.module'; // Renamed to avoid conflict
import appConfig from './config/app.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ProductsModule } from './products/products.module'; // Added ProductsModule
import { OrdersModule } from './orders/orders.module'; // Added OrdersModule

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available throughout the app
      load: [appConfig], // Load custom configuration
    }),
    AppConfigModule, // Custom config module
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule, // Added ProductsModule
    OrdersModule,   // Added OrdersModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD, // Apply JwtAuthGuard globally
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
