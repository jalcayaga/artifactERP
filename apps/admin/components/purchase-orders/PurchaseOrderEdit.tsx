'use client';

import React, { useState } from 'react';
import { PurchaseOrderService, useAuth } from '@artifact/core/client';
import PurchaseOrderForm from './PurchaseOrderForm';
import { UpdatePurchaseOrderDto } from '@artifact/core';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Typography } from "@material-tailwind/react";
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

interface Props {
    id: string;
}

const PurchaseOrderEdit: React.FC<Props> = ({ id }) => {
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const orderQuery = useQuery({
        queryKey: ['purchase-order', id, token],
        enabled: Boolean(isAuthenticated && token && id),
        queryFn: async () => {
            if (!token) throw new Error('Sesión expirada');
            return await PurchaseOrderService.getPurchaseOrderById(id);
        }
    });

    const order = orderQuery.data;

    const handleSave = async (data: any) => {
        setIsProcessing(true);
        try {
            await PurchaseOrderService.updatePurchaseOrder(id, data as UpdatePurchaseOrderDto);
            toast.success('Orden de Compra actualizada existosamente.');
            router.push('/purchase-orders');
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || 'Error al actualizar la orden.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderQuery.isLoading) return <div className="text-white p-8">Cargando orden...</div>;
    if (orderQuery.isError) return <div className="text-red-500 p-8">Error al cargar la orden.</div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Link href="/purchase-orders" className="p-2 hover:bg-white/5 rounded-full transition-colors text-white">
                    <ChevronLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                    <Typography variant="h4" color="white">Editar Orden de Compra</Typography>
                    <Typography color="gray" className="font-normal text-sm">
                        Orden #{order?.id.substring(0, 8).toUpperCase()} - {order?.status}
                    </Typography>
                </div>
            </div>

            {order && (
                <PurchaseOrderForm
                    initialData={order}
                    onSave={handleSave}
                    isProcessing={isProcessing}
                />
            )}
        </div>
    );
};

export default PurchaseOrderEdit;
