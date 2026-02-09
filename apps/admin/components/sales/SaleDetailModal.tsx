'use client';

import React, { useEffect, useState } from 'react';
import { Sale, OrderItem, formatCurrencyChilean } from '@artifact/core';
import { InvoiceService } from '@artifact/core/client';;
import {
  XIcon,
  ShoppingCartIcon,
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@artifact/ui';
import { toast } from 'sonner';
import { Button } from '@artifact/ui';

interface SaleDetailModalProps {
  sale: Sale | null;
  onClose: () => void;
  onInvoiceCreated: () => void;
}

const SaleInfoItem: React.FC<{
  label: string;
  value?: string | React.ReactNode;
  icon?: React.FC<{ className?: string }>;
}> = ({ label, value, icon: Icon }) => {
  if (
    !value &&
    typeof value !== 'object' &&
    typeof value !== 'boolean' &&
    typeof value !== 'number'
  )
    return null;
  return (
    <div className='flex items-start py-1.5'>
      {Icon && (
        <Icon className='w-5 h-5 mr-2.5 mt-0.5 text-muted-foreground opacity-80 flex-shrink-0' />
      )}
      <div className='flex-grow'>
        <dt className='text-xs font-medium text-muted-foreground'>{label}</dt>
        <dd className='text-sm text-foreground'>
          {value || <span className='italic'>N/A</span>}
        </dd>
      </div>
    </div>
  );
};

const SaleDetailModal: React.FC<SaleDetailModalProps> = ({
  sale,
  onClose,
  onInvoiceCreated,
}) => {
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  useEffect(() => {
    if (!sale) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [sale, onClose]);

  if (!sale) {
    return null;
  }

  const handleCreateInvoice = async () => {
    if (!sale) return;
    setIsCreatingInvoice(true);
    try {
      await InvoiceService.createInvoiceFromOrder(sale.id);
      toast.success('Factura creada exitosamente');
      onInvoiceCreated();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la factura');
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const calculateItemTotalWithVat = (item: OrderItem) => {
    return item.totalPrice + item.itemVatAmount;
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 p-4 transition-opacity duration-300 ease-in-out'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-labelledby='sale-detail-modal-title'
    >
      <div
        className='bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between p-4 sm:p-5 border-b border-border'>
          <h2
            id='sale-detail-modal-title'
            className='text-lg sm:text-xl font-semibold text-foreground flex items-center'
          >
            <ShoppingCartIcon className='w-6 h-6 mr-2 text-primary' />
            Detalle de Venta (ID: {sale.id.substring(0, 8)}...)
          </h2>
          <button
            onClick={onClose}
            className='p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
            aria-label='Cerrar modal'
          >
            <XIcon className='w-5 h-5' />
          </button>
        </div>

        <div className='p-4 sm:p-5 space-y-4 overflow-y-auto'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-3'>
            <SaleInfoItem label='Empresa' value={sale.company?.name} />
            <SaleInfoItem
              label='Fecha de Venta'
              value={new Date(sale.createdAt).toLocaleDateString()}
              icon={CalendarIcon}
            />
            {sale.customerNotes && (
              <div className='md:col-span-2'>
                <SaleInfoItem
                  label='Observaciones'
                  value={sale.customerNotes}
                  icon={ChatBubbleLeftEllipsisIcon}
                />
              </div>
            )}
          </div>

          <h3 className='text-md font-semibold text-foreground mb-1.5'>
            Artículos
          </h3>
          <div className='overflow-x-auto border border-border rounded-md'>
            <table className='min-w-full divide-y divide-border'>
              <thead className='bg-muted/50'>
                <tr>
                  <th className='px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Producto / Servicio
                  </th>
                  <th className='px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Cant.
                  </th>
                  <th className='px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell'>
                    P.Unit (s/IVA)
                  </th>
                  <th className='px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Subtotal (s/IVA)
                  </th>
                  <th className='px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell'>
                    IVA ({sale.vatRatePercent}%)
                  </th>
                  <th className='px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Total Item
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {sale.orderItems?.map((item) => (
                  <tr key={item.id}>
                    <td className='px-3 py-2.5 whitespace-nowrap text-sm text-foreground'>
                      {item.product?.name}
                    </td>
                    <td className='px-3 py-2.5 whitespace-nowrap text-sm text-muted-foreground text-right'>
                      {item.quantity}
                    </td>
                    <td className='px-3 py-2.5 whitespace-nowrap text-sm text-muted-foreground text-right hidden sm:table-cell'>
                      {formatCurrencyChilean(item.unitPrice)}
                    </td>
                    <td className='px-3 py-2.5 whitespace-nowrap text-sm text-foreground text-right'>
                      {formatCurrencyChilean(item.totalPrice)}
                    </td>
                    <td className='px-3 py-2.5 whitespace-nowrap text-sm text-muted-foreground text-right hidden md:table-cell'>
                      {formatCurrencyChilean(item.itemVatAmount)}
                    </td>
                    <td className='px-3 py-2.5 whitespace-nowrap text-sm font-medium text-foreground text-right'>
                      {formatCurrencyChilean(calculateItemTotalWithVat(item))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-4 pt-3 border-t border-border space-y-1.5'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>
                Subtotal (sin IVA):
              </span>
              <span className='text-sm font-semibold text-foreground'>
                {formatCurrencyChilean(sale.subTotalAmount)}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>
                Total IVA ({sale.vatRatePercent}%):
              </span>
              <span className='text-sm font-semibold text-foreground'>
                {formatCurrencyChilean(sale.vatAmount)}
              </span>
            </div>
            <div className='flex justify-between items-center pt-1.5 border-t border-border/50'>
              <span className='text-md font-bold text-foreground'>
                Gran Total:
              </span>
              <span className='text-lg font-bold text-primary'>
                {formatCurrencyChilean(sale.grandTotalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className='px-4 py-3 sm:p-4 bg-muted/50 border-t border-border flex justify-end space-x-2'>
          <Button type='button' onClick={onClose} variant='outline'>
            Cerrar
          </Button>
          <Button
            type='button'
            onClick={handleCreateInvoice}
            disabled={isCreatingInvoice}
          >
            {isCreatingInvoice ? 'Creando Factura...' : 'Crear Factura'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailModal;
