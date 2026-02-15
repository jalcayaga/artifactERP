'use client';

import React, { useState } from 'react';
import { PurchaseOrderService } from '@artifact/core/client';
import PurchaseOrderForm from './PurchaseOrderForm';
import { CreatePurchaseOrderDto } from '@artifact/core';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Typography } from "@material-tailwind/react";
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const PurchaseOrderCreate: React.FC = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSave = async (data: any) => {
        setIsProcessing(true);
        try {
            await PurchaseOrderService.createPurchaseOrder(data as CreatePurchaseOrderDto);
            toast.success('Orden de Compra creada existosamente.');
            router.push('/purchase-orders');
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || 'Error al crear la orden.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Link href="/purchase-orders" className="p-2 hover:bg-white/5 rounded-full transition-colors text-white">
                    <ChevronLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                    <Typography variant="h4" color="white">Nueva Orden de Compra</Typography>
                    <Typography color="gray" className="font-normal text-sm">Crea una nueva solicitud de compra a proveedores.</Typography>
                </div>
            </div>
            <PurchaseOrderForm onSave={handleSave} isProcessing={isProcessing} />
        </div>
    );
};

export default PurchaseOrderCreate;
