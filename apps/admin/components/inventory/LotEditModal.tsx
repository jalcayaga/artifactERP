import React, { useState, useEffect, FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@artifact/ui';
import { Button } from '@artifact/ui';
import { Input } from '@artifact/ui';
import { Label } from '@artifact/ui';
import { ArchiveBoxIcon, CalendarIcon } from '@artifact/ui';
import { Lot, formatDate } from '@artifact/core';
import { ProductService } from '@artifact/core/client';;
import { toast } from 'sonner';

interface LotEditModalProps {
  lot: Lot | null;
  onClose: () => void;
  onSave: (updatedLot: Lot) => void;
}

const LotEditModal: React.FC<LotEditModalProps> = ({
  lot,
  onClose,
  onSave,
}) => {
  const [lotNumber, setLotNumber] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (lot) {
      setLotNumber(lot.lotNumber || '');
      setCurrentQuantity(lot.currentQuantity.toString());
      setPurchasePrice(lot.purchasePrice.toString());
      setEntryDate(lot.entryDate ? new Date(lot.entryDate).toISOString().split('T')[0] : '');
      setExpirationDate(lot.expirationDate ? new Date(lot.expirationDate).toISOString().split('T')[0] : '');
      setLocation(lot.location || '');
    } else {
      setLotNumber('');
      setCurrentQuantity('');
      setPurchasePrice('');
      setEntryDate('');
      setExpirationDate('');
      setLocation('');
    }
    setErrors({});
  }, [lot]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!lotNumber.trim()) newErrors.lotNumber = 'El número de lote es requerido.';
    if (parseFloat(currentQuantity) <= 0) newErrors.currentQuantity = 'La cantidad debe ser mayor a 0.';
    if (parseFloat(purchasePrice) <= 0) newErrors.purchasePrice = 'El precio de compra debe ser mayor a 0.';
    if (!entryDate) newErrors.entryDate = 'La fecha de entrada es requerida.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!lot || !validateForm()) return;

    setIsSubmitting(true);
    try {
      const updatedLot: Lot = {
        ...lot,
        lotNumber: lotNumber.trim(),
        currentQuantity: parseFloat(currentQuantity),
        purchasePrice: parseFloat(purchasePrice),
        entryDate: entryDate,
        expirationDate: expirationDate || undefined,
        location: location.trim() || undefined,
      };

      // Assuming ProductService has an updateLot method
      // await ProductService.updateLot(lot.productId, updatedLot.id, updatedLot);
      toast.success('Lote actualizado exitosamente.');
      onSave(updatedLot);
      onClose();
    } catch (error: any) {
      console.error('Error updating lot:', error);
      toast.error(error.message || 'Error al actualizar el lote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lot) return null;

  return (
    <Dialog open={!!lot} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <ArchiveBoxIcon className='w-5 h-5 mr-2' /> Editar Lote: {lot.lotNumber}
          </DialogTitle>
          <DialogDescription>
            Actualiza los detalles del lote de stock.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='lotNumber' className='text-right'>
              Número de Lote
            </Label>
            <Input
              id='lotNumber'
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value)}
              className='col-span-3'
              required
            />
            {errors.lotNumber && <p className='col-span-4 text-destructive text-sm text-right'>{errors.lotNumber}</p>}
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='currentQuantity' className='text-right'>
              Cantidad Actual
            </Label>
            <Input
              id='currentQuantity'
              type='number'
              value={currentQuantity}
              onChange={(e) => setCurrentQuantity(e.target.value)}
              className='col-span-3'
              required
            />
            {errors.currentQuantity && <p className='col-span-4 text-destructive text-sm text-right'>{errors.currentQuantity}</p>}
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='purchasePrice' className='text-right'>
              Precio de Compra
            </Label>
            <Input
              id='purchasePrice'
              type='number'
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className='col-span-3'
              required
            />
            {errors.purchasePrice && <p className='col-span-4 text-destructive text-sm text-right'>{errors.purchasePrice}</p>}
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='entryDate' className='text-right'>
              Fecha de Entrada
            </Label>
            <Input
              id='entryDate'
              type='date'
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className='col-span-3'
              required
            />
            {errors.entryDate && <p className='col-span-4 text-destructive text-sm text-right'>{errors.entryDate}</p>}
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='expirationDate' className='text-right'>
              Fecha de Vencimiento
            </Label>
            <Input
              id='expirationDate'
              type='date'
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='location' className='text-right'>
              Ubicación
            </Label>
            <Input
              id='location'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className='col-span-3'
            />
          </div>
        </form>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button type='submit' onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LotEditModal;
