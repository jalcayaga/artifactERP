// frontend/components/OrderManagementView.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OrderService } from '@/lib/services/orderService';
import { OrderResponse } from '@/lib/services/orderService';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrencyChilean } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const OrderManagementView: React.FC = () => {
  const { token, isAuthenticated, currentUser } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated || !token || currentUser?.role !== UserRole.ADMIN) {
      setError('No autorizado para ver esta página.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // Assuming a method to get all orders for admin exists or can be adapted
      // For now, using getUserOrders and assuming admin can see all or a specific endpoint will be added
      const response = await OrderService.getUserOrders(token); // This needs to be an admin endpoint for all orders
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error al cargar los pedidos.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, currentUser]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return <div className="text-center py-8">Cargando pedidos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }

  if (!isAuthenticated || currentUser?.role !== UserRole.ADMIN) {
    return <div className="text-center py-8 text-destructive">Acceso denegado. No tienes permisos de administrador.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-foreground">Gestión de Pedidos</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Estado Pago</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id.substring(0, 8)}</TableCell>
                  <TableCell>{order.user?.firstName} {order.user?.lastName}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{formatCurrencyChilean(order.grandTotalAmount)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.paymentStatus}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/sales/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagementView;
