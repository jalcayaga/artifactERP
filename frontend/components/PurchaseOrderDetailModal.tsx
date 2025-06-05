// frontend/components/PurchaseOrderDetailModal.tsx
import React, { useEffect } from 'react';
import { PurchaseOrder, PurchaseOrderItem } from '@/lib/types';
import { XIcon, TruckIcon, CalendarIcon, ChatBubbleLeftEllipsisIcon, TagIcon } from '@/components/Icons';

interface PurchaseOrderDetailModalProps {
  order: PurchaseOrder | null;
  onClose: () => void;
}

const OrderInfoItem: React.FC<{ label: string; value?: string | React.ReactNode; icon?: React.FC<{className?: string}> }> = ({ label, value, icon: Icon }) => {
  if (!value && typeof value !== 'object' && typeof value !== 'boolean' && typeof value !== 'number') return null;
  return (
    <div className="flex items-start py-1.5">
      {Icon && <Icon className="w-5 h-5 mr-2.5 mt-0.5 text-muted-foreground opacity-80 flex-shrink-0" />}
      <div className="flex-grow">
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
        <dd className="text-sm text-foreground">{value || <span className="italic">N/A</span>}</dd>
      </div>
    </div>
  );
};

const PurchaseOrderDetailModal: React.FC<PurchaseOrderDetailModalProps> = ({ order, onClose }) => {
  useEffect(() => {
    if (!order) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [order, onClose]);

  if (!order) return null;

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'Pendiente': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
      case 'Aprobada': return 'bg-primary/10 text-primary'; // Using primary for approved
      case 'Recibida': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
      case 'Cancelada': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="po-detail-modal-title"
    >
      <div
        className="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b">
          <h2 id="po-detail-modal-title" className="text-lg sm:text-xl font-semibold text-foreground flex items-center">
            <TruckIcon className="w-6 h-6 mr-2 text-primary" />
            Detalle de Orden de Compra (ID: {order.id.substring(0, 8)}...)
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            aria-label="Cerrar modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 mb-3">
            <OrderInfoItem label="Proveedor" value={order.supplierName} />
            <OrderInfoItem label="Fecha de Orden" value={new Date(order.orderDate).toLocaleDateString()} icon={CalendarIcon} />
            <OrderInfoItem 
              label="Estado" 
              value={<span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(order.status)}`}>{order.status}</span>}
              icon={TagIcon}
            />
            {order.expectedDeliveryDate && <OrderInfoItem label="Fecha Entrega Estimada" value={new Date(order.expectedDeliveryDate).toLocaleDateString()} icon={CalendarIcon} />}
            {order.observations && (
                <div className="md:col-span-2 lg:col-span-3">
                    <OrderInfoItem label="Observaciones" value={order.observations} icon={ChatBubbleLeftEllipsisIcon}/>
                </div>
            )}
          </div>

          <h3 className="text-md font-semibold text-foreground mb-1.5">Artículos de la Orden</h3>
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Producto / Servicio</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cant.</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">P.Unit (s/IVA)</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subtotal (s/IVA)</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">IVA ({order.vatRatePercent}%)</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Artículo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-foreground">{item.productName}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-muted-foreground text-right">{item.quantity}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-muted-foreground text-right hidden sm:table-cell">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-foreground text-right">${item.totalPrice.toFixed(2)}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-muted-foreground text-right hidden md:table-cell">${item.itemVatAmount.toFixed(2)}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium text-foreground text-right">${item.totalPriceWithVat.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-border space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Subtotal (sin IVA):</span>
              <span className="text-sm font-semibold text-foreground">${order.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Total IVA ({order.vatRatePercent}%):</span>
              <span className="text-sm font-semibold text-foreground">${order.totalVatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-border/50">
              <span className="text-md font-bold text-foreground">Gran Total:</span>
              <span className="text-lg font-bold text-primary">${order.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 sm:p-4 bg-muted/50 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetailModal;