import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TenantId } from '../common/decorators/tenant.decorator'

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    create(
        @TenantId() tenantId: string,
        @Body() createCategoryDto: CreateCategoryDto
    ) {
        return this.categoriesService.create(tenantId, createCategoryDto)
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.categoriesService.findAll(tenantId)
    }

    @Get(':id')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.categoriesService.findOne(tenantId, id)
    }

    @Patch(':id')
    update(
        @TenantId() tenantId: string,
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ) {
        return this.categoriesService.update(tenantId, id, updateCategoryDto)
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.categoriesService.remove(tenantId, id)
    }
}
