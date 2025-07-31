
import React, { useState, FormEvent, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; 
import { ShoppingCartIcon, PlusIcon, TrashIcon } from '@/components/Icons';
import { SaleItem, Sale } from '@/lib/types'; 
import { formatCurrencyChilean } from '@/lib/utils';

interface SaleFormProps {
  saleData?: Sale | null; // Datos de la venta para edición (opcional)
  onSave: (saleData: Sale) => void;
  onCancel: () => void;
}

const FIXED_VAT_RATE_PERCENT = 19;

const SaleForm: React.FC<SaleFormProps> = ({ saleData, onSave, onCancel }) => {
  const [clientName, setClientName] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [observations, setObservations] = useState('');
  const [items, setItems] = useState<SaleItem[]>([]);
  
  // Estados para el formulario de nuevo artículo
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [itemErrors, setItemErrors] = useState<{ [key: string]: string }>({});

  const isEditing = useMemo(() => !!saleData, [saleData]);

  useEffect(() => {
    if (saleData) {
      setClientName(saleData.clientName);
      // Asegurarse de que la fecha se formatee correctamente para el input type="date"
      setSaleDate(new Date(saleData.saleDate).toISOString().split('T')[0]);
      setObservations(saleData.observations || '');
      setItems(saleData.items || []);
    } else {
      // Resetear para nueva venta
      setClientName('');
      setSaleDate(new Date().toISOString().split('T')[0]);
      setObservations('');
      setItems([]);
    }
    // Limpiar errores y campos de nuevo artículo al cambiar de modo o datos
    setErrors({});
    setItemErrors({});
    setNewItemName('');
    setNewItemQuantity('');
    setNewItemPrice('');
  }, [saleData]);

  const { subTotal, totalVatAmount, grandTotal } = useMemo(() => {
    const currentSubTotal = items.reduce((total, item) => total + item.totalItemPrice, 0);
    const currentTotalVatAmount = items.reduce((total, item) => total + item.itemVatAmount, 0);
    const currentGrandTotal = currentSubTotal + currentTotalVatAmount;
    return { subTotal: currentSubTotal, totalVatAmount: currentTotalVatAmount, grandTotal: currentGrandTotal };
  }, [items]);

  const validateItemForm = (): boolean => {
    const newItmErrors: { [key: string]: string } = {};
    if (!newItemName.trim()) newItmErrors.name = 'El nombre del producto o servicio es requerido.';
    const quantityNum = parseFloat(newItemQuantity);
    if (isNaN(quantityNum) || quantityNum <= 0) newItmErrors.quantity = 'La cantidad debe ser un número positivo.';
    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum < 0) newItmErrors.price = 'El precio debe ser un número positivo o cero.';
    setItemErrors(newItmErrors);
    return Object.keys(newItmErrors).length === 0;
  };

  const handleAddItem = useCallback(() => {
    if (!validateItemForm()) return;
    const quantity = parseFloat(newItemQuantity);
    const unitPrice = parseFloat(newItemPrice);
    const totalItemPrice = quantity * unitPrice;
    const itemVatAmount = totalItemPrice * (FIXED_VAT_RATE_PERCENT / 100);
    const newItem: SaleItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productName: newItemName.trim(),
      quantity, unitPrice, totalItemPrice, itemVatAmount,
    };
    setItems(prevItems => [...prevItems, newItem]);
    setNewItemName(''); setNewItemQuantity(''); setNewItemPrice(''); setItemErrors({});
  }, [newItemName, newItemQuantity, newItemPrice]);

  const handleRemoveItem = useCallback((itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const validateMainForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!clientName.trim()) newErrors.clientName = 'El nombre del cliente es requerido.';
    if (!saleDate) newErrors.saleDate = 'La fecha de venta es requerida.';
    if (items.length === 0) newErrors.items = 'Debe añadir al menos un artículo a la venta.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateMainForm()) return;
    
    const saleId = isEditing && saleData?.id ? saleData.id : `sale-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const saleDetails: Sale = {
      id: saleId, 
      clientName: clientName.trim(), 
      saleDate, // saleDate ya está en formato YYYY-MM-DD desde el estado
      observations: observations.trim(),
      items, 
      vatRatePercent: FIXED_VAT_RATE_PERCENT, 
      subTotal, 
      totalVatAmount, 
      grandTotal,
    };
    onSave(saleDetails);
  };
  
  const inputBaseClass = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground";
  const errorTextClass = "mt-1 text-xs text-destructive";

  return (
    <Card className="max-w-4xl mx-auto border">
      <CardHeader>
        <CardTitle className="text-xl">
          {isEditing ? `Editar Venta: ${saleData?.id.substring(0,8)}...` : 'Crear Nueva Venta'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="sale-client-name" className="block text-sm font-medium text-foreground">
                Cliente <span className="text-red-500">*</span>
              </label>
              <input type="text" id="sale-client-name" value={clientName} onChange={(e) => setClientName(e.target.value)} className={inputBaseClass} placeholder="Nombre del cliente o empresa" aria-describedby="clientName-error"/>
              {errors.clientName && <p id="clientName-error" className={errorTextClass}>{errors.clientName}</p>}
            </div>
            <div>
              <label htmlFor="sale-date" className="block text-sm font-medium text-foreground">
                Fecha de Venta <span className="text-red-500">*</span>
              </label>
              <input type="date" id="sale-date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} className={inputBaseClass} aria-describedby="saleDate-error"/>
              {errors.saleDate && <p id="saleDate-error" className={errorTextClass}>{errors.saleDate}</p>}
            </div>
          </div>

          <div className="space-y-4 p-4 border border-border rounded-md bg-card">
            <h3 className="text-md font-semibold text-foreground">Artículos de la Venta (IVA {FIXED_VAT_RATE_PERCENT}%)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-5">
                  <label htmlFor="item-name" className="block text-xs font-medium text-muted-foreground">Producto / Servicio</label>
                  <input type="text" id="item-name" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Nombre del artículo" className={`${inputBaseClass} py-1.5 text-sm`} aria-describedby="itemName-error" />
                  {itemErrors.name && <p id="itemName-error" className={errorTextClass}>{itemErrors.name}</p>}
              </div>
              <div className="sm:col-span-2">
                  <label htmlFor="item-quantity" className="block text-xs font-medium text-muted-foreground">Cant.</label>
                  <input type="number" id="item-quantity" value={newItemQuantity} onChange={e => setNewItemQuantity(e.target.value)} placeholder="0" className={`${inputBaseClass} py-1.5 text-sm`} aria-describedby="itemQuantity-error" />
                  {itemErrors.quantity && <p id="itemQuantity-error" className={errorTextClass}>{itemErrors.quantity}</p>}
              </div>
              <div className="sm:col-span-3">
                  <label htmlFor="item-price" className="block text-xs font-medium text-muted-foreground">P. Unit. (sin IVA)</label>
                  <input type="number" id="item-price" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="0.00" step="0.01" className={`${inputBaseClass} py-1.5 text-sm`} aria-describedby="itemPrice-error" />
                  {itemErrors.price && <p id="itemPrice-error" className={errorTextClass}>{itemErrors.price}</p>}
              </div>
              <div className="sm:col-span-2">
                  <button type="button" onClick={handleAddItem} className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-medium py-2 px-3 rounded-md shadow-sm text-sm flex items-center justify-center space-x-1.5 transition-all" aria-label="Añadir artículo a la venta">
                      <PlusIcon className="w-4 h-4" /> <span>Añadir</span>
                  </button>
              </div>
            </div>
            {items.length > 0 ? (
              <div className="mt-4 -mx-4 sm:mx-0 overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Producto / Servicio</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cant.</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">P.Unit (s/IVA)</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subtotal (s/IVA)</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">IVA Item</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map(item => (
                      <tr key={item.id}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-foreground">{item.productName}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right">{item.quantity}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right">{formatCurrencyChilean(item.unitPrice)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-foreground font-medium text-right">{formatCurrencyChilean(item.totalItemPrice)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right hidden sm:table-cell">{formatCurrencyChilean(item.itemVatAmount)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          <button type="button" onClick={() => handleRemoveItem(item.id)} title="Eliminar Artículo" className="text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10 transition-colors">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : ( <p className="text-sm text-center text-muted-foreground italic py-3">Aún no se han añadido artículos a la venta.</p> )}
             {errors.items && <p className={errorTextClass + " text-center"}>{errors.items}</p>}
          </div>

          <div className="mt-6 pt-4 border-t border-border space-y-2">
            <div className="flex justify-end items-center"><span className="text-md font-medium text-muted-foreground">Subtotal (sin IVA):</span><span className="ml-4 text-md font-semibold text-foreground w-32 text-right">{formatCurrencyChilean(subTotal)}</span></div>
            <div className="flex justify-end items-center"><span className="text-md font-medium text-muted-foreground">IVA ({FIXED_VAT_RATE_PERCENT}%):</span><span className="ml-4 text-md font-semibold text-foreground w-32 text-right">{formatCurrencyChilean(totalVatAmount)}</span></div>
            <div className="flex justify-end items-center mt-1 pt-1 border-t border-border/50"><span className="text-lg font-bold text-foreground">Total Venta:</span><span className="ml-4 text-2xl font-bold text-primary w-32 text-right">{formatCurrencyChilean(grandTotal)}</span></div>
          </div>

          <div>
            <label htmlFor="sale-observations" className="block text-sm font-medium text-foreground">Observaciones</label>
            <textarea id="sale-observations" value={observations} onChange={(e) => setObservations(e.target.value)} rows={3} className={inputBaseClass} placeholder="Añadir notas adicionales sobre la venta..."/>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6">
          <button type="button" onClick={onCancel} className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2.5 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition-colors duration-150">Cancelar</button>
          <button type="submit" className="w-full sm:w-auto order-1 sm:order-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2" aria-live="polite">
            <ShoppingCartIcon className="w-5 h-5" /> 
            <span>{isEditing ? 'Actualizar Venta' : 'Guardar Venta'}</span>
          </button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SaleForm;