// lib/types.ts
import React from 'react'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export type Theme = 'light' | 'dark'

export interface NavItem {
  name: string
  path: string
  icon: any
  subItems?: NavItem[]
}

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// NEW: Unified Company Model (replaces Client and Supplier)
export interface Company {
  id: string
  userId: string // ID del usuario que creó/gestiona esta empresa
  name: string
  fantasyName?: string | null
  rut?: string | null // RUT of the company
  giro?: string | null // Business activity of the company
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  phone?: string | null
  email?: string | null
  isClient: boolean // Can this company be a client?
  isSupplier: boolean // Can this company be a supplier?
  createdAt?: string
  updatedAt?: string
  contactPeople?: ContactPerson[] // A company can have many contact people
}

export interface CreateCompanyDto {
  name: string
  fantasyName?: string
  rut?: string
  giro?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  email?: string
  isClient?: boolean
  isSupplier?: boolean
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> { }

// NEW: Company Filter Options
export interface CompanyFilterOptions {
  isClient?: boolean;
  isSupplier?: boolean;
  companyOwnership?: 'mine' | 'others' | 'all';
}

// NEW: Contact Person Model
export interface ContactPerson {
  id: string
  companyId: string
  firstName: string
  lastName?: string | null
  email?: string | null
  phone?: string | null
  role?: string | null // e.g., "Ventas", "Compras", "Gerente"
  createdAt?: string
  updatedAt?: string
}

export interface CreateContactPersonDto {
  companyId: string
  firstName: string
  lastName?: string
  email?: string
  phone?: string
  role?: string
}

export interface UpdateContactPersonDto
  extends Partial<CreateContactPersonDto> { }

// Backend Order model maps to frontend Sale
export interface Sale {
  id: string
  userId: string
  companyId: string // NEW: Link to Company (client)
  company?: Company // Include company details
  source: OrderSource // NEW: Source of the order
  status: OrderStatus
  paymentStatus: PaymentStatus
  subTotalAmount: number
  vatAmount: number
  vatRatePercent: number
  discountAmount: number
  shippingAmount: number
  grandTotalAmount: number
  currency: string
  shippingAddress?: string | null
  billingAddress?: string | null
  customerNotes?: string | null
  paymentMethod?: PaymentMethod | null
  createdAt: string
  updatedAt: string
  user?: { firstName: string; lastName: string; email: string }
  orderItems?: OrderItem[]
  invoice?: Invoice | null
}

// Backend OrderItem model maps to frontend OrderItem
export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  itemVatAmount: number
  totalPriceWithVat: number
  createdAt: string
  updatedAt: string
  product?: Product // Include product details if needed
  orderItemLots?: OrderItemLot[] // NEW: Link to the specific lots from which this item was sold
}

export interface OrderItemLot {
  id: string
  orderItemId: string
  lotId: string
  quantityTaken: number
  lot?: LotInfo // Include lot details if needed
}

export interface LotInfo {
  id: string
  lotNumber: string
  currentQuantity: number
  purchasePrice: number
  entryDate: string
  expirationDate?: string
  location?: string
}

export interface Lot extends LotInfo {
  productId: string
  product?: Product
  initialQuantity: number
  companyId?: string // NEW: Link to Company (supplier)
  company?: Company // NEW: Include company details
  purchaseId?: string
  purchase?: Purchase
}

// Definición de Product compatible con el backend y frontend
export type ProductType = 'PRODUCT' | 'SERVICE' // Updated to match backend enum

export interface Product {
  id: string
  name: string
  productType: ProductType // Explicitly using the defined type
  sku?: string | null
  description?: string | null
  longDescription?: string | null
  images?: string[] | null
  category?: string | null
  categoryId?: string | null // Add categoryId property
  price: number
  unitPrice?: number | null
  reorderLevel?: number | null
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
  totalStock?: number // Add totalStock property
  technicalSheetUrl?: string | null // Add technicalSheetUrl property
  thumbnail?: string | null // Add thumbnail property
}

