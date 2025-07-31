// frontend/app/(public)/orders/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OrderService } from '@/lib/services/orderService';
import { formatCurrencyChilean } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { OrderResponse } from '@/lib/services/orderService';

const UserOrdersPage: React.FC = () => {
  const { currentUser, token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false);
        setError('Debes iniciar sesión para ver tus pedidos.');
        return;
      }

      try {
        setLoading(true);
        const response = await OrderService.getUserOrders(token);
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('No se pudieron cargar tus pedidos. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, token]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Por favor, <Link href="/login" className="text-primary hover:underline">inicia sesión</Link> para ver tus pedidos.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-center mb-8 md:mb-12">Mis Pedidos</h1>
      {
        orders.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">No tienes pedidos realizados aún.</p>
            <Link href="/products">
              <Button>Explorar Productos</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Pedido #{order.id.substring(0, 8)}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Fecha:</p>
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total:</p>
                      <p className="font-semibold">{formatCurrencyChilean(order.grandTotalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Estado de Pago:</p>
                      <p>{order.paymentStatus}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Items:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {order.orderItems.map(item => (
                        <li key={item.id} className="text-sm">
                          {item.productNameSnapshot} (x{item.quantity}) - {formatCurrencyChilean(item.unitPriceSnapshot)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 text-right">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline">Ver Detalles</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      }
    </div>
  );
};

export default UserOrdersPage;
