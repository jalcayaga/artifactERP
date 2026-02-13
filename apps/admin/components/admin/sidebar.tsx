'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  BuildingStorefrontIcon,
  TicketIcon,
  ReceiptPercentIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  UsersIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  PaintBrushIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TagIcon,
  BuildingOffice2Icon,
  ClipboardDocumentCheckIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useSupabaseAuth } from '@artifact/core/client';
import { Store } from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { signOut, user } = useSupabaseAuth();
  const [open, setOpen] = React.useState(0);

  const isActive = (path: string) => pathname === path;

  // Navigation Items Mapping
  const navItems = [
    { name: 'Dashboard', path: '/', icon: PresentationChartBarIcon },
    { name: 'Clientes/Proveedores', path: '/companies', icon: BuildingStorefrontIcon },
    { name: 'Ventas', path: '/sales', icon: ShoppingBagIcon },
    { name: 'Punto de Venta', path: '/pos', icon: ComputerDesktopIcon },
    { name: 'Órdenes de Compra', path: '/purchase-orders', icon: ClipboardDocumentListIcon },
    { name: 'Compras (Simple)', path: '/purchases', icon: ShoppingBagIcon },
    { name: 'Categorías', path: '/categories', icon: TagIcon },
    { name: 'Bodegas', path: '/warehouses', icon: BuildingOffice2Icon },
    { name: 'Facturación', path: '/invoices', icon: CurrencyDollarIcon },
    { name: 'Suscripciones', path: '/subscriptions', icon: TicketIcon },
    { name: 'Inventario', path: '/inventory', icon: ArchiveBoxIcon },
    { name: 'Usuarios', path: '/users', icon: UsersIcon },
    { name: 'Roles', path: '/roles', icon: ShieldCheckIcon },
    { name: 'Integraciones', path: '/integrations', icon: CpuChipIcon },
    { name: 'Branding', path: '/branding', icon: PaintBrushIcon },
  ];

  // Dummy Rail Icons to match reference aesthetic
  const railItems = [
    { icon: PresentationChartBarIcon, active: true }, // Main
    { icon: CurrencyDollarIcon, active: false },
    { icon: TicketIcon, active: false },
    { icon: UsersIcon, active: false },
    { icon: Cog6ToothIcon, active: false },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-[calc(100vh)] w-full max-w-[18rem] transition-transform duration-300 lg:translate-x-0 flex bg-[#0f172a] border-r border-white/5 shadow-2xl ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Brand Identity / Header */}
          <div className="p-6 pb-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                <BuildingStorefrontIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <Typography variant="h6" color="white" className="font-extrabold tracking-tight leading-none">
                  Artifact
                </Typography>
                <Typography variant="small" className="text-[10px] text-blue-gray-400 font-bold uppercase tracking-widest mt-1">
                  ERP Dashboard
                </Typography>
              </div>
            </div>

            <Typography variant="small" className="font-black text-blue-gray-600 uppercase tracking-widest text-[9px] mb-4 ml-1">
              Menú Principal
            </Typography>
          </div>

          <List
            className="flex-1 overflow-y-auto min-w-[200px] p-0 gap-1"
          >
            {navItems.map((item) => {
              const active = isActive(item.path);
              const isFrontendSection = item.name === 'Inventario';

              return (
                <React.Fragment key={item.path}>
                  {isFrontendSection && (
                    <div className="mt-4 mb-2 px-2">
                      <Typography variant="small" className="text-[11px] font-bold text-blue-gray-500 uppercase tracking-wider">
                        Pages & Apps
                      </Typography>
                    </div>
                  )}
                  <Link href={item.path} onClick={() => setMobileOpen(false)}>
                    <ListItem
                      selected={active}
                      className={`group h-11 ${active
                        ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                        : "text-blue-gray-400 hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"}`}
                    >
                      <ListItemPrefix>
                        <item.icon className="h-5 w-5" />
                      </ListItemPrefix>
                      <span className="text-sm font-medium">{item.name}</span>
                    </ListItem>
                  </Link>
                </React.Fragment>
              );
            })}

            <hr className="my-4 border-blue-gray-50/10" />

            <ListItem
              className="text-blue-gray-400 hover:bg-red-500/10 hover:text-red-500 focus:bg-red-500/10 focus:text-red-500 h-11"
              onClick={() => signOut()}
            >
              <ListItemPrefix>
                <PowerIcon className="h-4 w-4" />
              </ListItemPrefix>
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </ListItem>
          </List>

          {/* Pro Plan Card (Compact) */}
          <div className="mt-auto pt-4">
            <div className="rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 p-3 text-white shadow-lg shadow-blue-500/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CurrencyDollarIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Typography variant="small" className="font-bold leading-none">
                    Plan Pro
                  </Typography>
                  <Typography variant="small" className="text-[10px] opacity-80 font-normal">
                    Upgrade now
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
