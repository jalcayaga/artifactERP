'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@artifact/core/client';
import {
    User,
    ShoppingBag,
    Briefcase,
    Settings,
    LogOut,
    ChevronRight,
    LayoutDashboard
} from 'lucide-react';
import { Button } from '@artifact/ui';
import Link from 'next/link';

export default function AccountPage() {
    const { user, session, logout, isLoading } = useSupabaseAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (!mounted || isLoading || !user) {
        return null; // Or a loading spinner
    }

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className="container mx-auto px-4 py-8 lg:py-16">
            <div className="max-w-5xl mx-auto">

                {/* Welcome Section */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Hola, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario'}
                        </h1>
                        <p className="text-neutral-400">
                            Bienvenido a tu portal personal. Gestiona tus compras y tu negocio desde aquí.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Card: Mis Compras */}
                    <Link href="/orders" className="group">
                        <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand/40 hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShoppingBag className="w-24 h-24" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Mis Compras</h3>
                                <p className="text-neutral-400 text-sm mb-6">
                                    Revisa el historial de tus pedidos, estados de envío y descarga tus boletas.
                                </p>
                                <span className="inline-flex items-center text-sm font-medium text-blue-400 group-hover:translate-x-1 transition-transform">
                                    Ver historial <ChevronRight className="w-4 h-4 ml-1" />
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Card: Perfil (Placeholder for now) */}
                    <div className="group cursor-not-allowed opacity-60">
                        <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <User className="w-24 h-24" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                                    <Settings className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Mi Perfil</h3>
                                <p className="text-neutral-400 text-sm mb-6">
                                    Gestiona tus datos personales, direcciones de envío y métodos de pago.
                                </p>
                                <span className="inline-flex items-center text-sm font-medium text-neutral-500">
                                    Próximamente
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card: ERP Access */}
                    <a
                        href={`${process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"}/auth-receive#token=${session?.access_token || ''}`}
                        className="group md:col-span-2 lg:col-span-1"
                    >
                        <div className="h-full bg-gradient-to-br from-brand/10 to-blue-600/10 border border-brand/20 rounded-2xl p-6 hover:border-brand/50 hover:from-brand/20 hover:to-blue-600/20 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-brand/5 group-hover:bg-brand/10 transition-colors" />
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-brand">
                                <Briefcase className="w-24 h-24" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center mb-4 text-brand group-hover:scale-110 transition-transform">
                                    <LayoutDashboard className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Artifact ERP</h3>
                                <p className="text-neutral-300 text-sm mb-6">
                                    Accede al panel de control de tu empresa. Gestión de inventario, ventas B2B y facturación.
                                </p>
                                <Button className="w-full bg-brand hover:bg-brand/90 text-black font-semibold group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                                    Entrar al Panel
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </a>

                </div>

                {/* Recent Activity Mini-Section (Optional polish) */}
                <div className="mt-12 pt-8 border-t border-white/5">
                    <h2 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h2>
                    <p className="text-sm text-neutral-500 italic">No hay actividad reciente para mostrar.</p>
                </div>

            </div>
        </div>
    );
}
