'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Truck,
  ShoppingCart,
  ShoppingBag,
  FileText,
  CreditCard,
  Package,
  Users,
  Shield,
  Plug,
  Palette,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Empresas', href: '/companies', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Proveedores', href: '/providers', icon: <Truck className="w-5 h-5" /> },
    { name: 'Ventas', href: '/sales', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Compras', href: '/purchases', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Facturación', href: '/invoices', icon: <FileText className="w-5 h-5" /> },
    { name: 'Suscripciones', href: '/subscriptions', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Inventario', href: '/inventory', icon: <Package className="w-5 h-5" /> },
    { name: 'Usuarios', href: '/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Roles', href: '/roles', icon: <Shield className="w-5 h-5" /> },
    { name: 'Integraciones', href: '/integrations', icon: <Plug className="w-5 h-5" /> },
    { name: 'Branding', href: '/branding', icon: <Palette className="w-5 h-5" /> },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`
        ${isCollapsed ? 'w-20' : 'w-64'}
        hidden md:flex flex-col
        bg-[rgba(var(--card-bg),0.4)]
        backdrop-blur-xl
        border-r border-[rgba(var(--border-color),0.1)]
        transition-all duration-300 ease-out
        relative
      `}
    >
      {/* Logo Section */}
      <div className={`p-6 border-b border-[rgba(var(--border-color),0.1)] ${isCollapsed ? 'px-4' : ''}`}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgb(var(--brand-color))] to-[rgba(var(--brand-color),0.6)] flex items-center justify-center shadow-lg shadow-[rgba(var(--brand-color),0.3)] group-hover:shadow-[rgba(var(--brand-color),0.5)] transition-all duration-300">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-[rgb(var(--brand-color))] opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <span className="text-xl font-bold tracking-tight text-[rgb(var(--text-primary))]">
                Artifact
              </span>
              <span className="block text-xs text-[rgb(var(--text-secondary))] tracking-wider uppercase">
                ERP System
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 group
                ${active
                  ? 'bg-gradient-to-r from-[rgba(var(--brand-color),0.2)] to-[rgba(var(--brand-color),0.05)] text-[rgb(var(--brand-color))]'
                  : 'text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgba(var(--bg-secondary),0.5)]'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.name : undefined}
            >
              {/* Active indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[rgb(var(--brand-color))] rounded-r-full" />
              )}

              <span className={`flex-shrink-0 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>

              {!isCollapsed && (
                <span className="font-medium text-sm truncate">{item.name}</span>
              )}

              {!isCollapsed && item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-[rgb(var(--brand-color))] text-black">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-[rgba(var(--border-color),0.1)]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgba(var(--bg-secondary),0.5)] transition-all duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Colapsar</span>
            </>
          )}
        </button>
      </div>

      {/* Premium Badge */}
      {!isCollapsed && (
        <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-[rgba(var(--brand-color),0.1)] to-transparent border border-[rgba(var(--brand-color),0.2)]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[rgb(var(--brand-color))]" />
            <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">Plan Pro</span>
          </div>
          <p className="text-xs text-[rgb(var(--text-secondary))]">
            Acceso completo a todas las funciones
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