export interface ProductIntelligence {
  lots: {
    id: string;
    lotNumber: string;
    currentQuantity: number;
    purchasePrice: number;
    entryDate: string;
    expirationDate?: string;
    warehouseName: string;
  }[];
  averagePurchasePrice: number;
  suggestedPrice: number;
  branchPrices?: {
    price: number;
    name: string;
  }[];
}

export interface ChannelOffer {
  id: string
  tenantId: string
  channel: OrderSource
  productId: string
  price: number
  isActive: boolean
  metadata?: any
  allowedLotIds: string[]
  product?: Product
  createdAt?: string
  updatedAt?: string
}

export interface CreateChannelOfferDto {
  channel: OrderSource
  productId: string
  price: number
  isActive?: boolean
  metadata?: any
  allowedLotIds?: string[]
}

export interface UpdateChannelOfferDto extends Partial<CreateChannelOfferDto> { }

export interface CreateProductDto {
  name: string
  productType: ProductType
  sku?: string
  description?: string
  longDescription?: string
  images?: string[]
  category?: string
  price: number
  unitPrice?: number
  reorderLevel?: number
  isPublished?: boolean
}

export interface UpdateProductDto extends Partial<CreateProductDto> { }

export interface Purchase {
  id: string
  companyId: string // NEW: Link to Company (supplier)
  company?: Company // Include company details
  purchaseDate: string
  status: string
  subTotalAmount: number
  totalVatAmount: number
  grandTotal: number
  vatRatePercent: number // NEW: Add vatRatePercent property
  createdAt?: string
  updatedAt?: string
  items?: PurchaseItem[]
}

export interface PurchaseItem {
  id: string
  purchaseId?: string // Made optional
  productId?: string | null
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  itemVatAmount: number
  totalPriceWithVat: number
  createdAt?: string
  updatedAt?: string
}

export interface PurchaseOrder {
  id: string
  companyId: string // NEW: Link to Company (supplier)
  company?: Company // Include company details
  orderDate: string
  expectedDeliveryDate?: string | null
  status: 'DRAFT' | 'ISSUED' | 'PARTIALLY_RECEIVED' | 'COMPLETED' | 'CANCELLED'
  subTotalAmount: number
  totalVatAmount: number
  grandTotal: number
  createdAt?: string
  updatedAt?: string
  items?: PurchaseOrderItem[]
}

export interface PurchaseOrderItem {
  id: string
  purchaseOrderId: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  itemVatAmount: number
  totalPriceWithVat: number
  createdAt?: string
  updatedAt?: string
}

export interface CreatePurchaseOrderDto {
  companyId: string
  orderDate: string
  expectedDeliveryDate?: string
  status?: 'DRAFT' | 'ISSUED' | 'PARTIALLY_RECEIVED' | 'COMPLETED' | 'CANCELLED'
  items: {
    productId: string
    quantity: number
    unitPrice: number
    totalPrice: number
    itemVatAmount: number
    totalPriceWithVat: number
  }[]
  subTotalAmount: number
  totalVatAmount: number
  grandTotal: number
}

export interface UpdatePurchaseOrderDto
  extends Partial<CreatePurchaseOrderDto> { }

export enum OrderSource {
  WEB = 'WEB',
  POS = 'POS',
  ADMIN = 'ADMIN',
  MERCADO_LIBRE = 'MERCADO_LIBRE',
  UBER_EATS = 'UBER_EATS',
  PEDIDOS_YA = 'PEDIDOS_YA',
  WHATSAPP = 'WHATSAPP',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  TIKTOK = 'TIKTOK',
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
  WEBPAY = 'WEBPAY',
  MERCADO_PAGO = 'MERCADO_PAGO',
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
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
  CLIENT = 'CLIENT',
  CASHIER = 'CASHIER',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
  WEB_SALES = 'WEB_SALES',
}

