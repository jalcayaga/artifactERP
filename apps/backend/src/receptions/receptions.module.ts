import { Module } from '@nestjs/common'
import { ReceptionsService } from './receptions.service'
import { ReceptionsController } from './receptions.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [ReceptionsController],
    providers: [ReceptionsService],
    exports: [ReceptionsService],
})
export class ReceptionsModule { }
