// Importaciones de React, tipos e iconos necesarios.
import React, { useEffect } from 'react';
import { Sale, SaleItem } from '@/lib/types'; // Tipos de datos para la venta y sus artículos.
import { XIcon, ShoppingCartIcon, CalendarIcon, ChatBubbleLeftEllipsisIcon } from '@/components/Icons'; // Iconos para la UI del modal.

// Props que espera el componente SaleDetailModal.
interface SaleDetailModalProps {
  sale: Sale | null; // Datos de la venta a mostrar, o null si no hay venta.
  onClose: () => void; // Función para cerrar el modal.
}

// Componente interno para mostrar un ítem de detalle general de la venta.
const SaleInfoItem: React.FC<{ label: string; value?: string | React.ReactNode; icon?: React.FC<{className?: string}> }> = ({ label, value, icon: Icon }) => {
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

// Componente funcional para el modal que muestra los detalles de una venta.
const SaleDetailModal: React.FC<SaleDetailModalProps> = ({ sale, onClose }) => {
  // useEffect para manejar efectos secundarios: cerrar con Escape y bloquear scroll del body.
  useEffect(() => {
    if (!sale) return; // Si no hay venta, no hace nada.

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(); // Cierra el modal.
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [sale, onClose]); // Dependencias: se re-ejecuta si sale o onClose cambian.

  if (!sale) {
    return null; // Si no hay venta, no renderiza el modal.
  }

  // Calcula el total de cada artículo con IVA incluido
  const calculateItemTotalWithVat = (item: SaleItem) => {
    return item.totalItemPrice + item.itemVatAmount;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Cierra el modal al hacer clic en el fondo.
      role="dialog"
      aria-modal="true"
      aria-labelledby="sale-detail-modal-title"
    >
      <div
        className="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border"
        onClick={e => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre.
      >
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b">
          <h2 id="sale-detail-modal-title" className="text-lg sm:text-xl font-semibold text-foreground flex items-center">
            <ShoppingCartIcon className="w-6 h-6 mr-2 text-primary" />
            Detalle de Venta (ID: {sale.id.substring(0, 8)}...)
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            aria-label="Cerrar modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del modal con los detalles */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Información general de la venta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-3">
            <SaleInfoItem label="Cliente" value={sale.clientName} />
            <SaleInfoItem label="Fecha de Venta" value={new Date(sale.saleDate).toLocaleDateString()} icon={CalendarIcon} />
            {sale.observations && (
                <div className="md:col-span-2">
                    <SaleInfoItem label="Observaciones" value={sale.observations} icon={ChatBubbleLeftEllipsisIcon}/>
                </div>
            )}
          </div>

          {/* Tabla de Artículos */}
          <h3 className="text-md font-semibold text-foreground mb-1.5">Artículos</h3>
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Producto / Servicio</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cant.</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">P.Unit (s/IVA)</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subtotal (s/IVA)</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">IVA ({sale.vatRatePercent}%)</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Item</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sale.items.map(item => (
                  <tr key={item.id}>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-foreground">{item.productName}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-muted-foreground text-right">{item.quantity}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-muted-foreground text-right hidden sm:table-cell">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-foreground text-right">${item.totalItemPrice.toFixed(2)}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-muted-foreground text-right hidden md:table-cell">${item.itemVatAmount.toFixed(2)}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium text-foreground text-right">${calculateItemTotalWithVat(item).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumen de Totales */}
          <div className="mt-4 pt-3 border-t border-border space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Subtotal (sin IVA):</span>
              <span className="text-sm font-semibold text-foreground">${sale.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Total IVA ({sale.vatRatePercent}%):</span>
              <span className="text-sm font-semibold text-foreground">${sale.totalVatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-border/50">
              <span className="text-md font-bold text-foreground">Gran Total:</span>
              <span className="text-lg font-bold text-primary">${sale.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Pie del modal */}
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

export default SaleDetailModal;