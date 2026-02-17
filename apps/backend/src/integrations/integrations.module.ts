import { Module, OnModuleInit } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { MeliProvider } from './providers/meli.provider';
import { SalesModule } from '../sales/sales.module';
import { PrismaModule } from '../prisma/prisma.module';
import { IntegrationsController } from './integrations.controller';
import { FacebookCatalogService } from './facebook-catalog.service';

@Module({
    imports: [SalesModule, PrismaModule],
    controllers: [IntegrationsController],
    providers: [IntegrationsService, MeliProvider, FacebookCatalogService],
    exports: [IntegrationsService],
})
export class IntegrationsModule implements OnModuleInit {
    constructor(
        private service: IntegrationsService,
        private meli: MeliProvider,
    ) { }

    onModuleInit() {
        this.service.registerProvider(this.meli);
    }
}
