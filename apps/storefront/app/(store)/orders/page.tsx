'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SaleService } from '@artifact/core/client';
import { Sale, OrderStatus, formatCurrencyChilean } from '@artifact/core';
import { Package, Clock, CheckCircle, XCircle, Truck, AlertCircle, ShoppingBag, Search, Download, Eye, Filter } from 'lucide-react';
import { ClientIcon } from '@/components/client-icon';
import { Button } from '@artifact/ui';
import Link from 'next/link';

export default function MyOrdersPage() {
    const { user, isAuthenticated, token } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Sale[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await SaleService.getAllSales(1, 100);
                const myOrders = response.data.filter(order => order.userId === user?.id);
                setOrders(myOrders);
                setFilteredOrders(myOrders);
            } catch (err: any) {
                console.error('Error fetching orders:', err);
                setError('No pudimos cargar tus pedidos. Por favor intenta más tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        if (user && token) {
            fetchOrders();
        }
    }, [isAuthenticated, router, user, token]);

    // Filter orders based on search and status
    useEffect(() => {
        let filtered = orders;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.orderItems?.some(item =>
                    item.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        setFilteredOrders(filtered);
    }, [searchQuery, statusFilter, orders]);

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING_PAYMENT:
                return <ClientIcon icon={Clock} className="w-5 h-5 text-yellow-500" />;
            case OrderStatus.PROCESSING:
                return <ClientIcon icon={Package} className="w-5 h-5 text-blue-500" />;
            case OrderStatus.SHIPPED:
                return <ClientIcon icon={Truck} className="w-5 h-5 text-purple-500" />;
            case OrderStatus.DELIVERED:
                return <ClientIcon icon={CheckCircle} className="w-5 h-5 text-green-500" />;
            case OrderStatus.CANCELLED:
                return <ClientIcon icon={XCircle} className="w-5 h-5 text-red-500" />;
            default:
                return <ClientIcon icon={AlertCircle} className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        const statusLabels: Record<string, string> = {
            [OrderStatus.PENDING_PAYMENT]: 'Pendiente de Pago',
            [OrderStatus.PROCESSING]: 'En Proceso',
            [OrderStatus.SHIPPED]: 'Enviado',
            [OrderStatus.DELIVERED]: 'Entregado',
            [OrderStatus.CANCELLED]: 'Cancelado',
        };
        return statusLabels[status] || status;
    };

    const getStatusBadgeColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING_PAYMENT:
                return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
            case OrderStatus.PROCESSING:
                return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            case OrderStatus.SHIPPED:
                return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
            case OrderStatus.DELIVERED:
                return 'bg-green-500/10 border-green-500/20 text-green-400';
            case OrderStatus.CANCELLED:
                return 'bg-red-500/10 border-red-500/20 text-red-400';
            default:
                return 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            Mis <span className="text-brand">Compras</span>
                        </h1>
                        <p className="text-neutral-400">Historial de tus pedidos y estado actual.</p>
                    </header>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    {/* Filters & Search */}
                    {orders.length > 0 && (
                        <div className="mb-6 flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <ClientIcon icon={Search} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por número de orden o producto..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-neutral-900/60 border border-white/10 text-white placeholder:text-neutral-500 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <ClientIcon icon={Filter} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-10 pr-8 py-3 rounded-lg bg-neutral-900/60 border border-white/10 text-white focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 appearance-none cursor-pointer transition-all"
                                >
                                    <option value="all">Todos los estados</option>
                                    <option value={OrderStatus.PENDING_PAYMENT}>Pendiente de Pago</option>
                                    <option value={OrderStatus.PROCESSING}>En Proceso</option>
                                    <option value={OrderStatus.SHIPPED}>Enviado</option>
                                    <option value={OrderStatus.DELIVERED}>Entregado</option>
                                    <option value={OrderStatus.CANCELLED}>Cancelado</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    {orders.length > 0 && (
                        <p className="text-sm text-neutral-400 mb-4">
                            Mostrando {filteredOrders.length} de {orders.length} pedidos
                        </p>
                    )}

                    {/* Empty State */}
                    {!isLoading && orders.length === 0 ? (
                        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                            <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
                                <ClientIcon icon={ShoppingBag} className="w-10 h-10 text-brand" />
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">Aún no tienes pedidos</h2>
                            <p className="text-neutral-400 mb-6">Explora nuestro catálogo y encuentra lo que necesitas.</p>
                            <Link href="/products">
                                <Button className="bg-brand text-black hover:shadow-[0_0_20px_rgba(0,224,116,0.3)] transition-all">
                                    Ir a la Tienda
                                </Button>
                            </Link>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                            <ClientIcon icon={Search} className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-white mb-2">No se encontraron pedidos</h2>
                            <p className="text-neutral-400 mb-6">Intenta con otros términos de búsqueda o filtros.</p>
                            <Button
                                variant="outline"
                                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                                className="border-white/10 hover:border-brand/30"
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-brand/30 hover:shadow-[0_0_20px_rgba(0,224,116,0.1)] transition-all"
                                >
                                    {/* Header */}
                                    <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-mono font-bold text-white">
                                                        #{order.id.slice(0, 8)}
                                                    </h3>
                                                    <span className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border ${getStatusBadgeColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        <span className="font-medium">{getStatusLabel(order.status)}</span>
                                                    </span>
                                                </div>
                                                <p className="text-sm text-neutral-400">
                                                    {new Date(order.createdAt).toLocaleDateString('es-CL', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="text-sm text-neutral-400 mb-1">Total</p>
                                                <p className="text-2xl font-bold text-brand">
                                                    {formatCurrencyChilean(order.grandTotalAmount)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="p-6">
                                        <h4 className="text-sm font-semibold text-neutral-300 mb-3">Artículos</h4>
                                        <div className="space-y-2">
                                            {order.orderItems?.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-white/5">
                                                    <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden flex-shrink-0">
                                                        {item.product?.thumbnail ? (
                                                            <img
                                                                src={item.product.thumbnail}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ClientIcon icon={Package} className="w-6 h-6 text-neutral-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white font-medium truncate">
                                                            {item.product?.name || 'Producto'}
                                                        </p>
                                                        <p className="text-xs text-neutral-400">
                                                            Cantidad: <span className="text-white font-medium">{item.quantity}</span>
                                                        </p>
                                                    </div>
                                                    <p className="text-white font-semibold">
                                                        {formatCurrencyChilean(item.totalPrice)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-6 border-t border-white/10 bg-black/20 flex flex-col sm:flex-row gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all"
                                        >
                                            <ClientIcon icon={Eye} className="w-4 h-4 mr-2" />
                                            Ver Detalles
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-white/10 hover:border-brand/30 hover:bg-brand/5 transition-all"
                                        >
                                            <ClientIcon icon={Download} className="w-4 h-4 mr-2" />
                                            Descargar Boleta
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
