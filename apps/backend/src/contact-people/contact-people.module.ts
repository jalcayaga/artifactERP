import { Module } from '@nestjs/common'
import { ContactPeopleService } from './contact-people.service'
import { ContactPeopleController } from './contact-people.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [ContactPeopleController],
  providers: [ContactPeopleService],
  exports: [ContactPeopleService], // Export the service to be used in other modules
})
export class ContactPeopleModule {}
