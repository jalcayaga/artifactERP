// lib/constants.ts
import { NavItem } from './types'; 
import { HomeIcon, BriefcaseIcon, ShoppingCartIcon, TruckIcon, ArchiveBoxIcon, CreditCardIcon, ChartPieIcon, CogIcon } from '@/icons';

export const NAVIGATION_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon }, 
  { name: 'Clientes (CRM)', path: '/admin/clients', icon: BriefcaseIcon }, 
  { name: 'Ventas', path: '/admin/sales', icon: ShoppingCartIcon }, 
  { name: 'Compras', path: '/admin/purchases', icon: TruckIcon }, 
  { name: 'Productos/Servicios', path: '/admin/inventory', icon: ArchiveBoxIcon }, 
  { name: 'Finanzas', path: '/admin/finance', icon: CreditCardIcon }, 
  { name: 'Reportes', path: '/admin/reports', icon: ChartPieIcon }, 
  { name: 'Configuración', path: '/admin/settings', icon: CogIcon }, 
];

// App name for the ERP Admin part
export const ERP_APP_NAME = "SubRed ERP";
// App name for the public E-commerce part
export const ECOMMERCE_APP_NAME = "SubRed Tienda";