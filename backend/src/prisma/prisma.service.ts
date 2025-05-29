
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma } from '@prisma/client'; // Changed to import Prisma namespace

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client: Prisma.PrismaClient; // Changed to Prisma.PrismaClient

  constructor() {
    this.client = new Prisma.PrismaClient({ // Changed to new Prisma.PrismaClient()
      // log: ['query', 'info', 'warn', 'error'], // Optional: configure logging
    });
  }

  async onModuleInit() {
    try {
      await this.client.$connect();
      console.log('Prisma Client connected to the database.');
    } catch (error) {
      console.error('Failed to connect to the database via Prisma Client:', error);
    }
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
    console.log('Prisma Client disconnected from the database.');
  }
}
