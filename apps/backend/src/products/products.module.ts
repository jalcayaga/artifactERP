import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { ChannelOffersController } from './channel-offers.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { ChannelOffersService } from './channel-offers.service'

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController, ChannelOffersController],
  providers: [ProductsService, ChannelOffersService],
  exports: [ProductsService, ChannelOffersService],
})
export class ProductsModule { }
