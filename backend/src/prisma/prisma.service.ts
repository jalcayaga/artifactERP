
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client: PrismaClient;

  constructor() {
    this.client = new PrismaClient({
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
