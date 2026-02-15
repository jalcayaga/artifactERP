'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Typography, List, ListItem, ListItemPrefix, ListItemSuffix } from "@material-tailwind/react";
import { SidebarCategory } from './SidebarRail';
import {
    ShoppingCart,
    Monitor,
    FileText,
    CircleDollarSign,
    Tag,
    Warehouse,
    Boxes,
    Users,
    ShieldCheck,
    Zap,
    Palette,
    StickyNote,
    TrendingUp,
    History,
} from "lucide-react";

interface SidebarPanelProps {
    activeCategory: SidebarCategory;
    onCloseMobile?: () => void;
}

export const SidebarPanel: React.FC<SidebarPanelProps> = ({ activeCategory, onCloseMobile }) => {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    const categoryData: Record<SidebarCategory, { title: string; sections: any[] }> = {
        overview: {
            title: 'Dashboards',
            sections: [
                {
                    label: 'Dashboards',
                    items: [
                        { name: 'eCommerce', path: '/', icon: TrendingUp },
                        { name: 'Analytics', path: '/activity', icon: History, disabled: true },
                    ]
                }
            ]
        },
        commerce: {
            title: 'Comercio',
            sections: [
                {
                    label: 'OPERACIONES',
                    items: [
                        { name: 'Ventas', path: '/sales', icon: ShoppingCart },
                        { name: 'Punto de Venta', path: '/pos', icon: Monitor, badge: 'New' },
                        { name: 'Órdenes Compra', path: '/purchase-orders', icon: FileText },
                    ]
                },
                {
                    label: 'ENTIDADES',
                    items: [
                        { name: 'Clientes/Prov', path: '/companies', icon: Users },
                        { name: 'Facturación', path: '/invoices', icon: CircleDollarSign },
                    ]
                }
            ]
        },
        inventory: {
            title: 'Inventario',
            sections: [
                {
                    label: 'CATÁLOGO',
                    items: [
                        { name: 'Productos', path: '/inventory', icon: Boxes },
                        { name: 'Categorías', path: '/categories', icon: Tag },
                    ]
                },
                {
                    label: 'ALMACÉN',
                    items: [
                        { name: 'Bodegas', path: '/warehouses', icon: Warehouse },
                    ]
                }
            ]
        },
        logistics: {
            title: 'Logística',
            sections: [
                {
                    label: 'DISTRIBUCIÓN',
                    items: [
                        { name: 'Guías Despacho', path: '/logistics/dispatches', icon: StickyNote },
                        { name: 'Couriers', path: '/logistics/couriers', icon: Zap },
                    ]
                }
            ]
        },
        admin: {
            title: 'Administración',
            sections: [
                {
                    label: 'SEGURIDAD',
                    items: [
                        { name: 'Usuarios', path: '/users', icon: Users },
                        { name: 'Roles / Permisos', path: '/roles', icon: ShieldCheck },
                    ]
                },
                {
                    label: 'SISTEMA',
                    items: [
                        { name: 'Integraciones', path: '/integrations', icon: Zap },
                        { name: 'Branding UI', path: '/branding', icon: Palette },
                        { name: 'Suscripciones', path: '/subscriptions', icon: FileText },
                    ]
                }
            ]
        }
    };

    const current = categoryData[activeCategory];

    return (
        <div className="flex-1 flex flex-col bg-[#1a2537] overflow-hidden w-[240px]">
            {/* Header Section - Branding Text restored per user request */}
            <div className="px-5 h-[64px] flex items-center border-b border-[#ffffff08]">
                <div className="flex items-center gap-2">
                    <Typography color="white" className="font-extrabold tracking-tight text-white leading-none text-[20px] bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-gray-400">
                        ARTIFACT
                    </Typography>
                    <Typography className="text-[12px] font-black text-[#00a1ff] tracking-[0.25em] mt-1 uppercase drop-shadow-[0_0_8px_rgba(0,161,255,0.4)]">
                        ERP
                    </Typography>
                </div>
            </div>

            {/* Navigation List - 1:1 MaterialM */}
            <div className="flex-1 overflow-y-auto px-4 pt-2 pb-6 scrollbar-hide">
                {current.sections.map((section, sIdx) => (
                    <div key={section.label} className={sIdx > 0 ? "mt-4 relative" : "mt-0"}>
                        {sIdx > 0 && (
                            <div className="mx-auto w-[208px] my-4 border-t border-dashed border-[#ffffff14]" />
                        )}
                        <Typography className="px-4 mb-2 text-[12px] font-bold text-[#7b8893] uppercase tracking-[0.2em]">
                            {section.label}
                        </Typography>
                        <List className="p-0 gap-[2px]">
                            {section.items.map((item) => {
                                const active = isActive(item.path);
                                const disabled = item.disabled;

                                return (
                                    <Link
                                        key={item.path}
                                        href={disabled ? '#' : item.path}
                                        onClick={disabled ? undefined : onCloseMobile}
                                        className={disabled ? 'cursor-not-allowed opacity-40' : ''}
                                    >
                                        <ListItem
                                            ripple={!disabled}
                                            className={`group py-[12px] px-[16px] rounded-[2500px] w-[208px] mx-auto transition-all duration-300 flex items-center gap-3 ${active
                                                ? "bg-[rgba(0,161,255,0.12)] text-[#00a1ff]"
                                                : "text-[#7b8893] hover:bg-[rgba(0,161,255,0.12)] hover:text-[#00a1ff]"
                                                }`}
                                        >
                                            <ListItemPrefix className="m-0">
                                                <item.icon className={`h-[20px] w-[20px] transition-colors ${active ? "text-[#00a1ff]" : "text-[#7b8893] group-hover:text-[#00a1ff]"}`} strokeWidth={active ? 2 : 1.5} />
                                            </ListItemPrefix>
                                            <span className={`text-[15px] font-normal leading-normal transition-all duration-300 ${active ? "text-[#00a1ff]" : "group-hover:text-[#00a1ff]"}`}>
                                                {item.name}
                                            </span>
                                            {item.badge && (
                                                <ListItemSuffix {...({} as any)}>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00a1ff] text-white">
                                                        {item.badge}
                                                    </span>
                                                </ListItemSuffix>
                                            )}
                                        </ListItem>
                                    </Link>
                                );
                            })}
                        </List>
                    </div>
                ))}
            </div>
        </div>
    );
};
