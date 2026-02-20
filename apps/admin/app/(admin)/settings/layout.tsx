'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent } from '@artifact/ui'; // Assuming UI package
import {
    Cog6ToothIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    CreditCardIcon
} from "@heroicons/react/24/outline";

const settingsNav = [
    { name: 'General', href: '/settings', icon: Cog6ToothIcon },
    { name: 'Facturación Electrónica (DTE)', href: '/settings/dte', icon: DocumentTextIcon },
    { name: 'Seguridad', href: '/settings/security', icon: ShieldCheckIcon, disabled: true },
    { name: 'Suscripción', href: '/settings/billing', icon: CreditCardIcon, disabled: true },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Configuración</h1>
                <p className="text-slate-400">Administra las preferencias generales y módulos del sistema.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="lg:w-1/5">
                    <nav className="flex flex-col space-y-1">
                        {settingsNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.disabled ? '#' : item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                        ${isActive
                                            ? 'bg-blue-600/10 text-blue-500'
                                            : item.disabled
                                                ? 'text-slate-600 cursor-not-allowed'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-4xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
