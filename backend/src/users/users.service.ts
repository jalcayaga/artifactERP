
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto'; // Placeholder
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@prisma/client'; // Import User and UserRole types

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> { // Use User type
    const existingUser = await this.prisma.client.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const roleKey = createUserDto.role?.toUpperCase();
    // Ensure UserRole is correctly referenced
    const userRoleValue: UserRole = roleKey && roleKey in UserRole 
        ? UserRole[roleKey as keyof typeof UserRole] 
        : UserRole.VIEWER; 

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

  async findAll(): Promise<Omit<User, 'password'>[]> { // Use User type
    const users = await this.prisma.client.user.findMany();
    return users.map(({ password, ...user }) => user);
  }

  async findOneByEmail(email: string): Promise<User | null> { // Use User type
    return this.prisma.client.user.findUnique({
      where: { email },
    });
  }
  
  async findOneById(id: string): Promise<Omit<User, 'password'> | null> { // Use User type
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