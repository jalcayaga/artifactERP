import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) { }

    @Get('regions')
    async findAllRegions() {
        return this.locationsService.findAllRegions();
    }

    @Get('communes/:regionId')
    async findCommunesByRegion(@Param('regionId') regionId: string) {
        return this.locationsService.findCommunesByRegion(regionId);
    }
}
