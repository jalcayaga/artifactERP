
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
  productId?: string; 
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

// Definición de Product compatible con el backend y frontend
// Aligned with backend's Prisma.ProductType which is 'PRODUCT' or 'SERVICE'
export type ProductType = 'Producto' | 'Servicio';

export interface Product {
  id: string;
  name: string;
  productType: ProductType; // Explicitly using the defined type
  sku?: string | null; 
  description?: string | null;
  longDescription?: string | null;
  images?: string[] | null; 
  category?: string | null;
  price: number; 
  unitPrice?: number | null; 
  currentStock?: number | null; 
  reorderLevel?: number | null;
  isPublished: boolean; 
  createdAt?: string;
  updatedAt?: string;
}


export interface PurchaseOrderItem {
  id: string;
  productId?: string; 
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
    role?: UserRole | string; 
}

// --- Tipos para E-commerce ---
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string; // Optional image for cart display
  installationService?: {
    id: string; // ID of the installation service product
    name: string;
    price: number; // Price of the installation for this item
  } | null;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, includeInstallation?: boolean) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}