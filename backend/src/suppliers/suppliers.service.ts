import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Supplier, Prisma } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SupplierCreateInput): Promise<Supplier> {
    return this.prisma.supplier.create({ data });
  }

  async findAll(): Promise<Supplier[]> {
    return this.prisma.supplier.findMany();
  }

  async findOne(id: string): Promise<Supplier | null> {
    return this.prisma.supplier.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.SupplierUpdateInput): Promise<Supplier> {
    return this.prisma.supplier.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Supplier> {
    return this.prisma.supplier.delete({ where: { id } });
  }
}