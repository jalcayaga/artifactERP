import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { UpdateContactPersonDto } from './dto/update-contact-person.dto';
import { ContactPerson, Prisma } from '@prisma/client';

@Injectable()
export class ContactPeopleService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, createContactPersonDto: CreateContactPersonDto): Promise<ContactPerson> {
    return this.prisma.contactPerson.create({
      data: {
        ...createContactPersonDto,
        company: {
          connect: { id: companyId },
        },
      },
    });
  }

  async findAll(
    companyId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: ContactPerson[]; total: number; page: number; limit: number; pages: number }> {
    const where: Prisma.ContactPersonWhereInput = { companyId };

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

  async findOne(companyId: string, id: string): Promise<ContactPerson | null> {
    const contactPerson = await this.prisma.contactPerson.findUnique({ where: { id } });
    if (!contactPerson || contactPerson.companyId !== companyId) {
      throw new NotFoundException(`ContactPerson with ID ${id} not found in company ${companyId}.`);
    }
    return contactPerson;
  }

  async update(
    companyId: string,
    id: string,
    updateContactPersonDto: UpdateContactPersonDto,
  ): Promise<ContactPerson> {
    await this.findOne(companyId, id); // Ensure contact person exists and belongs to the company
    return this.prisma.contactPerson.update({
      where: { id },
      data: updateContactPersonDto,
    });
  }

  async remove(companyId: string, id: string): Promise<ContactPerson> {
    await this.findOne(companyId, id); // Ensure contact person exists and belongs to the company
    return this.prisma.contactPerson.delete({ where: { id } });
  }
}