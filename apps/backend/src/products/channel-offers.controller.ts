import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Request,
} from '@nestjs/common';
import { ChannelOffersService } from './channel-offers.service';
import { CreateChannelOfferDto, UpdateChannelOfferDto } from './dto/channel-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderSource } from '@prisma/client';

@Controller('channel-offers')
@UseGuards(JwtAuthGuard)
export class ChannelOffersController {
    constructor(private readonly channelOffersService: ChannelOffersService) { }

    @Post()
    create(@Request() req, @Body() createChannelOfferDto: CreateChannelOfferDto) {
        return this.channelOffersService.create(req.user.tenantId, createChannelOfferDto);
    }

    @Get()
    findAll(@Request() req, @Query('channel') channel?: OrderSource) {
        return this.channelOffersService.findAll(req.user.tenantId, channel);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.channelOffersService.findOne(req.user.tenantId, id);
    }

    @Patch(':id')
    update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateChannelOfferDto: UpdateChannelOfferDto,
    ) {
        return this.channelOffersService.update(req.user.tenantId, id, updateChannelOfferDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.channelOffersService.remove(req.user.tenantId, id);
    }
}
