
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto'; // Placeholder
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client'; // Changed to import Prisma namespace

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<Prisma.User, 'password'>> { // Changed User to Prisma.User
    const existingUser = await this.prisma.client.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const roleKey = createUserDto.role?.toUpperCase();
    const userRoleValue: Prisma.UserRole = roleKey && roleKey in Prisma.UserRole 
        ? Prisma.UserRole[roleKey as keyof typeof Prisma.UserRole] 
        : Prisma.UserRole.VIEWER; 

    const user = await this.prisma.client.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        role: userRoleValue, 
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async findAll(): Promise<Omit<Prisma.User, 'password'>[]> { // Changed User to Prisma.User
    const users = await this.prisma.client.user.findMany();
    return users.map(({ password, ...user }) => user);
  }

  async findOneByEmail(email: string): Promise<Prisma.User | null> { // Changed User to Prisma.User
    return this.prisma.client.user.findUnique({
      where: { email },
    });
  }
  
  async findOneById(id: string): Promise<Omit<Prisma.User, 'password'> | null> { // Changed User to Prisma.User
    const user = await this.prisma.client.user.findUnique({
      where: { id },
    });
    if (!user) {
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  // Placeholder for update
  // async update(id: string, updateUserDto: UpdateUserDto) {
  //   // Add logic to update user, potentially hashing new password if provided
  //   return `This action updates a #${id} user`;
  // }

  // Placeholder for remove
  // async remove(id: string) {
  //   // Add logic to "soft delete" (mark as inactive) or hard delete
  //   return `This action removes a #${id} user`;
  // }
}
