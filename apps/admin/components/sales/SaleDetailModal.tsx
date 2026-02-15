import { apiClient } from '@/lib/api';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@artifact/ui';

interface SaleDetailModalProps {
  sale: any;
  onClose: () => void;
  onInvoiceCreated: () => void;
}

export default function SaleDetailModal({ sale, onClose, onInvoiceCreated }: SaleDetailModalProps) {
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isCreatingDispatch, setIsCreatingDispatch] = useState(false);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState<string>('');

  useEffect(() => {
    if (sale) {
      apiClient.get('/couriers').then(res => {
        setCouriers(Array.isArray(res) ? res : (res as any).data || []);
      }).catch(err => console.error('Error loading couriers', err));
    }
  }, [sale]);

  const handleCreateDispatch = async () => {
    if (!sale) return;
    setIsCreatingDispatch(true);
    try {
      await apiClient.post('/dispatches', {
        orderId: sale.id,
        courierId: selectedCourierId || undefined,
      });
      toast.success('Guía de despacho creada exitosamente');
      onInvoiceCreated();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Error al crear la guía');
    } finally {
      setIsCreatingDispatch(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!sale) return;
    setIsCreatingInvoice(true);
    try {
      await apiClient.post('/invoices', {
        orderId: sale.id
      });
      toast.success('Factura creada exitosamente');
      onInvoiceCreated();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Error al crear la factura');
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  return (
    <div className='px-4 py-3 sm:p-4 bg-muted/50 border-t border-border flex flex-col sm:flex-row justify-end gap-2 items-center'>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedCourierId}
          onChange={(e) => setSelectedCourierId(e.target.value)}
        >
          <option value="">Seleccionar Courier (Opcional)</option>
          {couriers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button type='button' onClick={onClose} variant='outline'>
          Cerrar
        </Button>
        <Button
          type='button'
          onClick={handleCreateDispatch}
          disabled={isCreatingDispatch}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isCreatingDispatch ? 'Creando...' : 'Crear Guía'}
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
  );
}
