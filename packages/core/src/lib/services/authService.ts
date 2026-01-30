// lib/services/authService.ts
import { api } from '../api'
import {
  UserCredentials,
  NewUserCredentials,
  CreateUserDto,
  AuthenticatedUser,
  UserRole,
} from '../types'

interface LoginResponse {
  access_token: string
  user: AuthenticatedUser
  message?: string
}

interface BackendCreateUserDto extends CreateUserDto {}

const login = async (credentials: UserCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    const roles = (response.data.user.roles ?? [])
      .map((role) => role as UserRole)
    const primaryRole =
      response.data.user.role ?? roles[0] ?? UserRole.CLIENT

    return {
      ...response.data,
      user: {
        ...response.data.user,
        roles,
        role: primaryRole,
      },
    }
  } catch (error: any) {
    throw error
  }
}

const register = async (userData: NewUserCredentials): Promise<any> => {
  const createUserDto: BackendCreateUserDto = {
    email: userData.email,
    password: userData.password,
    firstName: userData.firstName,
    lastName: userData.lastName,
    roles: userData.roles ?? (userData.role ? [userData.role] : undefined),
  }
  try {
    if (!createUserDto.roles?.length && createUserDto.roles !== undefined) {
      delete createUserDto.roles
    }
    const response = await api.post('/auth/register', createUserDto)
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const AuthService = {
  login,
  register,
}
