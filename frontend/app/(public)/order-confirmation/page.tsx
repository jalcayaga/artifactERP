// frontend/app/(public)/order-confirmation/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon } from '@/components/Icons';

const OrderConfirmationPage: React.FC = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [displayOrderId, setDisplayOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      setDisplayOrderId(orderId);
    }
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] bg-background text-foreground px-4 py-8">
      <CheckCircleIcon className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold text-center mb-4">¡Pedido Realizado con Éxito!</h1>
      <p className="text-lg text-center mb-8">
        Gracias por tu compra. Tu pedido ha sido procesado y está en camino.
      </p>
      {displayOrderId && (
        <p className="text-md text-center mb-8">
          Número de Pedido: <span className="font-semibold text-primary">{displayOrderId}</span>
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/products" className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-center">
          Seguir Comprando
        </Link>
        {displayOrderId && (
          <Link href={`/admin/sales/${displayOrderId}`} className="px-6 py-3 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-center">
            Ver Detalles del Pedido
          </Link>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
