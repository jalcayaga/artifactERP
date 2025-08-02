
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangleIcon } from '@/components/Icons';
import { Company } from '@/lib/types';
import { SupplierService } from '@/lib/services/supplierService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StockInfo {
  productId: string;
  productName: string;
  quantityNeeded: number;
  quantityAvailable: number;
}

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productId: string, quantity: number, supplierId: string) => void;
  stockInfo: StockInfo | null;
}

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  stockInfo,
}) => {
  const [suppliers, setSuppliers] = useState<Company[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      SupplierService.getAllSuppliers().then(data => {
        setSuppliers(data as Company[]);
      });
    }
  }, [isOpen]);

  if (!isOpen || !stockInfo) {
    return null;
  }

  const handleConfirm = () => {
    if (!selectedSupplier) {
      // TODO: Add proper validation and user feedback
      alert('Por favor, seleccione un proveedor.');
      return;
    }
    const quantityToOrder = stockInfo.quantityNeeded - stockInfo.quantityAvailable;
    onConfirm(stockInfo.productId, quantityToOrder, selectedSupplier);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="create-purchase-order-description">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangleIcon className="w-6 h-6 mr-2 text-yellow-500" />
            <span>Stock Insuficiente</span>
          </DialogTitle>
          <DialogDescription id="create-purchase-order-description" className="pt-2">
            No hay suficiente stock para el producto{' '}
            <strong>{stockInfo.productName}</strong>.
            <br />
            Necesitas <strong>{stockInfo.quantityNeeded}</strong> y solo hay{' '}
            <strong>{stockInfo.quantityAvailable}</strong> disponibles.
            <br />
            <br />
            ¿Deseas crear una orden de compra para adquirir las unidades faltantes?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label htmlFor="supplier-select" className="block text-sm font-medium text-gray-700">
            Proveedor
          </label>
          <Select onValueChange={setSelectedSupplier} value={selectedSupplier}>
            <SelectTrigger id="supplier-select">
              <SelectValue placeholder="Seleccione un proveedor" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map(supplier => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedSupplier}>
            Crear Orden de Compra
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePurchaseOrderModal;
