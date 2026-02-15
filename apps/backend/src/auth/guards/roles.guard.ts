import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../../common/decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    )
    if (!requiredRoles) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()
    const userRoleNames =
      user.roles?.map((role: { name: string }) => role.name) || []

    const hasRole = requiredRoles.some((role) => userRoleNames.includes(role))
    if (!hasRole) {
      console.log(`RolesGuard: Access DENIED. User ${user.email} (ID: ${user.id}) has roles [${userRoleNames.join(', ')}]. Required: [${requiredRoles.join(', ')}]`);
    } else {
      console.log(`RolesGuard: Access GRANTED. User ${user.email} (ID: ${user.id}) has roles [${userRoleNames.join(', ')}]. matched against: [${requiredRoles.join(', ')}]`);
    }
    return hasRole
  }
}
