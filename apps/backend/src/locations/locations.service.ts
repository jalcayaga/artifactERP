import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
    constructor(private prisma: PrismaService) { }

    async findAllRegions() {
        return this.prisma.region.findMany({
            orderBy: { number: 'asc' },
        });
    }

    async findCommunesByRegion(regionId: string) {
        return this.prisma.commune.findMany({
            where: { regionId },
            orderBy: { name: 'asc' },
        });
    }
}
