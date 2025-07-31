// components/LotEditModal.tsx
import React, { useState, useEffect } from 'react';
import { Lot } from '@/lib/types';
import { api } from '@/lib/api';
import { XIcon, SaveIcon } from '@/components/Icons';

interface LotEditModalProps {
  lot: Lot | null;
  onClose: () => void;
  onSave: (updatedLot: Lot) => void;
}

const LotEditModal: React.FC<LotEditModalProps> = ({ lot, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Lot>>({});

  useEffect(() => {
    if (lot) {
      setFormData({
        lotNumber: lot.lotNumber,
        currentQuantity: lot.currentQuantity,
        purchasePrice: lot.purchasePrice,
        expirationDate: lot.expirationDate ? new Date(lot.expirationDate).toISOString().split('T')[0] : '',
        location: lot.location,
      });
    }
  }, [lot]);

  if (!lot) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/lots/${lot.id}`, formData);
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating lot:', error);
      // Handle error display to user
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold">Editar Lote #{lot.lotNumber}</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label htmlFor="lotNumber" className="block text-sm font-medium text-muted-foreground mb-1">Número de Lote</label>
              <input type="text" name="lotNumber" id="lotNumber" value={formData.lotNumber || ''} onChange={handleChange} className="input" />
            </div>
            <div>
              <label htmlFor="currentQuantity" className="block text-sm font-medium text-muted-foreground mb-1">Cantidad Actual</label>
              <input type="number" name="currentQuantity" id="currentQuantity" value={formData.currentQuantity || ''} onChange={handleChange} className="input" />
            </div>
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-muted-foreground mb-1">Precio de Compra</label>
              <input type="number" step="0.01" name="purchasePrice" id="purchasePrice" value={formData.purchasePrice || ''} onChange={handleChange} className="input" />
            </div>
            <div>
              <label htmlFor="expirationDate" className="block text-sm font-medium text-muted-foreground mb-1">Fecha de Vencimiento</label>
              <input type="date" name="expirationDate" id="expirationDate" value={formData.expirationDate || ''} onChange={handleChange} className="input" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-muted-foreground mb-1">Ubicación</label>
              <input type="text" name="location" id="location" value={formData.location || ''} onChange={handleChange} className="input" />
            </div>
          </div>
          <div className="px-5 py-3 bg-muted/50 border-t border-border flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancelar</button>
            <button type="submit" className="btn btn-primary"><SaveIcon className="w-4 h-4 mr-2" /> Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LotEditModal;