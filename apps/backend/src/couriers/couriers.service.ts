import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';

@Injectable()
export class CouriersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(tenantId: string, createCourierDto: CreateCourierDto) {
        return this.prisma.courier.create({
            data: {
                ...createCourierDto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.courier.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(tenantId: string, id: string) {
        const courier = await this.prisma.courier.findFirst({
            where: { id, tenantId },
        });
        if (!courier) {
            throw new NotFoundException(`Courier with ID ${id} not found`);
        }
        return courier;
    }

    async update(tenantId: string, id: string, updateCourierDto: UpdateCourierDto) {
        await this.findOne(tenantId, id);
        return this.prisma.courier.update({
            where: { id },
            data: updateCourierDto,
        });
    }

    async remove(tenantId: string, id: string) {
        await this.findOne(tenantId, id);
        return this.prisma.courier.delete({
            where: { id },
        });
    }
}
