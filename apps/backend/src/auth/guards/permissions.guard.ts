import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { REQUIRED_PERMISSIONS_KEY } from '../../common/decorators/required-permissions.decorator'
import { Permission } from '../../common/types/permissions.types'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      REQUIRED_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (!requiredPermissions) {
      return true // No specific permissions required, access granted
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user // Assuming user is attached to the request by JwtAuthGuard

    if (!user) {
      return false // No user, no access
    }

    // Fetch user's roles with their associated permissions
    const userWithRolesAndPermissions = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    })

    if (!userWithRolesAndPermissions) {
      return false // User not found in DB, no access
    }

    const userPermissions = new Set<Permission>()
    userWithRolesAndPermissions.roles.forEach((userRole) => {
      userRole.permissions.forEach((rolePermission) => {
        userPermissions.add(rolePermission.permission.name as Permission)
      })
    })

    // Check if the user has all required permissions
    return requiredPermissions.every((permission) =>
      userPermissions.has(permission)
    )
  }
}
