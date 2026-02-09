'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SaleService } from '@artifact/core/client';
import { Sale, OrderStatus, formatCurrencyChilean } from '@artifact/core';
import { Package, Clock, CheckCircle, XCircle, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@artifact/ui';
import Link from 'next/link';

export default function MyOrdersPage() {
    const { user, isAuthenticated, token } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Basic protection
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                // Assuming getAllSales filters by user context on the backend or we can filter client-side if needed (less secure but MVP)
                // ideally backend handles "get MY sales".
                const response = await SaleService.getAllSales(1, 100);
                // Filter by user ID if backend returns mixed results (safety net)
                const myOrders = response.data.filter(order => order.userId === user?.id);
                // If backend already filters, this is redundant but harmless.

                setOrders(myOrders);
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

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING_PAYMENT:
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case OrderStatus.PROCESSING:
                return <Package className="w-5 h-5 text-blue-500" />;
            case OrderStatus.SHIPPED:
                return <Truck className="w-5 h-5 text-purple-500" />;
            case OrderStatus.DELIVERED:
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case OrderStatus.CANCELLED:
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        const statusLabels: Record<string, string> = {
            [OrderStatus.PENDING_PAYMENT]: 'Pendiente de Pago',

            [OrderStatus.PROCESSING]: 'En Proceso',
            [OrderStatus.CANCELLED]: 'Cancelado',
        };
        return statusLabels[status] || status;
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Mis Compras</h1>
                    <p className="text-neutral-400">Historial de tus pedidos y estado actual.</p>
                </header>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {!isLoading && orders.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <ShoppingBag className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">Aún no tienes pedidos</h2>
                        <p className="text-neutral-400 mb-6">Explora nuestro catálogo y encuentra lo que necesitas.</p>
                        <Link href="/products">
                            <Button>Ir a la Tienda</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-brand/30 transition-colors">
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg font-mono font-medium text-white">#{order.id.slice(0, 8)}</span>
                                                <span className="flex items-center gap-1 text-sm px-2 py-0.5 rounded-full bg-white/10 border border-white/5">
                                                    {getStatusIcon(order.status)}
                                                    <span className="text-neutral-300 ml-1">{getStatusLabel(order.status)}</span>
                                                </span>
                                            </div>
                                            <p className="text-sm text-neutral-500">
                                                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <span className="block text-sm text-neutral-400">Total</span>
                                            <span className="block text-xl font-bold text-brand">{formatCurrencyChilean(order.grandTotalAmount)}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-4">
                                        <h4 className="text-sm font-semibold text-neutral-300 mb-3">Artículos</h4>
                                        <ul className="space-y-2">
                                            {order.orderItems?.map((item, idx) => (
                                                <li key={idx} className="flex justify-between text-sm">
                                                    <span className="text-neutral-400">
                                                        <span className="text-white font-medium">{item.quantity}x</span> {item.product?.name || 'Producto'}
                                                    </span>
                                                    <span className="text-neutral-300">{formatCurrencyChilean(item.totalPrice)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
