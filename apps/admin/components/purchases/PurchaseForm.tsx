import React, {
  useState,
  FormEvent,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Select,
  Option,
  IconButton,
  Chip,
} from "@material-tailwind/react";
import {
  ShoppingCartIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Product, Company, CreatePurchaseDto, formatCurrencyChilean } from '@artifact/core';
import { ProductService, PurchaseService, CompanyService, useAuth } from '@artifact/core/client';
import { toast } from 'sonner';

interface PurchaseFormProps {
  onSave: () => Promise<void>;
  onCancel: () => void;
}

const FIXED_VAT_RATE_PERCENT = 19;

const PurchaseForm: React.FC<PurchaseFormProps> = ({ onSave, onCancel }) => {
  const { token } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<Product | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState('');
  const [unitPriceToAdd, setUnitPriceToAdd] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [itemErrors, setItemErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      CompanyService.getAllCompanies(1, 1000, { isSupplier: true })
        .then((res) => {
          const list = Array.isArray(res) ? res : res?.data ?? [];
          setCompanies(list);
        })
        .catch((err) => console.error('Error fetching suppliers:', err));
    }
  }, [token]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 2 && token && !selectedProductToAdd) {
        ProductService.searchProducts(token, searchTerm)
          .then((res) => {
            const products = Array.isArray(res) ? res : res?.data ?? []
            setSearchResults(products)
          })
          .catch((err) => console.error('Error searching products:', err));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, token, selectedProductToAdd]);

  const handleProductSelect = useCallback(async (product: Product) => {
    setSelectedProductToAdd(product);
    setSearchTerm(product.name);
    setSearchResults([]);
    setUnitPriceToAdd(product.price?.toString() || '');
  }, []);

  const { subTotal, totalVatAmount, grandTotal } = useMemo(() => {
    const currentSubTotal = items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
    const currentTotalVatAmount = items.reduce(
      (total, item) => total + item.itemVatAmount,
      0
    );
    const currentGrandTotal = currentSubTotal + currentTotalVatAmount;
    return {
      subTotal: currentSubTotal,
      totalVatAmount: currentTotalVatAmount,
      grandTotal: currentGrandTotal,
    };
  }, [items]);

  const validateItemForm = (): boolean => {
    const newItmErrors: { [key: string]: string } = {};
    if (!selectedProductToAdd)
      newItmErrors.product = 'Debe seleccionar un producto.';
    const quantityNum = parseFloat(quantityToAdd);
    if (isNaN(quantityNum) || quantityNum <= 0)
      newItmErrors.quantity = 'Mínimo 1.';
    const priceNum = parseFloat(unitPriceToAdd);
    if (isNaN(priceNum) || priceNum < 0)
      newItmErrors.price = 'Mínimo 0.';
    setItemErrors(newItmErrors);
    return Object.keys(newItmErrors).length === 0;
  };

  const handleAddItem = useCallback(() => {
    if (!validateItemForm() || !selectedProductToAdd) return;

    const quantity = parseFloat(quantityToAdd);
    const unitPrice = parseFloat(unitPriceToAdd);
    const totalItemPrice = quantity * unitPrice;
    const itemVatAmount = totalItemPrice * (FIXED_VAT_RATE_PERCENT / 100);
    const totalPriceWithVat = totalItemPrice + itemVatAmount;

    const newItem = {
      productId: selectedProductToAdd.id,
      productName: selectedProductToAdd.name,
      quantity,
      unitPrice,
      totalPrice: totalItemPrice,
      itemVatAmount,
      totalPriceWithVat,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setSearchTerm('');
    setSelectedProductToAdd(null);
    setQuantityToAdd('');
    setUnitPriceToAdd('');
    setItemErrors({});
  }, [selectedProductToAdd, quantityToAdd, unitPriceToAdd]);

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }, []);

  const validateMainForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedCompanyId)
      newErrors.selectedCompanyId = 'Requerido.';
    if (!purchaseDate)
      newErrors.purchaseDate = 'Requerida.';
    if (items.length === 0)
      newErrors.items = 'Añade al menos un producto.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateMainForm()) return;

    setIsSubmitting(true);
    try {
      const purchaseDetails: CreatePurchaseDto = {
        companyId: selectedCompanyId,
        purchaseDate,
        status: 'COMPLETED',
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          itemVatAmount: item.itemVatAmount,
          totalPriceWithVat: item.totalPriceWithVat,
        })),
        subTotalAmount: subTotal,
        totalVatAmount: totalVatAmount,
        grandTotal: grandTotal,
      };

      await PurchaseService.createPurchase(purchaseDetails);
      toast.success('Compra registrada exitosamente.');
      await onSave();
    } catch (error: any) {
      console.error('Error creating purchase:', error);
      toast.error(error.message || 'Error al registrar la compra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='max-w-4xl mx-auto bg-[#0B1120] border border-blue-gray-100/10' placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
      <CardHeader variant="gradient" color="blue" className="mb-4 grid h-20 place-items-center" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
        <Typography variant="h4" color="white" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
          Registrar Nueva Compra
        </Typography>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardBody className='flex flex-col gap-8 px-8 py-6' placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
          {/* Header Info */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className="flex flex-col gap-2">
              <Select
                label="Seleccionar Proveedor"
                value={selectedCompanyId}
                onChange={(val) => setSelectedCompanyId(val || '')}
                error={!!errors.selectedCompanyId}
                className="text-white"
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
                labelProps={{ className: "text-blue-gray-200" }}
              >
                {companies.map((company) => (
                  <Option key={company.id} value={company.id}>
                    {company.name}
                  </Option>
                ))}
              </Select>
              {errors.selectedCompanyId && <Typography variant="small" color="red" className="font-bold ml-1" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>{errors.selectedCompanyId}</Typography>}
            </div>

            <div className="flex flex-col gap-2">
              <Input
                type='date'
                label='Fecha de Compra'
                icon={<CalendarIcon className="h-5 w-5 text-blue-gray-300" />}
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                error={!!errors.purchaseDate}
                className="text-white"
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
                crossOrigin={undefined}
                labelProps={{ className: "text-blue-gray-200" }}
              />
              {errors.purchaseDate && <Typography variant="small" color="red" className="font-bold ml-1" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>{errors.purchaseDate}</Typography>}
            </div>
          </div>

          <hr className="border-blue-gray-100/10" />

          {/* Add Item Section */}
          <div className='bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col gap-6'>
            <Typography variant="h6" color="blue" className="uppercase tracking-widest font-bold border-l-4 border-blue-500 pl-4" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
              Catálogo de Compra
            </Typography>

            <div className='grid grid-cols-1 sm:grid-cols-12 gap-6 items-start'>
              <div className='sm:col-span-12 relative'>
                <Input
                  label='Buscar Producto o Servicio'
                  type='text'
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (selectedProductToAdd) setSelectedProductToAdd(null);
                  }}
                  placeholder='Nombre o SKU...'
                  icon={<MagnifyingGlassIcon className='w-5 h-5 text-blue-gray-300' />}
                  error={!!itemErrors.product}
                  className="text-white"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  onResize={undefined}
                  onResizeCapture={undefined}
                  crossOrigin={undefined}
                  labelProps={{ className: "text-blue-gray-200" }}
                />

                {searchResults.length > 0 && (
                  <div className='absolute z-50 w-full bg-[#1A2235] border border-blue-gray-100/10 rounded-xl shadow-2xl mt-2 max-h-64 overflow-y-auto backdrop-blur-xl'>
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className='px-6 py-4 hover:bg-blue-500/20 cursor-pointer flex justify-between items-center transition-all'
                        onClick={() => handleProductSelect(product)}
                      >
                        <div>
                          <Typography variant="small" color="white" className="font-bold" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>{product.name}</Typography>
                          <Typography variant="small" color="blue-gray" className="text-[10px] opacity-60 uppercase" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>{product.sku || 'SIN SKU'}</Typography>
                        </div>
                        <Chip size="sm" variant="ghost" color="blue" value={product.productType} className="rounded-full" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedProductToAdd && (
                <div className='sm:col-span-12 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end animate-in fade-in slide-in-from-top-4 duration-300'>
                  <div className='sm:col-span-3'>
                    <Input
                      type='number'
                      label='Cantidad'
                      value={quantityToAdd}
                      onChange={(e) => setQuantityToAdd(e.target.value)}
                      error={!!itemErrors.quantity}
                      className="text-white"
                      placeholder=""
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      onResize={undefined}
                      onResizeCapture={undefined}
                      crossOrigin={undefined}
                      labelProps={{ className: "text-blue-gray-200" }}
                    />
                  </div>
                  <div className='sm:col-span-5'>
                    <Input
                      type='number'
                      label='Costo Unitario (neto)'
                      value={unitPriceToAdd}
                      onChange={(e) => setUnitPriceToAdd(e.target.value)}
                      error={!!itemErrors.price}
                      className="text-white"
                      placeholder=""
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      onResize={undefined}
                      onResizeCapture={undefined}
                      crossOrigin={undefined}
                      labelProps={{ className: "text-blue-gray-200" }}
                    />
                  </div>
                  <div className='sm:col-span-4'>
                    <Button
                      fullWidth
                      onClick={handleAddItem}
                      className="flex items-center justify-center gap-2 bg-emerald-500 h-[40px]"
                      placeholder=""
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      onResize={undefined}
                      onResizeCapture={undefined}
                    >
                      <PlusIcon className='w-5 h-5 text-white' />
                      <span className="font-bold text-white uppercase tracking-wider">Añadir</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Items Table */}
            {items.length > 0 ? (
              <div className='overflow-hidden rounded-xl border border-white/5'>
                <table className='w-full text-left'>
                  <thead className='bg-white/5'>
                    <tr>
                      <th className='p-4'><Typography variant="small" color="blue-gray" className="font-bold opacity-70 uppercase text-[10px]" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>Item</Typography></th>
                      <th className='p-4 text-center'><Typography variant="small" color="blue-gray" className="font-bold opacity-70 uppercase text-[10px]" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>Cant.</Typography></th>
                      <th className='p-4 text-right'><Typography variant="small" color="blue-gray" className="font-bold opacity-70 uppercase text-[10px]" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>Costo Unit.</Typography></th>
                      <th className='p-4 text-right'><Typography variant="small" color="blue-gray" className="font-bold opacity-70 uppercase text-[10px]" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>Subtotal</Typography></th>
                      <th className='p-4'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                        <td className='p-4'><Typography className="text-white font-medium" variant="small" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>{item.productName}</Typography></td>
                        <td className='p-4 text-center'><Typography className="text-blue-gray-200" variant="small" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>{item.quantity}</Typography></td>
                        <td className='p-4 text-right'><Typography className="text-blue-gray-200" variant="small" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>{formatCurrencyChilean(item.unitPrice)}</Typography></td>
                        <td className='p-4 text-right'><Typography className="text-white font-bold" variant="small" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>{formatCurrencyChilean(item.totalPrice)}</Typography></td>
                        <td className='p-4 text-right'>
                          <IconButton
                            variant="text"
                            color="red"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            placeholder=""
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                          >
                            <TrashIcon className='w-5 h-5' />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-30">
                <ShoppingBagIcon className="h-12 w-12 text-blue-gray-400" />
                <Typography variant="small" className="mt-2" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>No hay artículos añadidos</Typography>
              </div>
            )}
          </div>

          {/* Totals Section */}
          <div className='flex flex-col gap-4 self-end w-full max-w-[320px] bg-white/5 p-6 rounded-2xl'>
            <div className='flex justify-between items-center'>
              <Typography variant="small" color="blue-gray" className="opacity-70 font-bold uppercase text-[10px]" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>Subtotal (neto):</Typography>
              <Typography variant="small" color="white" className="font-bold" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>{formatCurrencyChilean(subTotal)}</Typography>
            </div>
            <div className='flex justify-between items-center'>
              <Typography variant="small" color="blue-gray" className="opacity-70 font-bold uppercase text-[10px]" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>IVA (19%):</Typography>
              <Typography variant="small" color="white" className="font-bold" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>{formatCurrencyChilean(totalVatAmount)}</Typography>
            </div>
            <hr className="border-white/10" />
            <div className='flex justify-between items-center pt-2'>
              <Typography variant="h6" color="blue" className="uppercase tracking-widest font-black text-[12px]" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>Total Bruto:</Typography>
              <Typography variant="h4" color="white" className="font-black" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>{formatCurrencyChilean(grandTotal)}</Typography>
            </div>
          </div>
        </CardBody>

        <CardFooter className='flex flex-col sm:flex-row justify-end items-center gap-4 border-t border-blue-gray-100/10 px-8 py-6' placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
          <Button
            type='button'
            variant='text'
            onClick={onCancel}
            className='w-full sm:w-auto text-blue-gray-200'
            placeholder=""
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            Descargar Cambios
          </Button>
          <Button
            type='submit'
            className='w-full sm:w-auto bg-blue-500 shadow-blue-500/20'
            disabled={isSubmitting || items.length === 0}
            placeholder=""
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            {isSubmitting ? 'Registrando...' : 'Finalizar Registro de Compra'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PurchaseForm;
