// lib/constants.ts
import { NavItem } from './types'
import {
  Home,
  BriefcaseBusiness,
  ShoppingCart,
  Truck,
  Archive,
  CreditCard,
  PieChart,
  Settings,
  FileText,
} from 'lucide-react'

export const NAVIGATION_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
  { name: 'Clientes/Proveedores', path: '/admin/clients', icon: BriefcaseBusiness },
  { name: 'Ventas', path: '/admin/sales', icon: ShoppingCart },
  {
    name: 'Facturación',
    path: '/admin/invoices',
    icon: FileText,
  },
  {
    name: 'Ingreso de Mercadería',
    path: '/admin/purchases',
    icon: Archive,
  },
  {
    name: 'Órdenes de Compra',
    path: '/admin/purchase-orders',
    icon: Truck,
  },
  { name: 'Cotizaciones', path: '/admin/quotes', icon: FileText },
  {
    name: 'Productos/Servicios',
    path: '/admin/inventory',
    icon: Archive,
  },
  { name: 'Finanzas', path: '/admin/finance', icon: CreditCard },
  { name: 'Reportes', path: '/admin/reports', icon: PieChart },
  {
    name: 'Configuración',
    path: '/admin/settings',
    icon: Settings,
  },
]

// Navigation items for the public E-commerce header
export const ECOMMERCE_PUBLIC_NAVIGATION_ITEMS: {
  name: string
  path: string
}[] = [
  { name: 'Inicio', path: '/' },
  { name: 'Catálogo', path: '/products' },
  { name: 'Servicios', path: '/#servicios' },
]

export const ERP_APP_NAME = 'SubRed ERP'
export const ECOMMERCE_APP_NAME = 'SubRed Tienda'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
