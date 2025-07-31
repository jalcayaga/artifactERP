import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client, Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ClientCreateInput): Promise<Client> {
    return this.prisma.client.create({ data });
  }

  async findAll(userId: string): Promise<Client[]> {
    return this.prisma.client.findMany({ where: { userId } });
  }

  async findOne(id: string, userId: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client || client.userId !== userId) {
      return null;
    }
    return client;
  }

  async update(id: string, data: Prisma.ClientUpdateInput): Promise<Client> {
    await this.findOne(id, data.user.connect.id as string); // Ensure user has access
    return this.prisma.client.update({ where: { id }, data });
  }

  async remove(id: string, userId: string): Promise<Client> {
    await this.findOne(id, userId); // Ensure user has access
    return this.prisma.client.delete({ where: { id } });
  }
}