export enum DispatchStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface Invoice {
  id: string
  orderId: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  status: InvoiceStatus
  subTotalAmount: number
  vatAmount: number
  grandTotal: number
  createdAt: string
  updatedAt: string
  companyId: string // NEW: Link to Company (client)
  company?: Company // Include company details
  items: any[]
  order?: Sale // Assuming an invoice is linked to a Sale/Order
  payments?: Payment[] // NEW: Add payments property
  amountPaid?: number // NEW: Track payments
}

export interface Payment {
  id: string
  invoiceId: string
  paymentDate: string
  amount: number
  paymentMethod: PaymentMethod
  transactionId?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentDto {
  invoiceId: string
  amount: number
  paymentMethod: PaymentMethod
}

export interface Quote {
  id: string
  companyId: string // NEW: Link to Company (client)
  company?: Company // Include company details
  quoteDate: string
  expiryDate?: string | null
  status: QuoteStatus
  vatRatePercent: number
  subTotalAmount: number
  discountAmount: number
  totalVatAmount: number
  grandTotalAmount: number
  termsAndConditions?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  items?: QuoteItem[]
}

export interface QuoteItem {
  id: string
  quoteId: string
  productId: string
  lotId?: string | null
  lot?: Lot | null
  quantity: number
  unitPrice: number
  totalPrice: number
  itemVatAmount: number
  totalPriceWithVat: number
  product?: Product // Include product details if needed
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role?: UserRole
  roles?: UserRole[]
  isActive: boolean
  password?: string
  lastLogin?: string
  profilePictureUrl?: string | null;
}

export interface UserCredentials {
  email: string
  password: string
}

export interface NewUserCredentials extends UserCredentials {
  firstName: string
  lastName: string
  role?: UserRole
  roles?: UserRole[]
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  roles?: UserRole[];
  isActive: boolean;
  profilePictureUrl?: string | null;
  companies?: Company[];
}

export interface AuthContextType {
  token: string | null;
  currentUser: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    credentials: UserCredentials
  ) => Promise<{ success: boolean; error?: string; needsSetup?: boolean }>;
  logout: () => void;
  register: (
    userData: NewUserCredentials
  ) => Promise<{ success: boolean; error?: string; data?: any; needsSetup?: boolean }>;
  updateCurrentUser: (userData: Partial<AuthenticatedUser>) => void;
}

export interface CartContextType {
  items: CartItem[]
  cartTotal: number
  itemCount: number // Add itemCount here
  addItem: (
    product: Product,
    quantity: number,
    includeInstallation: boolean
  ) => void
  removeItem: (productId: string) => void
  updateItemQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export interface LoginDto extends UserCredentials { }

export interface CreateUserDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role?: UserRole
  roles?: UserRole[]
}

// --- Tipos para E-commerce ---
export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string // Optional image for cart display
  installationService?: {
    id: string // ID of the installation service product
    name: string
    price: number // Price of the installation for this item
  } | null
}

// --- Tipos para Dashboard ---
export interface DashboardStats {
  totalUsers: number
  totalCompanies: number
  totalProducts: number
  totalOrders: number
  totalSalesAmount: number
  pendingInvoices: number
  acceptedQuotes: number
  recentActivities: RecentActivity[]
}

export interface RecentActivity {
  id: string
  createdAt: string
  status: string
  user: { firstName: string; lastName: string }
}

// DTOs for creating sales (aligned with backend)
export interface CreateSaleItemDto {
  productId: string
  quantity: number
  unitPrice: number // Changed from string to number for frontend
  totalPrice: number // Changed from string to number for frontend
  itemVatAmount: number // Changed from string to number for frontend
  totalPriceWithVat: number // Changed from string to number for frontend
  lots?: { lotId: string; quantity: number }[] // NEW: Lots for manual selection
}

export interface CreateSaleDto {
  userId: string
  companyId: string // NEW: Add companyId property
  source?: OrderSource // NEW: Source of the order
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  subTotalAmount: number // Changed from string to number for frontend
  vatAmount: number // Changed from string to number for frontend
  vatRatePercent: number
  discountAmount: number // Changed from string to number for frontend
  shippingAmount: number // Changed from string to number for frontend
  grandTotalAmount: number // Changed from string to number for frontend
  currency: string
  shippingAddress?: string
  billingAddress?: string
  customerNotes?: string
  paymentMethod?: PaymentMethod
  items: CreateSaleItemDto[]
  posShiftId?: string
}

