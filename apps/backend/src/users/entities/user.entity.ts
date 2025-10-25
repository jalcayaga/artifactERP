import { UserRole } from "@prisma/client";

export class UserEntity {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: UserRole;
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
