
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS actualizada
  app.enableCors({
    origin: '*', // Permite todas las origenes (para desarrollo)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    // credentials: true, // Se comenta/elimina para pruebas, ya que puede ser problemático con origin: '*'
                       // si el frontend no gestiona explícitamente el envío de credenciales.
                       // Para login/registro basado en tokens, usualmente no es necesario para la solicitud inicial.
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades que no tienen decoradores
    transform: true, // Transforma automáticamente los payloads a instancias de DTO
  }));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();