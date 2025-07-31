import { Client as PrismaClient } from '@prisma/client';

export class Client implements PrismaClient {
  id: string;
  userId: string;
  name: string;
  rut: string | null;
  giro: string | null;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
