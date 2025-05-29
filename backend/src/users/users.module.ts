
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
// PrismaModule is global, so PrismaService is available
// ConfigModule is global from AppConfigModule

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export UsersService so AuthModule can use it
})
export class UsersModule {}
