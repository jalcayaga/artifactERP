import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { User, Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(tenantId: string, createUserDto: CreateUserDto): Promise<User> {
    const { email, password, firstName, lastName, roles, isActive } =
      createUserDto
    const existingUser = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email } },
    })
    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        isActive,
        tenantId,
        roles: {
          connect: roles?.map((role) => ({ name: role })) ?? [],
        },
      },
    })
  }

  async findAll(tenantId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        tenantId,
      },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
      },
    })
  }

  async findOne(tenantId: string, id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, tenantId },
      include: {
        companies: true,
        roles: {
          select: {
            name: true,
          },
        },
      },
    })
  }

  async findOneById(tenantId: string, id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, tenantId },
      include: {
        companies: true,
        roles: {
          select: {
            name: true,
          },
        },
      },
    })
  }

  async findByEmail(tenantId: string, email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email } },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
        companies: true,
      },
    })
  }

  async update(
    tenantId: string,
    id: string,
    updateUserDto: UpdateUserDto,
    options: {
      allowRoleChange?: boolean
      allowStatusChange?: boolean
      allowEmailChange?: boolean
    } = {}
  ): Promise<User> {
    const {
      allowRoleChange = false,
      allowStatusChange = false,
      allowEmailChange = false,
    } = options
    const existingUser = await this.prisma.user.findFirst({
      where: { id, tenantId },
    })
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found.`)
    }

    const data: Prisma.UserUpdateInput = {}

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      if (!allowEmailChange) {
        throw new ForbiddenException('You are not allowed to change the email.')
      }
      const emailInUse = await this.prisma.user.findUnique({
        where: { tenantId_email: { tenantId, email: updateUserDto.email } },
      })
      if (emailInUse) {
        throw new ConflictException('User with this email already exists')
      }
      data.email = updateUserDto.email
    }

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    if (updateUserDto.firstName !== undefined) {
      data.firstName = updateUserDto.firstName
    }

    if (updateUserDto.lastName !== undefined) {
      data.lastName = updateUserDto.lastName
    }

    if (updateUserDto.roles !== undefined) {
      if (!allowRoleChange) {
        throw new ForbiddenException(
          'You are not allowed to change the user roles.'
        )
      }
      data.roles = {
        set: updateUserDto.roles.map((role) => ({ name: role })),
      }
    }

    if (updateUserDto.isActive !== undefined) {
      if (!allowStatusChange) {
        throw new ForbiddenException(
          'You are not allowed to change the active status.'
        )
      }
      data.isActive = updateUserDto.isActive
    }

    if (updateUserDto.profilePictureUrl !== undefined) {
      data.profilePictureUrl = updateUserDto.profilePictureUrl
    }

    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        companies: true,
        roles: {
          select: {
            name: true,
          },
        },
      },
    })
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const existingUser = await this.prisma.user.findFirst({
      where: { id, tenantId },
    })
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found.`)
    }
    await this.prisma.user.delete({ where: { id } })
  }
}
