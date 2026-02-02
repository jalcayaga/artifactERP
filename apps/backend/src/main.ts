import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  })

  // Configuración de CORS actualizada
  app.enableCors({
    origin: [
      /^(http:\/\/|https:\/\/)?([a-z0-9-]+\.)*localhost:3000$/,
      /^(http:\/\/|https:\/\/)?([a-z0-9-]+\.)*localhost:3001$/,
      /^(http:\/\/|https:\/\/)?([a-z0-9-]+\.)*localhost:3003$/,
      'https://app.artifact.cl',
      'https://store.artifact.cl',
      'https://marketing.artifact.cl',
      'https://artifact.cl',
      /\.artifact\.cl$/,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no tienen decoradores
      transform: true, // Transforma automáticamente los payloads a instancias de DTO
    })
  )

  // Global exception filter to catch all errors and prevent instanceof errors
  app.useGlobalFilters(new AllExceptionsFilter())

  // Configuración de Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('SubRed ERP API')
    .setDescription(
      'API REST para el sistema ERP SubRed - Sistema multi-tenant de gestión empresarial'
    )
    .setVersion('1.0')
    .addTag('auth', 'Autenticación y registro de usuarios')
    .addTag('users', 'Gestión de usuarios')
    .addTag('tenants', 'Gestión multi-tenant')
    .addTag('companies', 'Clientes y proveedores')
    .addTag('products', 'Catálogo de productos')
    .addTag('orders', 'Órdenes de venta')
    .addTag('purchases', 'Órdenes de compra')
    .addTag('quotes', 'Cotizaciones')
    .addTag('invoices', 'Facturación electrónica')
    .addTag('payments', 'Gestión de pagos')
    .addTag('lots', 'Control de inventario por lotes')
    .addTag('storefront', 'API pública para tienda')
    .addTag('dashboard', 'Métricas y reportes')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth' // Este nombre se usará en los controladores
    )
    .addServer(process.env.PUBLIC_API_URL || 'http://localhost:3002', 'Servidor Principal')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'SubRed ERP API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  })

  const configService = app.get(ConfigService)
  const port =
    configService.get<number>('port') ??
    configService.get<number>('PORT') ??
    3001

  console.log('Backend CWD:', process.cwd())

  await app.listen(port, '0.0.0.0')
  console.log(`Application is running on: http://0.0.0.0:${port}`)
  console.log(
    `📚 Swagger documentation available at: http://0.0.0.0:${port}/api/docs`
  )
}

bootstrap()
