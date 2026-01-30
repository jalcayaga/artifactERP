import axios from 'axios'
import { User, CreateUserDto, UserCredentials, UserRole } from '../types'
import { UploadService } from './uploadService'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const normalizeUser = (user: any): User => {
  const roleNames = Array.isArray(user.roles)
    ? user.roles
        .map((role: any) =>
          typeof role === 'string' ? role : role?.name
        )
        .filter(Boolean)
    : user.role
      ? [user.role]
      : []

  const normalizedRoles = roleNames.map((role: string) => role as UserRole)
  const primaryRole = user.role
    ? (user.role as UserRole)
    : normalizedRoles[0] ?? UserRole.CLIENT

  return {
    ...user,
    roles: normalizedRoles,
    role: primaryRole,
  }
}

export const UserService = {
  async getAllUsers(token: string): Promise<User[]> {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data.map(normalizeUser)
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  async getUserById(id: string, token: string): Promise<User> {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return normalizeUser(response.data)
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error)
      throw error
    }
  },

  async createUser(userData: CreateUserDto, token: string): Promise<User> {
    try {
      const payload: any = { ...userData }
      if (payload.role) {
        const primaryRole = payload.role as string
        const existingRoles = Array.isArray(payload.roles)
          ? (payload.roles as string[])
          : []
        payload.roles = existingRoles.length
          ? existingRoles
          : [primaryRole]
        delete payload.role
      }
      if (Array.isArray(payload.roles) && payload.roles.length === 0) {
        delete payload.roles
      }

      const response = await axios.post(`${API_URL}/users`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return normalizeUser(response.data)
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  async updateUser(
    id: string,
    userData: Partial<User>,
    token: string
  ): Promise<User> {
    try {
      const payload: any = { ...userData }
      if (payload.role) {
        const primaryRole = payload.role as string
        const existingRoles = Array.isArray(payload.roles)
          ? (payload.roles as string[])
          : []
        payload.roles = existingRoles.length
          ? existingRoles
          : [primaryRole]
        delete payload.role
      }
      if (Array.isArray(payload.roles) && payload.roles.length === 0) {
        delete payload.roles
      }

      const response = await axios.patch(`${API_URL}/users/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return normalizeUser(response.data)
    } catch (error) {
      console.error(`Error updating user ${id}:`, error)
      throw error
    }
  },

  async deleteUser(id: string, token: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error)
      throw error
    }
  },

  async uploadProfilePicture(
    userId: string,
    file: File,
    token: string
  ): Promise<{ url: string }> {
    try {
      const uploadResult = await UploadService.uploadImage(file)
      const imageUrl = uploadResult.url

      // Update the user's profile with the new image URL
      await UserService.updateUser(userId, { profilePictureUrl: imageUrl }, token)

      return { url: imageUrl }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      throw error
    }
  },

  async deleteProfilePicture(
    userId: string,
    token: string,
    profilePictureUrl?: string | null
  ): Promise<void> {
    try {
      const targetUrl = profilePictureUrl || undefined
      if (targetUrl) {
        const filename = targetUrl.split('/').pop()
        if (filename) {
          await UploadService.deleteImage(filename)
        }
      }
      // Then, remove the URL from the user's profile
      await UserService.updateUser(userId, { profilePictureUrl: null }, token)
    } catch (error) {
      console.error('Error deleting profile picture:', error)
      throw error
    }
  },
}
