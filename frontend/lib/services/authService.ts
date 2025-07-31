
// lib/services/authService.ts
import axios from 'axios';
import { UserCredentials, NewUserCredentials, CreateUserDto, AuthenticatedUser } from '@/lib/types'; // Adjusted path

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface LoginResponse {
  access_token: string;
  user: AuthenticatedUser;
  message?: string; 
}

interface BackendCreateUserDto extends CreateUserDto {}

const login = async (credentials: UserCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error: any) {
    throw error; 
  }
};

const register = async (userData: NewUserCredentials): Promise<any> => { 
  const createUserDto: BackendCreateUserDto = {
    email: userData.email,
    password: userData.password,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role, 
  };
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, createUserDto); 
    return response.data;
  } catch (error: any) {
    throw error; 
  }
};

export const AuthService = {
  login,
  register,
};