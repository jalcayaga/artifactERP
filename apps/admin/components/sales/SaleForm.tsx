'use client';

import React, { useState, FormEvent, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@artifact/ui';
import {
  ShoppingCartIcon,
  PlusIcon,
  TrashIcon,
  SearchIcon,
} from '@artifact/ui';
import {
  Sale,
  OrderItem,
  Product,
  LotInfo,
  CreateSaleDto,
  CreateSaleItemDto,
  UpdateSaleDto,
  Company,
  OrderStatus,
  PaymentStatus,
  formatCurrencyChilean,
} from '@artifact/core';
import {
  ProductService,
  SaleService,
  CompanyService,
  PurchaseService,
  useAuth,
} from '@artifact/core/client';
import { Input } from '@artifact/ui';
import { Button } from '@artifact/ui';
import { Label } from '@artifact/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@artifact/ui';
import { toast } from 'sonner';
import CreatePurchaseOrderModal from './CreatePurchaseOrderModal'; // Será migrado

interface SaleFormProps {
  saleData?: Sale | null;
  onSave: (saleData: Sale) => void;
  onCancel: () => void;
}

const FIXED_VAT_RATE_PERCENT = 19;

type SaleFormItem = CreateSaleItemDto & { productName?: string };

const SaleForm: React.FC<SaleFormProps> = ({ saleData, onSave, onCancel }) => {
  const { token, currentUser } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [observations, setObservations] = useState('');
  const [items, setItems] = useState<SaleFormItem[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<Product | null>(null);
  const [selectedProductLots, setSelectedProductLots] = useState<LotInfo[]>([]);
  const [quantityToAdd, setQuantityToAdd] = useState('');
  const [unitPriceToAdd, setUnitPriceToAdd] = useState('');
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [itemErrors, setItemErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [outOfStockInfo, setOutOfStockInfo] = useState(null);

  const isEditing = useMemo(() => !!saleData, [saleData]);

  useEffect(() => {
    if (token) {
      CompanyService.getAllCompanies()
        .then((res) => {
          const list = Array.isArray(res) ? res : res?.data ?? [];
          setCompanies(list.filter((c) => c.isClient));
        })
        .catch((err) => console.error('Error fetching companies:', err));
    }
  }, [token]);

  useEffect(() => {
    if (saleData) {
      setSelectedCompanyId(saleData.companyId);
      setSaleDate(
        saleData.createdAt
          ? new Date(saleData.createdAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setObservations(saleData.customerNotes || '');
      const existingItems =
        saleData.orderItems?.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity ?? 0),
          unitPrice: Number(item.unitPrice ?? 0),
          totalPrice: Number(item.totalPrice ?? 0),
          itemVatAmount: Number(item.itemVatAmount ?? 0),
          totalPriceWithVat: Number(item.totalPriceWithVat ?? 0),
          productName: item.product?.name ?? item.productId,
        })) ?? [];
      setItems(existingItems);
    } else {
      setSelectedCompanyId('');
      setSaleDate(new Date().toISOString().split('T')[0]);
      setObservations('');
      setItems([]);
    }
    setErrors({});
    setItemErrors({});
    setSearchTerm('');
    setSearchResults([]);
    setSelectedProductToAdd(null);
    setSelectedProductLots([]);
    setQuantityToAdd('');
    setUnitPriceToAdd('');
    setSelectedLotId(null);
  }, [saleData, currentUser]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 2 && token) {
        ProductService.searchProducts(token, searchTerm)
          .then((res) => {
            const products = Array.isArray(res) ? res : res?.data ?? [];
            setSearchResults(products);
          })
          .catch((err) => console.error('Error searching products:', err));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, token]);

  const handleProductSelect = useCallback(
    async (product: Product) => {
      setSelectedProductToAdd(product);
      setSearchTerm(product.name);
      setSearchResults([]);
      setUnitPriceToAdd(product.price.toString());
      setSelectedLotId(null);

      if (product.productType === 'PRODUCT' && token) {
        try {
          const lots = await ProductService.getProductLots(product.id, token);
          setSelectedProductLots(lots);
        } catch (error) {
          console.error('Error fetching product lots:', error);
          toast.error('Error al cargar los lotes del producto.');
          setSelectedProductLots([]);
        }
      } else {
        setSelectedProductLots([]);
      }
    },
    [token]
  );

  const { subTotal, totalVatAmount, grandTotal } = useMemo(() => {
    const currentSubTotal = items.reduce(
      (total, item) => total + parseFloat(item.totalPrice.toString()),
      0
    );
    const currentTotalVatAmount = items.reduce(
      (total, item) => total + parseFloat(item.itemVatAmount.toString()),
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
      newItmErrors.quantity = 'La cantidad debe ser un número positivo.';
    const priceNum = parseFloat(unitPriceToAdd);
    if (isNaN(priceNum) || priceNum < 0)
      newItmErrors.price = 'El precio debe ser un número positivo o cero.';

    if (selectedProductToAdd?.productType === 'PRODUCT' && !selectedLotId) {
      newItmErrors.lot = 'Debe seleccionar un lote para productos físicos.';
    }

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

    const newItem: SaleFormItem = {
      productId: selectedProductToAdd.id,
      quantity,
      unitPrice: unitPrice,
      totalPrice: totalItemPrice,
      itemVatAmount: itemVatAmount,
      totalPriceWithVat: totalPriceWithVat,
      productName: selectedProductToAdd.name,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setSearchTerm('');
    setSelectedProductToAdd(null);
    setSelectedProductLots([]);
    setQuantityToAdd('');
    setUnitPriceToAdd('');
    setSelectedLotId(null);
    setItemErrors({});
  }, [selectedProductToAdd, quantityToAdd, unitPriceToAdd, selectedLotId, validateItemForm]);

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }, []);

  const validateMainForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedCompanyId)
      newErrors.selectedCompanyId = 'Debe seleccionar un cliente.';
    if (!saleDate) newErrors.saleDate = 'La fecha de venta es requerida.';
    if (items.length === 0)
      newErrors.items = 'Debe añadir al menos un artículo a la venta.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateMainForm()) return;
    if (!currentUser?.id && !isEditing) {
      toast.error('No se pudo determinar el usuario actual.');
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        itemVatAmount: item.itemVatAmount,
        totalPriceWithVat: item.totalPriceWithVat,
      }));

      const basePayload = {
        companyId: selectedCompanyId || saleData?.companyId || '',
        status: saleData?.status || OrderStatus.PENDING_PAYMENT,
        paymentStatus: saleData?.paymentStatus || PaymentStatus.PENDING,
        subTotalAmount: subTotal,
        vatAmount: totalVatAmount,
        vatRatePercent: saleData?.vatRatePercent || FIXED_VAT_RATE_PERCENT,
        discountAmount: saleData?.discountAmount || 0,
        shippingAmount: saleData?.shippingAmount || 0,
        grandTotalAmount: grandTotal,
        currency: saleData?.currency || 'CLP',
        shippingAddress: saleData?.shippingAddress || undefined,
        billingAddress: saleData?.billingAddress || undefined,
        customerNotes: observations.trim() || undefined,
        paymentMethod: saleData?.paymentMethod || undefined,
        items: normalizedItems,
      };

      let savedSale: Sale;

      if (isEditing && saleData?.id) {
        const updatePayload: UpdateSaleDto = {
          ...basePayload,
          userId: saleData.userId,
        };
        savedSale = await SaleService.updateSale(saleData.id, updatePayload);
        toast.success(
          `Venta ${savedSale.id.substring(0, 8)}... actualizada exitosamente.`
        );
      } else {
        const createPayload: CreateSaleDto = {
          userId: currentUser!.id,
          ...basePayload,
        };
        savedSale = await SaleService.createSale(createPayload);
        toast.success(
          `Venta ${savedSale.id.substring(0, 8)}... creada exitosamente.`
        );
      }

      onSave(savedSale);
    } catch (error: any) {
      console.error('Error guardando la venta:', error);
      const apiError = error as Error & {
        response?: { data?: any }
      };
      const errorData = apiError.response?.data;
      if (errorData?.errorCode === 'OUT_OF_STOCK') {
        setOutOfStockInfo(errorData);
        setShowPurchaseModal(true);
      } else {
        toast.error(apiError.message || 'Error al guardar la venta.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPurchaseOrder = async (
    productId: string,
    quantity: number,
    companyId: string
  ) => {
    try {
      const newPurchase = await PurchaseService.createPurchase({
        companyId: companyId,
        status: 'PENDING',
        items: [
          {
            productId,
            quantity,
            unitPrice: 0,
            totalPrice: 0,
            itemVatAmount: 0,
            totalPriceWithVat: 0,
          },
        ],
        subTotalAmount: 0,
        totalVatAmount: 0,
        grandTotal: 0,
        purchaseDate: new Date().toISOString(),
      });
      toast.success(`Orden de compra creada: ${newPurchase.id}`);
    } catch (error: any) {
      console.error('Error creating purchase order:', error);
      toast.error('Error al crear la orden de compra.');
    }
  };

  const inputBaseClass =
    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground';
  const errorTextClass = 'mt-1 text-xs text-destructive';

  return (
    <>
      <Card className='max-w-4xl mx-auto border'>
        <CardHeader>
          <CardTitle className='text-xl'>
            {isEditing
              ? `Editar Venta: ${saleData?.id.substring(0, 8)}...`
              : 'Crear Nueva Venta'}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-6 pt-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <Label htmlFor='client-select'>
                  Cliente <span className='text-red-500'>*</span>
                </Label>
                <Select
                  onValueChange={setSelectedCompanyId}
                  value={selectedCompanyId}
                >
                  <SelectTrigger id='client-select'>
                    <SelectValue placeholder='Selecciona un cliente' />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}{' '}
                        {company.email ? `(${company.email})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.selectedCompanyId && (
                  <p id='client-error' className={errorTextClass}>
                    {errors.selectedCompanyId}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor='sale-date'>
                  Fecha de Venta <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='date'
                  id='sale-date'
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  aria-describedby='saleDate-error'
                />
                {errors.saleDate && (
                  <p id='saleDate-error' className={errorTextClass}>
                    {errors.saleDate}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-4 p-4 rounded-md bg-card'>
              <h3 className='text-md font-semibold text-foreground'>
                Artículos de la Venta (IVA {FIXED_VAT_RATE_PERCENT}%)
              </h3>

              {/* Product Search and Selection */}
              <div className='grid grid-cols-1 sm:grid-cols-12 gap-4 items-end'>
                <div className='sm:col-span-5 relative'>
                  <Label
                    htmlFor='product-search'
                    className='block text-xs font-medium text-muted-foreground'
                  >
                    Buscar Producto
                  </Label>
                  <Input
                    id='product-search'
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='Escribe para buscar productos...'
                    className='pr-10'
                  />
                  <SearchIcon className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                  {searchResults.length > 0 && (
                    <div className='absolute z-10 w-full bg-popover border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto'>
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          className='px-3 py-2 hover:bg-accent cursor-pointer text-sm'
                          onClick={() => handleProductSelect(product)}
                        >
                          {product.name} {product.sku ? `(${product.sku})` : ''}{' '}
                          - {formatCurrencyChilean(product.price)}
                        </div>
                      ))}
                    </div>
                  )}
                  {itemErrors.product && (
                    <p className={errorTextClass}>{itemErrors.product}</p>
                  )}
                </div>

                {selectedProductToAdd && (
                  <div className='sm:col-span-7 grid grid-cols-1 sm:grid-cols-5 gap-4'>
                    <div className='sm:col-span-2'>
                      <Label
                        htmlFor='item-quantity'
                        className='block text-xs font-medium text-muted-foreground'
                      >
                        Cant.
                      </Label>
                      <Input
                        type='number'
                        id='item-quantity'
                        value={quantityToAdd}
                        onChange={(e) => setQuantityToAdd(e.target.value)}
                        placeholder='0'
                      />
                      {itemErrors.quantity && (
                        <p className={errorTextClass}>{itemErrors.quantity}</p>
                      )}
                    </div>
                    <div className='sm:col-span-3'>
                      <Label
                        htmlFor='item-price'
                        className='block text-xs font-medium text-muted-foreground'
                      >
                        P. Unit. Venta (sin IVA)
                      </Label>
                      <Input
                        type='number'
                        id='item-price'
                        value={unitPriceToAdd}
                        onChange={(e) => setUnitPriceToAdd(e.target.value)}
                        placeholder='0.00'
                        step='0.01'
                      />
                      {itemErrors.price && (
                        <p className={errorTextClass}>{itemErrors.price}</p>
                      )}
                    </div>

                    {selectedProductToAdd.productType === 'PRODUCT' &&
                      selectedProductLots.length > 0 && (
                        <div className='sm:col-span-5'>
                          <Label
                            htmlFor='lot-select'
                            className='block text-xs font-medium text-muted-foreground'
                          >
                            Seleccionar Lote (Precio Compra)
                          </Label>
                          <Select
                            onValueChange={setSelectedLotId}
                            value={selectedLotId || ''}
                          >
                            <SelectTrigger id='lot-select'>
                              <SelectValue placeholder='Selecciona un lote' />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedProductLots.map((lot) => (
                                <SelectItem key={lot.id} value={lot.id}>
                                  Lote: {lot.lotNumber} - Cant:{' '}
                                  {lot.currentQuantity} - Compra:{' '}
                                  {formatCurrencyChilean(lot.purchasePrice)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {itemErrors.lot && (
                            <p className={errorTextClass}>{itemErrors.lot}</p>
                          )}
                        </div>
                      )}

                    <div className='sm:col-span-5'>
                      <Button
                        type='button'
                        onClick={handleAddItem}
                        className='w-full'
                      >
                        <PlusIcon className='w-4 h-4 mr-2' /> Añadir Artículo
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {items.length > 0 ? (
                <div className='mt-4 -mx-4 sm:mx-0 overflow-x-auto'>
                  <table className='min-w-full divide-y divide-border'>
                    <thead className='bg-muted/50'>
                      <tr>
                        <th className='px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                          Producto / Servicio
                        </th>
                        <th className='px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                          Cant.
                        </th>
                        <th className='px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                          P.Unit (s/IVA)
                        </th>
                        <th className='px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                          Subtotal (s/IVA)
                        </th>
                        <th className='px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell'>
                          IVA Item
                        </th>
                        <th className='px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider'></th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-border'>
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td className='px-3 py-2 whitespace-nowrap text-sm text-foreground'>
                            {item.productName || item.productId}
                          </td>
                          <td className='px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right'>
                            {item.quantity}
                          </td>
                          <td className='px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right'>
                            {formatCurrencyChilean(item.unitPrice)}
                          </td>
                          <td className='px-3 py-2 whitespace-nowrap text-sm text-foreground font-medium text-right'>
                            {formatCurrencyChilean(item.totalPrice)}
                          </td>
                          <td className='px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right hidden sm:table-cell'>
                            {formatCurrencyChilean(item.itemVatAmount)}
                          </td>
                          <td className='px-3 py-2 whitespace-nowrap text-center'>
                            <button
                              type='button'
                              onClick={() => handleRemoveItem(index)}
                              title='Eliminar Artículo'
                              className='text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10 transition-colors'
                            >
                              <TrashIcon className='w-4 h-4' />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className='text-sm text-center text-muted-foreground italic py-3'>
                  Aún no se han añadido artículos a la venta.
                </p>
              )}
              {errors.items && (
                <p className={errorTextClass + ' text-center'}>
                  {errors.items}
                </p>
              )}
            </div>

            <div className='mt-6 pt-4 border-t border-border space-y-2'>
              <div className='flex justify-end items-center'>
                <span className='text-md font-medium text-muted-foreground'>
                  Subtotal (sin IVA):
                </span>
                <span className='ml-4 text-md font-semibold text-foreground w-32 text-right'>
                  {formatCurrencyChilean(subTotal)}
                </span>
              </div>
              <div className='flex justify-end items-center'>
                <span className='text-md font-medium text-muted-foreground'>
                  IVA ({FIXED_VAT_RATE_PERCENT}%):
                </span>
                <span className='ml-4 text-md font-semibold text-foreground w-32 text-right'>
                  {formatCurrencyChilean(totalVatAmount)}
                </span>
              </div>
              <div className='flex justify-end items-center mt-1 pt-1 border-t border-border/50'>
                <span className='text-lg font-bold text-foreground'>
                  Total Venta:
                </span>
                <span className='ml-4 text-2xl font-bold text-primary w-32 text-right'>
                  {formatCurrencyChilean(grandTotal)}
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor='sale-observations'>Observaciones</Label>
              <textarea
                id='sale-observations'
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={3}
                className={inputBaseClass}
                placeholder='Añadir notas adicionales sobre la venta...'
              ></textarea>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col sm:flex-row justify-end items-center gap-3 pt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              className='w-full sm:w-auto order-2 sm:order-1'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              className='w-full sm:w-auto order-1 sm:order-2'
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                  ? 'Actualizar Venta'
                  : 'Guardar Venta'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <CreatePurchaseOrderModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onConfirm={handleConfirmPurchaseOrder}
        stockInfo={outOfStockInfo}
      />
    </>
  );
};

export default SaleForm;
