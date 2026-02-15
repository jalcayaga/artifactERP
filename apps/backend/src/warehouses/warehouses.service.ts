import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateWarehouseDto } from './dto/create-warehouse.dto'
import { UpdateWarehouseDto } from './dto/update-warehouse.dto'
import { Warehouse } from '@prisma/client'

@Injectable()
export class WarehousesService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, data: CreateWarehouseDto): Promise<Warehouse> {
        // If setting as default, unset others?
        // Or just create. Logic: if isDefault is true, unset others in transaction.

        if (data.isDefault) {
            return this.prisma.$transaction(async (tx) => {
                await tx.warehouse.updateMany({
                    where: { tenantId, isDefault: true },
                    data: { isDefault: false },
                })
                return tx.warehouse.create({
                    data: { ...data, tenantId },
                })
            })
        }

        return this.prisma.warehouse.create({
            data: { ...data, tenantId },
        })
    }

    async findAll(tenantId: string): Promise<Warehouse[]> {
        return this.prisma.warehouse.findMany({
            where: { tenantId },
            orderBy: { isDefault: 'desc' }, // show default first
        })
    }

    async findOne(tenantId: string, id: string): Promise<Warehouse> {
        const warehouse = await this.prisma.warehouse.findFirst({
            where: { id, tenantId },
        })
        if (!warehouse) {
            throw new NotFoundException(`Warehouse with ID ${id} not found`)
        }
        return warehouse
    }

    async update(
        tenantId: string,
        id: string,
        data: UpdateWarehouseDto
    ): Promise<Warehouse> {
        await this.ensureBelongsToTenant(tenantId, id)

        if (data.isDefault) {
            return this.prisma.$transaction(async (tx) => {
                await tx.warehouse.updateMany({
                    where: { tenantId, isDefault: true },
                    data: { isDefault: false },
                })
                return tx.warehouse.update({
                    where: { id },
                    data,
                })
            })
        }

        return this.prisma.warehouse.update({
            where: { id },
            data,
        })
    }

    async remove(tenantId: string, id: string): Promise<Warehouse> {
        await this.ensureBelongsToTenant(tenantId, id)
        // Check if it has lots?
        // If lots exist, prevent delete?
        const lotsCount = await this.prisma.lot.count({
            where: { warehouseId: id }
        })

        if (lotsCount > 0) {
            throw new BadRequestException('Cannot delete warehouse with existing inventory lots.')
        }

        return this.prisma.warehouse.delete({
            where: { id },
        })
    }

    private async ensureBelongsToTenant(tenantId: string, id: string) {
        const warehouse = await this.prisma.warehouse.findFirst({
            where: { id, tenantId },
        })
        if (!warehouse) {
            throw new NotFoundException(`Warehouse with ID ${id} not found`)
        }
    }
}
