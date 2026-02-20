import { Controller, Post, Body } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { CreateTrialDto } from './dto/create-trial.dto';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller('onboarding')
export class OnboardingController {
    constructor(private readonly onboardingService: OnboardingService) { }

    @Post('trial')
    async createTrial(@Body() createTrialDto: CreateTrialDto) {
        return this.onboardingService.createTrial(createTrialDto);
    }
}
