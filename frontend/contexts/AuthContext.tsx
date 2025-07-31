
// contexts/AuthContext.tsx
'use client'; // Mark as a Client Component

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserCredentials, AuthenticatedUser, AuthContextType, NewUserCredentials } from '@/lib/types'; // Adjusted path
import { AuthService } from '@/lib/services/authService'; // Adjusted path

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  useEffect(() => {
    const storedToken = localStorage.getItem('wolfflow_token');
    const storedUser = localStorage.getItem('wolfflow_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        // Clear invalid stored user data
        localStorage.removeItem('wolfflow_user');
        localStorage.removeItem('wolfflow_token');
        setToken(null);
        setCurrentUser(null);
      }
    }
    setIsLoading(false);
  }, []);


  const login = async (credentials: UserCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(credentials);
      if (response && response.access_token && response.user) {
        setToken(response.access_token);
        setCurrentUser(response.user);
        localStorage.setItem('wolfflow_token', response.access_token);
        localStorage.setItem('wolfflow_user', JSON.stringify(response.user));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: response.message || 'Login failed: No token or user data received.' };
      }
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred during login.';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: NewUserCredentials): Promise<{ success: boolean; error?: string; data?: any }> => {
    setIsLoading(true);
    try {
      const response = await AuthService.register(userData);
      if (response) {
        // Automatically log in the user after successful registration
        const loginResult = await login({ email: userData.email, password: userData.password });
        setIsLoading(false);
        return { success: loginResult.success, error: loginResult.error, data: response };
      }
      setIsLoading(false);
      return { success: true, data: response }; 
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred during registration.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setIsLoading(true); // Show loading briefly for logout
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('wolfflow_token');
    localStorage.removeItem('wolfflow_user');
    setIsLoading(false);
    // router.push('/login'); // Would use Next.js router here
  };

  return (
    <AuthContext.Provider value={{ token, currentUser, isAuthenticated: !!token, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};