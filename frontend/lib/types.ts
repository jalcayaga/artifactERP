// lib/types.ts
import React from 'react';

export type Theme = 'light' | 'dark';

export interface NavItem {
  name: string; 
  path: string; 
  icon: React.FC<{ className?: string }>; 
  subItems?: NavItem[]; 
}

export interface ThemeContextType {
  theme: Theme; 
  setTheme: (theme: Theme) => void; 
}

export interface Client {
  id: string; 
  name: string; 
  contactName?: string; 
  email?: string; 
  phone?: string; 
  type: 'Empresa' | 'Persona'; 
}

export interface SaleItem {
  id: string; 
  productName: string; 
  quantity: number; 
  unitPrice: number; 
  totalItemPrice: number; 
  itemVatAmount: number; 
}

export interface Sale {
  id: string; 
  clientName: string; 
  saleDate: string; 
  observations?: string; 
  items: SaleItem[]; 
  vatRatePercent: number; 
  subTotal: number; 
  totalVatAmount: number; 
  grandTotal: number; 
}

export interface Supplier {
  id: string; 
  name: string; 
}

export interface PurchaseOrderItem {
  id: string; 
  productName: string; 
  quantity: number; 
  unitPrice: number; 
  totalPrice: number; 
  itemVatAmount: number; 
  totalPriceWithVat: number; 
}

export interface PurchaseOrder {
  id: string; 
  supplierName: string; 
  orderDate: string; 
  expectedDeliveryDate?: string; 
  status: 'Pendiente' | 'Aprobada' | 'Recibida' | 'Cancelada'; 
  items: PurchaseOrderItem[]; 
  observations?: string; 
  vatRatePercent: number; 
  subTotal: number; 
  totalVatAmount: number; 
  grandTotal: number; 
}

export interface Product {
  id: string; 
  name: string; 
  productType: 'Producto' | 'Servicio'; 
  sku?: string; 
  description?: string; 
  category?: string; 
  currentStock?: number; 
  unitPrice: number; // Cost price for product, base rate for service (without VAT)
  reorderLevel?: number; 
  lastStockUpdate: string; 
}

export type QuoteStatus = 'Borrador' | 'Enviada' | 'Aceptada' | 'Rechazada' | 'Expirada' | 'Facturada';

export interface QuoteItem {
  id: string; 
  description: string; 
  quantity: number; 
  unitPrice: number; 
  totalItemPrice: number; 
  itemVatAmount: number; 
}

export interface Quote {
  id: string; 
  quoteNumber: string; 
  clientName: string; 
  quoteDate: string; 
  expiryDate?: string; 
  items: QuoteItem[]; 
  vatRatePercent: number; 
  subTotal: number; 
  discountAmount?: number; 
  totalVatAmount: number; 
  grandTotal: number; 
  status: QuoteStatus; 
  termsAndConditions?: string; 
  notes?: string; 
}

export enum UserRole {
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  VIEWER = 'Visor',
  // Add CLIENT role if you differentiate e-commerce customers from ERP users
  CLIENT = 'Client', 
}

export interface User {
  id: string; 
  firstName: string; 
  lastName: string; 
  email: string; 
  role: UserRole; 
  isActive: boolean; 
  password?: string; 
  lastLogin?: string; 
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface NewUserCredentials extends UserCredentials {
  firstName: string;
  lastName: string;
  role?: UserRole; 
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole; 
}

export interface AuthContextType {
  token: string | null;
  currentUser: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: NewUserCredentials) => Promise<{ success: boolean; error?: string; data?: any }>;
}

export interface LoginDto extends UserCredentials {} 

export interface CreateUserDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole | string; // Allow string for DTO from frontend, backend maps to enum
}