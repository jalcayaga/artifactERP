'use client';

import React, { useState, useEffect } from 'react';
import {
    Squares2X2Icon,
    BuildingOfficeIcon,
    ShoppingCartIcon,
    ClipboardDocumentCheckIcon,
    UserGroupIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    WalletIcon,
    NewspaperIcon
} from '@heroicons/react/24/outline';
import {
    Card,
    Typography,
    Avatar,
    Button,
    IconButton,
    Chip
} from '@material-tailwind/react';
import Link from 'next/link';

interface AppIconProps {
    icon: React.ElementType;
    label: string;
    href: string;
    color: string;
    description?: string;
    status?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ icon: Icon, label, href, color, description, status }) => (
    <Link href={href} className="group">
        <Card
            {...({} as any)}
            className={`h-full border border-white/10 bg-slate-900/40 backdrop-blur-md p-6 rounded-[2rem] hover:bg-white/10 transition-all duration-300 active:scale-95 flex flex-col items-center justify-center text-center gap-4 group-hover:shadow-[0_0_30px_rgba(var(--brand-color),0.2)]`}
            style={{ '--brand-color': color === 'emerald' ? '16,185,129' : '14,165,233' } as any}
        >
            <div className={`p-5 rounded-3xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-10 w-10 md:h-14 md:w-14 stroke-[1.5]" />
            </div>
            <div>
                <Typography {...({} as any)} variant="h5" color="white" className="font-bold text-lg md:text-xl">
                    {label}
                </Typography>
                {description && (
                    <Typography {...({} as any)} variant="small" className="text-blue-gray-400 mt-1 font-medium hidden md:block">
                        {description}
                    </Typography>
                )}
            </div>
            {status && (
                <Chip
                    value={status}
                    size="sm"
                    variant="ghost"
                    color={color === 'emerald' ? 'green' : 'blue'}
                    className="rounded-full !px-3"
                />
            )}
        </Card>
    </Link>
);

export const PortalView: React.FC = () => {
    // Mock companies for the selector - In a real app, this comes from an API/Context
    const [companies, setCompanies] = useState([
        { id: '1', name: 'Panadería Pepe', role: 'Administrador', initial: 'P', color: 'bg-emerald-500' },
        { id: '2', name: 'Constructora Beta', role: 'Vendedor', initial: 'C', color: 'bg-sky-500' },
        { id: '3', name: 'Contabilidad Externa', role: 'Contador', initial: 'A', color: 'bg-purple-500' },
    ]);
    const [selectedCompany, setSelectedCompany] = useState(companies[0]);

    const apps = [
        { id: 'erp', icon: Squares2X2Icon, label: 'Mi ERP', href: '/dashboard', color: 'emerald', description: 'Inventario, Ventas y Gestión', status: 'Activo' },
        { id: 'shop', icon: ShoppingCartIcon, label: 'Mi Tienda', href: 'https://storefront.artifact.cl', color: 'sky', description: 'E-commerce y Pedidos Web' },
        { id: 'billing', icon: WalletIcon, label: 'Facturación', href: '/invoices', color: 'emerald', description: 'Boletas y Facturas SII' },
        { id: 'pos', icon: ClipboardDocumentCheckIcon, label: 'Punto de Venta', href: '/pos', color: 'emerald', description: 'Venta rápida en local' },
        { id: 'marketing', icon: NewspaperIcon, label: 'Marketing', href: '#', color: 'sky', description: 'RRSS y Campañas', status: 'Próximamente' },
        { id: 'settings', icon: Cog6ToothIcon, label: 'Mi Cuenta', href: '/settings', color: 'emerald', description: 'Ajustes y Suscripción' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-in fade-in zoom-in-95 duration-500">
            {/* Header with Company Selector */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-slate-900/60 p-6 md:p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-4 md:gap-6">
                    <Avatar
                        src={`https://ui-avatars.com/api/?name=${selectedCompany.name}&background=10b981&color=fff`}
                        alt="Avatar"
                        variant="circular"
                        size="xl"
                        className="border-2 border-emerald-500 p-0.5"
                    />
                    <div>
                        <Typography {...({} as any)} variant="h4" color="white" className="font-extrabold flex items-center gap-2">
                            {selectedCompany.name}
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </Typography>
                        <Typography {...({} as any)} variant="lead" className="text-blue-gray-400 font-medium text-base">
                            RUT: 76.XXX.XXX-X • {selectedCompany.role}
                        </Typography>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <Typography {...({} as any)} variant="small" className="text-blue-gray-500 font-bold hidden md:block uppercase tracking-widest">
                        Cambiar Empresa
                    </Typography>
                    <div className="flex -space-x-3 overflow-hidden p-2">
                        {companies.map((c) => (
                            <Tooltip
                                {...({} as any)}
                                key={c.id}
                                content={c.name}
                                className="bg-slate-900 border border-white/10"
                            >
                                <div
                                    onClick={() => setSelectedCompany(c)}
                                    className={`relative cursor-pointer hover:z-20 transition-all duration-300 hover:-translate-y-1 ${selectedCompany.id === c.id ? 'z-10 scale-110' : ''
                                        }`}
                                >
                                    <Avatar
                                        {...({} as any)}
                                        variant="circular"
                                        alt={c.name}
                                        className={`border-2 ${selectedCompany.id === c.id ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-slate-800'} h-12 w-12`}
                                        src={`https://ui-avatars.com/api/?name=${c.name}&background=${c.color === 'bg-emerald-500' ? '10b981' : '0ea5e9'}&color=fff`}
                                    />
                                    {selectedCompany.id === c.id && (
                                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-slate-900">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                        </div>
                                    )}
                                </div>
                            </Tooltip>
                        ))}
                        <IconButton
                            {...({} as any)}
                            variant="text"
                            className="rounded-full bg-white/5 h-12 w-12 border border-dashed border-white/20 text-white hover:bg-white/10"
                            onClick={() => toast.info('Añadir nueva empresa próximamente')}
                        >
                            <BuildingOfficeIcon className="h-6 w-6" />
                        </IconButton>
                    </div>
                    <Link href="/dashboard" className="mt-2">
                        <Button {...({} as any)} size="sm" variant="text" color="blue" className="flex items-center gap-2 lowercase font-normal opacity-70 hover:opacity-100">
                            <Squares2X2Icon className="h-4 w-4" />
                            Vista Clásica (Sidebar)
                        </Button>
                    </Link>
                </div>
            </div>

            {/* App Grid - iPhone Mode */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {apps.map((app) => (
                    <AppIcon key={app.id} {...app} />
                ))}
            </div>

            {/* Footer Support */}
            <div className="mt-16 text-center">
                <Button
                    {...({} as any)}
                    variant="text"
                    color="white"
                    className="flex items-center gap-2 mx-auto bg-white/5 rounded-full px-8 py-4 border border-white/10 hover:bg-white/10"
                >
                    <QuestionMarkCircleIcon className="h-6 w-6 text-emerald-500" />
                    ¿Necesitas ayuda con Artifact?
                </Button>
            </div>
        </div>
    );
};

// Helper for tooltips (Material Tailwind version)
const Tooltip = ({ children, content, className }: any) => (
    <div className="group relative flex items-center">
        {children}
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 transparent text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none ${className}`}>
            {content}
        </div>
    </div>
);
