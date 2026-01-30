import { Role } from './role.entity'

export class User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  roles: Role[]
  isActive: boolean
  profilePictureUrl: string | null
  createdAt: Date
  updatedAt: Date
}
