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
  productId?: string; // Optional: to link back to a product if needed
  productName: string; 
  quantity: number; 
  unitPrice: number; // Price at which it was sold (without VAT)
  totalItemPrice: number; // quantity * unitPrice
  itemVatAmount: number; // VAT for this line item
}

export interface Sale {
  id: string; 
  clientName: string; 
  saleDate: string; 
  observations?: string; 
  items: SaleItem[]; 
  vatRatePercent: number; 
  subTotal: number; // Sum of totalItemPrice for all items
  totalVatAmount: number; // Sum of itemVatAmount for all items
  grandTotal: number; // subTotal + totalVatAmount
}

export interface Supplier {
  id: string; 
  name: string; 
}

export interface Product {
  id: string;
  name: string;
  productType: 'Producto' | 'Servicio'; // User-friendly for frontend display
  sku?: string;
  description?: string;
  longDescription?: string;
  images?: string[]; // Array of image URLs/paths
  category?: string;
  price: number; // Selling price (corresponds to 'price' on backend Product model, without VAT)
  unitPrice?: number; // Cost price (corresponds to 'unitPrice' on backend Product model, without VAT)
  currentStock?: number | null; // Allow null for services or untracked products
  reorderLevel?: number | null;
  isPublished: boolean; // Default to false or true based on preference
}

export interface PurchaseOrderItem {
  id: string;
  productId?: string; // Optional: to link back to a product
  productName: string; // Snapshot of product name at time of order
  quantity: number;
  unitPrice: number; // Cost per unit from supplier (without VAT)
  totalPrice: number; // quantity * unitPrice (subtotal for this item, without VAT)
  itemVatAmount: number; // VAT for this line item
  totalPriceWithVat: number; // totalPrice + itemVatAmount
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
  subTotal: number; // Sum of totalPrice for all items
  totalVatAmount: number; // Sum of itemVatAmount for all items
  grandTotal: number; // subTotal + totalVatAmount
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