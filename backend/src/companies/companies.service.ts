import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, Prisma } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(companyData: Prisma.CompanyCreateInput): Promise<Company> {
    try {
      return await this.prisma.company.create({ data: companyData });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
        if (error.code === 'P2002') {
          const target = (error.meta?.target as string[]) || ['field'];
          throw new ConflictException(`A company with this ${target.join(', ')} already exists.`);
        }
      }
      throw error;
    }
  }

  async findAll(
    userId: string,
    filters: { isClient?: boolean; isSupplier?: boolean },
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Company[]; total: number; page: number; limit: number; pages: number }> {
    const where: Prisma.CompanyWhereInput = { userId };
    if (filters.isClient) {
      where.isClient = true;
    }
    if (filters.isSupplier) {
      where.isSupplier = true;
    }

    const total = await this.prisma.company.count({ where });
    const data = await this.prisma.company.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    const pages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      pages,
    };
  }

  async findOne(id: string, userId: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company || company.userId !== userId) {
      throw new NotFoundException(`Company with ID ${id} not found or you don't have access.`);
    }
    return company;
  }

  async update(id: string, userId: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    await this.findOne(id, userId); // Ensure user has access
    return this.prisma.company.update({ where: { id }, data: updateCompanyDto });
  }

  async remove(id: string, userId: string): Promise<Company> {
    await this.findOne(id, userId); // Ensure user has access
    return this.prisma.company.delete({ where: { id } });
  }
}
