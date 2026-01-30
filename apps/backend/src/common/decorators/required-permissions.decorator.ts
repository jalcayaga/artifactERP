import { SetMetadata } from '@nestjs/common'
import { Permission } from '../types/permissions.types'

export const REQUIRED_PERMISSIONS_KEY = 'requiredPermissions'
export const RequiredPermissions = (...permissions: Permission[]) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions)
