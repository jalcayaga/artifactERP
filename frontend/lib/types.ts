// lib/types.ts
import React from 'react';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

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
  userId: string;
  name: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  type: 'Empresa' | 'Persona';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClientDto {
  name: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  type: 'Empresa' | 'Persona';
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}

// Backend Order model maps to frontend Sale
export interface Sale {
  id: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subTotalAmount: number;
  vatAmount: number;
  vatRatePercent: number;
  discountAmount: number;
  shippingAmount: number;
  grandTotalAmount: number;
  currency: string;
  shippingAddress?: string | null;
  billingAddress?: string | null;
  customerNotes?: string | null;
  paymentMethod?: PaymentMethod | null;
  createdAt: string;
  updatedAt: string;
  user?: { firstName: string; lastName: string; email: string };
  orderItems?: OrderItem[];
  client?: Client;
  invoice?: Invoice | null;
}

// Backend OrderItem model maps to frontend OrderItem
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemVatAmount: number;
  totalPriceWithVat: number;
  createdAt: string;
  updatedAt: string;
  product?: Product; // Include product details if needed
  orderItemLots?: OrderItemLot[]; // NEW: Link to the specific lots from which this item was sold
}

export interface OrderItemLot {
  id: string;
  orderItemId: string;
  lotId: string;
  quantityTaken: number;
  lot?: LotInfo; // Include lot details if needed
}

export interface LotInfo {
  id: string;
  lotNumber: string;
  currentQuantity: number;
  purchasePrice: number;
  entryDate: string;
  expirationDate?: string;
  location?: string;
}

export interface Lot extends LotInfo {
  productId: string;
  product?: Product;
  initialQuantity: number;
  supplierId?: string;
  supplier?: Supplier;
  purchaseId?: string;
  purchase?: Purchase;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupplierDto {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {}

// Definición de Product compatible con el backend y frontend
export type ProductType = 'PRODUCT' | 'SERVICE'; // Updated to match backend enum

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
  reorderLevel?: number | null;
  isPublished: boolean; 
  createdAt?: string;
  updatedAt?: string;
  totalStock?: number; // Add totalStock property
}

export interface CreateProductDto {
  name: string;
  productType: ProductType;
  sku?: string;
  description?: string;
  longDescription?: string;
  images?: string[];
  category?: string;
  price: number;
  unitPrice?: number;
  reorderLevel?: number;
  isPublished?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}


export interface Purchase {
  id: string;
  supplierId: string; // Changed from supplierName to supplierId
  supplier?: Supplier; // Include supplier details
  purchaseDate: string;
  status: string;
  subTotalAmount: number;
  totalVatAmount: number;
  grandTotal: number;
  createdAt?: string;
  updatedAt?: string;
  items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchaseId?: string; // Made optional
  productId?: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemVatAmount: number;
  totalPriceWithVat: number;
  createdAt?: string;
  updatedAt?: string;
}


export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  DEBIT_CARD = 'DEBIT_CARD',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  OTHER = 'OTHER',
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  INVOICED = 'INVOICED',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  VOID = 'VOID',
  CANCELLED = 'CANCELLED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
  CLIENT = 'CLIENT', 
}

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subTotalAmount: number;
  vatAmount: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
  client: Client;
  items: any[];
  order?: Sale; // Assuming an invoice is linked to a Sale/Order
}

export interface Payment {
  id: string;
  invoiceId: string;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface Quote {
  id: string;
  clientId: string;
  client?: Client; // Include client details
  quoteDate: string;
  expiryDate?: string | null;
  status: QuoteStatus;
  vatRatePercent: number;
  subTotalAmount: number;
  discountAmount: number;
  totalVatAmount: number;
  grandTotalAmount: number;
  termsAndConditions?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: QuoteItem[];
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemVatAmount: number;
  totalPriceWithVat: number;
  product?: Product; // Include product details if needed
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

export interface CartContextType {
  items: CartItem[];
  cartTotal: number;
  itemCount: number; // Add itemCount here
  addItem: (product: Product, quantity: number, includeInstallation: boolean) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
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

// --- Tipos para Dashboard ---
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalSalesAmount: number;
  pendingInvoices: number;
  recentActivities: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  createdAt: string;
  status: string;
  user: { firstName: string; lastName: string };
}

// DTOs for creating sales (aligned with backend)
export interface CreateSaleItemDto {
  productId: string;
  quantity: number;
  unitPrice: number; // Changed from string to number for frontend
  totalPrice: number; // Changed from string to number for frontend
  itemVatAmount: number; // Changed from string to number for frontend
  totalPriceWithVat: number; // Changed from string to number for frontend
}

export interface CreateSaleDto {
  userId: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  subTotalAmount: number; // Changed from string to number for frontend
  vatAmount: number; // Changed from string to number for frontend
  vatRatePercent: number;
  discountAmount: number; // Changed from string to number for frontend
  shippingAmount: number; // Changed from string to number for frontend
  grandTotalAmount: number; // Changed from string to number for frontend
  currency: string;
  shippingAddress?: string;
  billingAddress?: string;
  customerNotes?: string;
  paymentMethod?: PaymentMethod;
  items: CreateSaleItemDto[];
}

export interface SaleItem extends CreateSaleItemDto {
  id: string;
  orderId: string;
  product: Product;
}

// DTOs for creating quotes (aligned with backend)
export interface CreateQuoteItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemVatAmount: number;
  totalPriceWithVat: number;
}

export interface CreateQuoteDto {
  clientId: string;
  quoteDate: string;
  expiryDate?: string;
  status?: QuoteStatus;
  vatRatePercent: number;
  subTotalAmount: number;
  discountAmount: number;
  totalVatAmount: number;
  grandTotalAmount: number;
  termsAndConditions?: string;
  notes?: string;
  items: CreateQuoteItemDto[];
}

export interface UpdateQuoteDto extends Partial<CreateQuoteDto> {
  status?: QuoteStatus;
}

export interface CreatePurchaseDto {
  supplierId: string;
  purchaseDate: string;
  status: string;
  items: { 
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    itemVatAmount: number;
    totalPriceWithVat: number;
  }[];
  subTotalAmount: number;
  totalVatAmount: number;
  grandTotal: number;
}

export interface UpdatePurchaseDto extends Partial<CreatePurchaseDto> {}