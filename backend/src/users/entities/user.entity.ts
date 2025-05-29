
import { Prisma } from '@prisma/client'; // Changed to import Prisma namespace

export class UserEntity {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: Prisma.UserRole; // Use Prisma.UserRole
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity & { password?: string }>) {
    Object.assign(this, partial);
    if (partial.role) {
      this.role = partial.role;
    }
  }
}
