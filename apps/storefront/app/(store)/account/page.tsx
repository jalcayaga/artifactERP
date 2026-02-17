'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@artifact/core/client';
import { SaleService } from '@artifact/core/client';
import { Sale, formatCurrencyChilean } from '@artifact/core';
import {
    User,
    ShoppingBag,
    Briefcase,
    Settings,
    LogOut,
    ChevronRight,
    LayoutDashboard,
    Package,
    DollarSign,
    Clock,
    TrendingUp
} from 'lucide-react';
import { ClientIcon } from '@/components/client-icon';
import { Button } from '@artifact/ui';
import Link from 'next/link';

export default function AccountPage() {
    const { user, session, logout, isLoading } = useSupabaseAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [recentOrders, setRecentOrders] = useState<Sale[]>([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
    });

    useEffect(() => {
        setMounted(true);
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const response = await SaleService.getAllSales(1, 100);
                    const myOrders = response.data.filter(order => order.userId === user.id);

                    setRecentOrders(myOrders.slice(0, 3));
                    setStats({
                        totalOrders: myOrders.length,
                        totalSpent: myOrders.reduce((sum, order) => sum + order.grandTotalAmount, 0),
                        pendingOrders: myOrders.filter(o => o.status === 'PENDING_PAYMENT' || o.status === 'PROCESSING').length,
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        if (mounted && user) {
            fetchUserData();
        }
    }, [mounted, user]);

    if (!mounted || isLoading || !user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
        );
    }

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'text-green-400';
            case 'SHIPPED':
                return 'text-purple-400';
            case 'PROCESSING':
                return 'text-blue-400';
            case 'PENDING_PAYMENT':
                return 'text-yellow-400';
            default:
                return 'text-neutral-400';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="max-w-6xl mx-auto">

                    {/* Welcome Section */}
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                Hola, <span className="text-brand">{user?.user_metadata?.firstName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'}</span>
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
                            <ClientIcon icon={LogOut} className="w-4 h-4 mr-2" />
                            Cerrar Sesión
                        </Button>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand/30 hover:shadow-[0_0_20px_rgba(0,224,116,0.1)] transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                                    <ClientIcon icon={ShoppingBag} className="w-5 h-5 text-brand" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                                    <p className="text-xs text-neutral-400">Compras</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <ClientIcon icon={DollarSign} className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">${(stats.totalSpent / 1000).toFixed(0)}k</p>
                                    <p className="text-xs text-neutral-400">Total Gastado</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <ClientIcon icon={Clock} className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{stats.pendingOrders}</p>
                                    <p className="text-xs text-neutral-400">Pendientes</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                    <ClientIcon icon={TrendingUp} className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        {stats.totalOrders > 0 ? Math.round(stats.totalSpent / stats.totalOrders / 1000) : 0}k
                                    </p>
                                    <p className="text-xs text-neutral-400">Promedio</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                        {/* Card: Mis Compras */}
                        <Link href="/orders" className="group">
                            <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand/30 hover:shadow-[0_0_30px_rgba(0,224,116,0.15)] transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <ClientIcon icon={ShoppingBag} className="w-24 h-24" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
                                        <ClientIcon icon={ShoppingBag} className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Mis Compras</h3>
                                    <p className="text-neutral-400 text-sm mb-6">
                                        Revisa el historial de tus pedidos, estados de envío y descarga tus boletas.
                                    </p>
                                    <span className="inline-flex items-center text-sm font-medium text-blue-400 group-hover:translate-x-1 transition-transform">
                                        Ver historial <ClientIcon icon={ChevronRight} className="w-4 h-4 ml-1" />
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Card: Perfil */}
                        <Link href="/account/profile" className="group">
                            <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <ClientIcon icon={User} className="w-24 h-24" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                                        <ClientIcon icon={Settings} className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Mi Perfil</h3>
                                    <p className="text-neutral-400 text-sm mb-6">
                                        Gestiona tus datos personales, direcciones de envío y métodos de pago.
                                    </p>
                                    <span className="inline-flex items-center text-sm font-medium text-purple-400 group-hover:translate-x-1 transition-transform">
                                        Editar perfil <ClientIcon icon={ChevronRight} className="w-4 h-4 ml-1" />
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Card: ERP Access - Only show if user has ERP access */}
                        {user?.user_metadata?.hasErpAccess && (
                            <a
                                href={`${process.env.NEXT_PUBLIC_ADMIN_URL}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group md:col-span-2 lg:col-span-1"
                            >
                                <div className="h-full bg-gradient-to-br from-brand/10 to-blue-600/10 border border-brand/30 rounded-2xl p-6 hover:border-brand/50 hover:from-brand/20 hover:to-blue-600/20 hover:shadow-[0_0_30px_rgba(0,224,116,0.2)] transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-brand/5 group-hover:bg-brand/10 transition-colors" />
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-brand">
                                        <ClientIcon icon={Briefcase} className="w-24 h-24" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center mb-4 text-brand group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,224,116,0.3)] transition-all">
                                            <ClientIcon icon={LayoutDashboard} className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Artifact ERP</h3>
                                        <p className="text-neutral-300 text-sm mb-6">
                                            Accede al panel de control de tu empresa. Gestión de inventario, ventas B2B y facturación.
                                        </p>
                                        <Button className="w-full bg-brand hover:bg-brand/90 text-black font-semibold group-hover:shadow-[0_0_20px_rgba(0,224,116,0.3)] transition-all">
                                            Entrar al Panel
                                            <ClientIcon icon={ChevronRight} className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </a>
                        )}

                    </div>

                    {/* Recent Orders */}
                    {recentOrders.length > 0 && (
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    Pedidos <span className="text-brand">Recientes</span>
                                </h2>
                                <Link href="/orders" className="text-sm text-brand hover:underline">
                                    Ver todos
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href="/orders"
                                        className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-white/5 hover:border-brand/20 hover:bg-black/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                                                <ClientIcon icon={Package} className="w-5 h-5 text-brand" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">
                                                    Orden #{order.id.slice(0, 8)}
                                                </p>
                                                <p className="text-xs text-neutral-400">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </p>
                                                <p className="text-white font-bold">
                                                    {formatCurrencyChilean(order.grandTotalAmount)}
                                                </p>
                                            </div>
                                            <ClientIcon icon={ChevronRight} className="w-5 h-5 text-neutral-400 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
