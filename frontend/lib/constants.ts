
// lib/constants.ts
import { NavItem } from './types'; 
import { HomeIcon, BriefcaseIcon, ShoppingCartIcon, TruckIcon, ArchiveBoxIcon, CreditCardIcon, ChartPieIcon, CogIcon, WrenchScrewdriverIcon, UsersIcon, ShieldCheckIcon } from '@/components/Icons'; // Added WrenchScrewdriverIcon, UsersIcon, ShieldCheckIcon

export const NAVIGATION_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon }, 
  { name: 'Clientes (CRM)', path: '/admin/clients', icon: BriefcaseIcon }, 
  { name: 'Ventas', path: '/admin/sales', icon: ShoppingCartIcon }, 
  { name: 'Compras', path: '/admin/purchases', icon: TruckIcon }, 
  { name: 'Productos/Servicios', path: '/admin/inventory', icon: ArchiveBoxIcon }, 
  { name: 'Finanzas', path: '/admin/finance', icon: CreditCardIcon }, 
  { name: 'Reportes', path: '/admin/reports', icon: ChartPieIcon }, 
  { 
    name: 'Configuración', 
    path: '/admin/settings', 
    icon: CogIcon,
    // Example sub-items, though Sidebar currently doesn't render them.
    // subItems: [
    //   { name: 'General', path: '/admin/settings/general', icon: CogIcon },
    //   { name: 'Usuarios', path: '/admin/settings/users', icon: UsersIcon },
    //   { name: 'Roles', path: '/admin/settings/roles', icon: ShieldCheckIcon },
    // ],
  }, 
];

// Navigation items for the public E-commerce header
export const ECOMMERCE_PUBLIC_NAVIGATION_ITEMS: { name: string; path: string }[] = [
  { name: 'Inicio', path: '/' },
  { name: 'Catálogo', path: '/products' },
  { name: 'Servicios', path: '/#servicios' }, // Links to a section on the homepage
  // { name: 'Contacto', path: '/contact' }, // Example, if you add a contact page
];


// App name for the ERP Admin part
export const ERP_APP_NAME = "SubRed ERP"; 
// App name for the public E-commerce part
export const ECOMMERCE_APP_NAME = "SubRed Tienda";