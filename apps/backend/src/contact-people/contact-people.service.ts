import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { UpdateContactPersonDto } from './dto/update-contact-person.dto';
import { ContactPerson, Prisma } from '@prisma/client';

@Injectable()
export class ContactPeopleService {
  constructor(private prisma: PrismaService) {}

  async create(
    tenantId: string,
    companyId: string,
    createContactPersonDto: CreateContactPersonDto,
  ): Promise<ContactPerson> {
    try {
      return await this.prisma.contactPerson.create({
        data: {
          tenantId,
          ...createContactPersonDto,
          company: {
            connect: { id: companyId },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = (error.meta?.target as string[]) || ['field'];
          throw new ConflictException(`A contact person with this ${target.join(', ')} already exists.`);
        }
      }
      throw error;
    }
  }

  async findAll(
    tenantId: string,
    companyId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: ContactPerson[]; total: number; page: number; limit: number; pages: number }> {
    const where: Prisma.ContactPersonWhereInput = { companyId, tenantId };

    const total = await this.prisma.contactPerson.count({ where });
    const data = await this.prisma.contactPerson.findMany({
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

  async findOne(tenantId: string, companyId: string, id: string): Promise<ContactPerson | null> {
    const contactPerson = await this.prisma.contactPerson.findFirst({ where: { id, tenantId } });
    if (!contactPerson || contactPerson.companyId !== companyId) {
      throw new NotFoundException(`ContactPerson with ID ${id} not found in company ${companyId}.`);
    }
    return contactPerson;
  }

  async update(
    tenantId: string,
    companyId: string,
    id: string,
    updateContactPersonDto: UpdateContactPersonDto,
  ): Promise<ContactPerson> {
    await this.findOne(tenantId, companyId, id); // Ensure contact person exists and belongs to the company
    return this.prisma.contactPerson.update({
      where: { id },
      data: updateContactPersonDto,
    });
  }

  async remove(tenantId: string, companyId: string, id: string): Promise<ContactPerson> {
    await this.findOne(tenantId, companyId, id); // Ensure contact person exists and belongs to the company
    return this.prisma.contactPerson.delete({ where: { id } });
  }
}
