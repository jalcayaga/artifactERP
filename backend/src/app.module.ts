import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AppConfigModule } from "./config/config.module"; // Renamed to avoid conflict
import appConfig from "./config/app.config";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { ProductsModule } from "./products/products.module"; // Added ProductsModule
import { OrdersModule } from "./orders/orders.module"; // Added OrdersModule
import { DashboardModule } from "./dashboard/dashboard.module";
import { ClientsModule } from "./clients/clients.module"; // Added ClientsModule
import { SalesModule } from "./sales/sales.module"; // Added SalesModule
import { PurchasesModule } from "./purchases/purchases.module"; // Added PurchasesModule
import { SuppliersModule } from "./suppliers/suppliers.module"; // Added SuppliersModule
import { QuotesModule } from "./quotes/quotes.module"; // Added QuotesModule
import { LotsModule } from './lots/lots.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { UploadsModule } from './uploads/uploads.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    OrdersModule, // Added OrdersModule
    DashboardModule,
    ClientsModule, // Added ClientsModule
    SalesModule, // Added SalesModule
    PurchasesModule, // Added PurchasesModule
    SuppliersModule, // Added SuppliersModule
    QuotesModule, // Added ProductsModule
    LotsModule, InvoicesModule, PaymentsModule,
    UploadsModule, // Added UploadsModule
    ServeStaticModule.forRoot({
      rootPath: '/home/astro/subred-erp/backend/uploads',
      serveRoot: '/uploads',
    }),
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