export interface UpdateSaleDto extends Partial<CreateSaleDto> { }

export interface SaleItem extends CreateSaleItemDto {
  id: string
  orderId: string
  product: Product
}

// DTOs for creating quotes (aligned with backend)
export interface CreateQuoteItemDto {
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  itemVatAmount: number
  totalPriceWithVat: number
}

export interface CreateQuoteDto {
  companyId: string // NEW: Link to Company (client)
  quoteDate: string
  expiryDate?: string
  status?: QuoteStatus
  vatRatePercent: number
  subTotalAmount: number
  discountAmount: number
  totalVatAmount: number
  grandTotalAmount: number
  termsAndConditions?: string
  notes?: string
  items: CreateQuoteItemDto[]
}

export interface UpdateQuoteDto extends Partial<CreateQuoteDto> {
  status?: QuoteStatus
}

export interface CreatePurchaseDto {
  companyId: string // NEW: Link to Company (supplier)
  purchaseDate: string
  status: string
  items: {
    productId: string
    quantity: number
    unitPrice: number
    totalPrice: number
    itemVatAmount: number
    totalPriceWithVat: number
  }[]
  subTotalAmount: number
  totalVatAmount: number
  grandTotal: number
}

export interface UpdatePurchaseDto extends Partial<CreatePurchaseDto> { }

// --- Advanced Supply Chain ---

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
  parent?: Category | null
  children?: Category[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateCategoryDto {
  name: string
  description?: string
  parentId?: string
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> { }

export interface Warehouse {
  id: string
  name: string
  address?: string | null
  isDefault: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateWarehouseDto {
  name: string
  address?: string
  isDefault?: boolean
}

export interface UpdateWarehouseDto extends Partial<CreateWarehouseDto> { }

export interface Reception {
  id: string
  warehouseId: string
  warehouse?: Warehouse
  purchaseOrderId?: string | null
  purchaseOrder?: PurchaseOrder
  receptionNumber?: string | null
  receptionDate: string
  status: string
  notes?: string | null
  createdAt?: string
  updatedAt?: string
  items?: ReceptionItem[]
}

export interface ReceptionItem {
  id: string
  receptionId: string
  productId: string
  product?: Product
  quantity: number
  lotId?: string | null
  lot?: Lot
}

export interface CreateReceptionDto {
  warehouseId: string
  purchaseOrderId?: string
  receptionNumber?: string
  receptionDate?: string
  notes?: string
  items: {
    productId: string
    quantity: number
    expirationDate?: string
    location?: string
  }[]
}

// --- Logistics & Dispatches ---
export interface Courier {
  id: string
  name: string
  contactName?: string | null
  email?: string | null
  phone?: string | null
  websiteUrl?: string | null
  integrationType?: string | null
  isActive: boolean
}

export interface Dispatch {
  id: string
  tenantId: string
  orderId: string
  courierId?: string | null
  dispatchNumber?: string | null
  trackingNumber?: string | null
  status: DispatchStatus
  dispatchDate: string
  estimatedArrival?: string | null
  shippingCost: number
  notes?: string | null
  originAddress?: string | null
  destinationAddress?: string | null
  createdAt: string
  updatedAt: string
  order?: Sale
  courier?: Courier | null
  items: DispatchItem[]
}

export interface DispatchItem {
  id: string
  dispatchId: string
  orderItemId: string
  quantity: number
  orderItem?: OrderItem
}

export interface CreateDispatchDto {
  orderId: string
  courierId?: string
  status?: DispatchStatus
  dispatchDate?: string
  estimatedArrival?: string
  shippingCost?: number
  notes?: string
  originAddress?: string
  destinationAddress?: string
  dispatchNumber?: string
}

export interface UpdateDispatchDto extends Partial<CreateDispatchDto> { }
