'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation' // Import useRouter
import {
  UserCredentials,
  AuthenticatedUser,
  AuthContextType,
  NewUserCredentials,
  UserRole,
} from '../lib/types'
import { AuthService } from '../lib/services/authService'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const normalizeUser = (user: AuthenticatedUser): AuthenticatedUser => {
  const roles = user.roles && user.roles.length
    ? user.roles
    : user.role
      ? [user.role]
      : []

  const normalizedRoles = roles.map((role) => role as UserRole)

  const primaryRole = user.role ?? normalizedRoles[0] ?? UserRole.CLIENT

  return {
    ...user,
    roles: normalizedRoles,
    role: primaryRole,
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter() // Initialize router

  const logout = () => {
    console.log('Logging out...')
    setIsLoading(true)
    setToken(null)
    setCurrentUser(null)
    localStorage.removeItem('wolfflow_token')
    localStorage.removeItem('wolfflow_user')
    localStorage.removeItem('wolfflow_selectedCompanyId') // Clear selected company
    router.push('/login') // Redirect to login page
    setIsLoading(false)
  }

  const updateCurrentUser = (userData: Partial<AuthenticatedUser>) => {
    setCurrentUser((prevUser) => {
      if (!prevUser) return null
      const updatedUser = normalizeUser({ ...prevUser, ...userData })
      localStorage.setItem('wolfflow_user', JSON.stringify(updatedUser))
      return updatedUser
    })
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('wolfflow_token')
    const storedUser = localStorage.getItem('wolfflow_user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        const user = JSON.parse(storedUser)
        setCurrentUser(normalizeUser(user))
      } catch (e) {
        console.error('Failed to parse stored user data:', e)
        logout() // Use logout to clear invalid data and redirect
      }
    } else {
      // If no token, ensure user is logged out
      setToken(null)
      setCurrentUser(null)
    }
    setIsLoading(false)

    // Add event listener for auth errors
    const handleAuthError = () => {
      console.log('Auth error detected, logging out.')
      logout()
    }

    window.addEventListener('auth-error', handleAuthError)

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('auth-error', handleAuthError)
    }
  }, []) // Removed router from dependency array as it's stable

  const login = async (
    credentials: UserCredentials
  ): Promise<{ success: boolean; error?: string; needsSetup?: boolean }> => {
    setIsLoading(true)
    try {
      const response = await AuthService.login(credentials)
      if (response && response.access_token && response.user) {
        const normalizedUser = normalizeUser(response.user)
        setToken(response.access_token)
        setCurrentUser(normalizedUser)
        localStorage.setItem('wolfflow_token', response.access_token)
        localStorage.setItem('wolfflow_user', JSON.stringify(normalizedUser))

        // Check if user has any companies
        const needsSetup =
          !normalizedUser.companies || normalizedUser.companies.length === 0

        setIsLoading(false)
        return { success: true, needsSetup }
      } else {
        setIsLoading(false)
        return {
          success: false,
          error:
            response.message || 'Login failed: No token or user data received.',
        }
      }
    } catch (error: any) {
      setIsLoading(false)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred during login.'
      return { success: false, error: errorMessage }
    }
  }

  const register = async (
    userData: NewUserCredentials
  ): Promise<{ success: boolean; error?: string; data?: any }> => {
    setIsLoading(true)
    try {
      const response = await AuthService.register(userData)
      if (response) {
        // Automatically log in the user after successful registration
        const loginResult = await login({
          email: userData.email,
          password: userData.password,
        })
        setIsLoading(false)
        return {
          success: loginResult.success,
          error: loginResult.error,
          data: response,
        }
      }
      setIsLoading(false)
      return { success: true, data: response }
    } catch (error: any) {
      setIsLoading(false)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred during registration.'
      return { success: false, error: errorMessage }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        register,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
