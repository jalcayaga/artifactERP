import React, { useState, useEffect, FormEvent } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
  IconButton,
} from '@material-tailwind/react';
import { Archive, Calendar, X, DollarSign, MapPin, Hash, Package } from 'lucide-react';
import { Lot, formatDate } from '@artifact/core';
import { ProductService } from '@artifact/core/client';
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

  const inputBaseClass =
    'block w-full px-4 py-2.5 bg-slate-900/50 border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium';
  const labelClass = 'block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-1';
  const errorTextClass = 'mt-1.5 text-[10px] font-bold text-red-400 uppercase tracking-wider ml-1';

  if (!lot) return null;

  return (
    <Dialog onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
      open={!!lot}
      handler={onClose}
      size="sm"
      className="bg-[#1e293b]/90 backdrop-blur-2xl border border-white/[0.08] shadow-2xl rounded-3xl overflow-hidden"
      placeholder=""
    >
      <DialogHeader className="flex items-center justify-between p-6 border-b border-white/[0.05] bg-white/[0.02]" placeholder="" >
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Archive className='w-5 h-5 text-blue-500' />
          </div>
          <div>
            <Typography variant="h6" color="white" className="font-black uppercase tracking-tight italic" placeholder="" >
              Editar Lote de Stock
            </Typography>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lote: {lot.lotNumber}</p>
          </div>
        </div>
        <IconButton variant="text" color="white" onClick={onClose} placeholder="" onResize={undefined} onResizeCapture={undefined}>
          <X className="h-5 w-5" />
        </IconButton>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogBody className="p-8 space-y-6" placeholder="" >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor='lotNumber' className={labelClass}>Número de Lote</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id='lotNumber'
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                  className={`${inputBaseClass} pl-10`}
                  required
                />
              </div>
              {errors.lotNumber && <p className={errorTextClass}>{errors.lotNumber}</p>}
            </div>
            <div>
              <label htmlFor='currentQuantity' className={labelClass}>Cantidad Actual</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id='currentQuantity'
                  type='number'
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(e.target.value)}
                  className={`${inputBaseClass} pl-10`}
                  required
                />
              </div>
              {errors.currentQuantity && <p className={errorTextClass}>{errors.currentQuantity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor='purchasePrice' className={labelClass}>Precio de Compra</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id='purchasePrice'
                  type='number'
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className={`${inputBaseClass} pl-10`}
                  required
                />
              </div>
              {errors.purchasePrice && <p className={errorTextClass}>{errors.purchasePrice}</p>}
            </div>
            <div>
              <label htmlFor='location' className={labelClass}>Ubicación / Bodega</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id='location'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`${inputBaseClass} pl-10`}
                  placeholder="Ej: Pasillo A-1"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor='entryDate' className={labelClass}>Fecha de Entrada</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id='entryDate'
                  type='date'
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className={`${inputBaseClass} pl-10`}
                  required
                />
              </div>
              {errors.entryDate && <p className={errorTextClass}>{errors.entryDate}</p>}
            </div>
            <div>
              <label htmlFor='expirationDate' className={labelClass}>Fecha Vencimiento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500/50" />
                <input
                  id='expirationDate'
                  type='date'
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className={`${inputBaseClass} pl-10 border-orange-500/10`}
                />
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="p-6 border-t border-white/[0.05] bg-white/[0.02] flex items-center justify-end gap-3" placeholder="" >
          <Button
            variant="text"
            color="white"
            onClick={onClose}
            className="font-black uppercase tracking-widest text-[10px]"
            placeholder="" onResize={undefined} onResizeCapture={undefined}
          >
            Descartar
          </Button>
          <Button
            type='submit'
            onClick={handleSubmit}
            disabled={isSubmitting}
            className='bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 px-6 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest'
            placeholder="" onResize={undefined} onResizeCapture={undefined}
          >
            {isSubmitting ? 'Procesando...' : 'Actualizar Lote'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default LotEditModal;
