'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Typography, List, ListItem, ListItemPrefix, ListItemSuffix, IconButton } from "@material-tailwind/react";
import { SidebarCategory } from './SidebarRail';
import { TenantService } from '@/lib/services/tenant.service';
import { defaultTheme } from '@/lib/theme';
import Image from 'next/image';
import {
    ShoppingCart,
    Monitor,
    FileText,
    CircleDollarSign,
    Tag,
    Warehouse,
    Boxes,
    Users,
    Settings,
    ShieldCheck,
    Zap,
    Palette,
    StickyNote,
    TrendingUp,
    History,
    Receipt,
    Camera,
    MessageSquare,
    CreditCard,
} from "lucide-react";

interface SidebarPanelProps {
    activeCategory: SidebarCategory;
    onCloseMobile?: () => void;
    sidebarCollapsed?: boolean;
    setSidebarCollapsed?: (collapsed: boolean) => void;
}

export const SidebarPanel: React.FC<SidebarPanelProps> = ({
    activeCategory,
    onCloseMobile,
    sidebarCollapsed,
    setSidebarCollapsed
}) => {
    const [logoUrl, setLogoUrl] = React.useState(defaultTheme.logoUrl);

    React.useEffect(() => {
        const fetchBrand = async () => {
            try {
                const config = await TenantService.getConfig();
                if (config.branding?.logoUrl) {
                    setLogoUrl(config.branding.logoUrl);
                }
            } catch (error) {
                console.error("Error fetching panel logo:", error);
            }
        };
        fetchBrand();
    }, []);

    const pathname = usePathname();
    const [theme, setThemeState] = React.useState('dark'); // Minor hook usage if needed
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
                        { name: 'Boletas', path: '/boletas', icon: StickyNote },
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
                        { name: 'Guías Despacho', path: '/dispatches', icon: StickyNote },
                        { name: 'Couriers', path: '/logistics/couriers', icon: Zap },
                    ]
                }
            ]
        },
        integrations: {
            title: 'Integraciones',
            sections: [
                {
                    label: 'MARKETPLACES',
                    items: [
                        { name: 'Mercado Libre', path: '/integrations/meli', icon: ShoppingCart },
                        { name: 'Uber Eats', path: '/integrations/uber', icon: ShoppingCart, badge: 'Próximamente', disabled: true },
                        { name: 'PedidosYa', path: '/integrations/pedidosya', icon: ShoppingCart, badge: 'Próximamente', disabled: true },
                    ]
                },
                {
                    label: 'OMNICANALIDAD',
                    items: [
                        { name: 'Inbox Central', path: '/social', icon: MessageSquare, badge: 'Enterprise' },
                        { name: 'Configuración', path: '/social/settings', icon: Settings, disabled: true },
                    ]
                }
            ]
        },
        social: {
            title: 'Social Inbox',
            sections: [
                {
                    label: 'MENSAJERÍA',
                    items: [
                        { name: 'Inbox Central', path: '/social', icon: MessageSquare, badge: 'Active' },
                        { name: 'Plantillas', path: '/social/templates', icon: StickyNote, disabled: true },
                    ]
                },
                {
                    label: 'VENTAS',
                    items: [
                        { name: 'Links de Pago', path: '/social/payments', icon: CreditCard, disabled: true },
                        { name: 'Funnels', path: '/social/funnels', icon: TrendingUp, disabled: true },
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
                        { name: 'Ajustes App', path: '/settings', icon: Settings },
                        { name: 'Branding UI', path: '/branding', icon: Palette },
                        { name: 'Suscripciones', path: '/subscriptions', icon: FileText },
                    ]
                }
            ]
        }
    };

    const current = categoryData[activeCategory];

    return (
        <div className="flex-1 flex flex-col bg-slate-900 border-r border-white/5 overflow-hidden w-[240px]">
            {/* Header Section - Branding Text restored with Toggle control */}
            <div className="px-5 h-[64px] flex items-center border-b border-[#ffffff08] justify-between">
                <div className="flex items-center gap-2">
                    <Typography color="white" className="font-black tracking-tighter text-white leading-none text-[22px]">
                        ARTIFACT
                    </Typography>
                    <Typography className="text-[10px] font-black text-emerald-500 tracking-[0.3em] ml-0.5 opacity-90">
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
                                            className={`group py-2.5 px-4 rounded-xl w-[200px] mx-auto transition-all duration-300 flex items-center gap-3 ${active
                                                ? "bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                                : "text-slate-400 hover:bg-emerald-500/5 hover:text-emerald-500"
                                                }`}
                                        >
                                            <ListItemPrefix className="m-0">
                                                <item.icon className={`h-5 w-5 transition-colors ${active ? "text-emerald-500" : "text-slate-400 group-hover:text-emerald-500"}`} strokeWidth={active ? 2.5 : 1.5} />
                                            </ListItemPrefix>
                                            <span className={`text-sm font-medium tracking-tight transition-all duration-300 ${active ? "text-emerald-500" : "group-hover:text-emerald-500"}`}>
                                                {item.name}
                                            </span>
                                            {item.badge && (
                                                <ListItemSuffix {...({} as any)}>
                                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-500 border border-emerald-500/20">
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
