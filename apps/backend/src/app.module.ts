import { RolesModule } from './roles/roles.module'
import { PermissionsModule } from './permissions/permissions.module'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { AppConfigModule } from './config/config.module'
import appConfig from './config/app.config'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { PermissionsGuard } from './auth/guards/permissions.guard'
import { ProductsModule } from './products/products.module'
import { OrdersModule } from './orders/orders.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { CompaniesModule } from './companies/companies.module'
import { SalesModule } from './sales/sales.module'
import { PurchasesModule } from './purchases/purchases.module'
import { QuotesModule } from './quotes/quotes.module'
import { LotsModule } from './lots/lots.module'
import { InvoicesModule } from './invoices/invoices.module'
import { PaymentsModule } from './payments/payments.module'
import { UploadsModule } from './uploads/uploads.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { ContactPeopleModule } from './contact-people/contact-people.module'
import { StorefrontModule } from './storefront/storefront.module'
import { TenantsModule } from './tenants/tenants.module'
import { SubscriptionsModule } from './subscriptions/subscriptions.module'
import { TenantResolverMiddleware } from './tenants/middleware/tenant-resolver.middleware'
import { CategoriesModule } from './categories/categories.module'
import { WarehousesModule } from './warehouses/warehouses.module'
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module'
import { ReceptionsModule } from './receptions/receptions.module'
import { LocationsModule } from './locations/locations.module'
import { IndicatorsModule } from './indicators/indicators.module'
import { InventoryModule } from './inventory/inventory.module'
import { PricingModule } from './pricing/pricing.module'
import { DteModule } from './dte/dte.module'
import { PosModule } from './pos/pos.module'
import { DispatchesModule } from './dispatches/dispatches.module'
import { IntegrationsModule } from './integrations/integrations.module'
import { SocialModule } from './social/social.module'

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    AppConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ProductsModule,
    OrdersModule,
    DashboardModule,
    CompaniesModule,
    SalesModule,
    PurchasesModule,
    QuotesModule,
    LotsModule,
    InvoicesModule,
    PaymentsModule,
    UploadsModule,
    StorefrontModule,
    TenantsModule,
    DispatchesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    ContactPeopleModule,
    SubscriptionsModule,
    CategoriesModule,
    WarehousesModule,
    PurchaseOrdersModule,
    ReceptionsModule,
    LocationsModule,
    IndicatorsModule,
    InventoryModule,
    PricingModule,
    DteModule,
    PosModule,
    IntegrationsModule,
    SocialModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantResolverMiddleware).forRoutes('*')
  }
}
