import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, Prisma } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createCompanyDto: CreateCompanyDto, userId: string): Promise<Company> {
    try {
      const { contactPerson, ...companyData } = createCompanyDto;

      const company = await this.prisma.company.create({
        data: {
          tenantId,
          ...companyData,
          userId: userId, // Add the userId here
          contactPeople: contactPerson
            ? {
                create: {
                  tenantId,
                  firstName: contactPerson.firstName,
                  lastName: contactPerson.lastName,
                  email: contactPerson.email,
                  phone: contactPerson.phone,
                  role: contactPerson.role || 'Principal',
                },
              }
            : undefined,
        },
      });
      return company;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = (error.meta?.target as string[]) || ['field'];
          throw new ConflictException(`A company with this ${target.join(', ')} already exists.`);
        }
      }
      throw error;
    }
  }

  async findAll(
    tenantId: string,
    userId: string,
    filters: { isClient?: boolean; isSupplier?: boolean; companyOwnership?: 'mine' | 'others' | 'all' },
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Company[]; total: number; page: number; limit: number; pages: number }> {
    let where: Prisma.CompanyWhereInput = {
      tenantId,
    };

    if (filters.companyOwnership === 'mine') {
      where.userId = userId;
    } else if (filters.companyOwnership === 'others') {
      where.userId = { not: userId };
    } else if (filters.companyOwnership === 'all') {
      // No userId filter applied, return all companies
    } else {
      // Default behavior: only show companies owned by the user
      where.userId = userId;
    }

    if (filters.isClient !== undefined) {
      where.isClient = filters.isClient;
    }
    if (filters.isSupplier !== undefined) {
      where.isSupplier = filters.isSupplier;
    }

    console.log('CompaniesService.findAll: Constructed where clause:', where);

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

  async findOne(tenantId: string, id: string, userId: string): Promise<Company | null> {
    const company = await this.prisma.company.findFirst({ where: { id, tenantId } });
    if (!company || company.userId !== userId) {
      throw new NotFoundException(`Company with ID ${id} not found or you don't have access.`);
    }
    return company;
  }

  async update(tenantId: string, id: string, userId: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    await this.findOne(tenantId, id, userId); // Ensure user has access
    return this.prisma.company.update({ where: { id }, data: updateCompanyDto });
  }

  async remove(tenantId: string, id: string, userId: string): Promise<Company> {
    await this.findOne(tenantId, id, userId); // Ensure user has access
    return this.prisma.company.delete({ where: { id } });
  }
}
