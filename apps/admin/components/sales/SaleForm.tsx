'use client';

import React, { useState, FormEvent, useMemo, useCallback, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
  Button,
  Input,
  Select,
  Option,
  Textarea,
  IconButton,
} from '@material-tailwind/react';
import {
  ShoppingCartIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  Sale,
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
import { toast } from 'sonner';
import CreatePurchaseOrderModal from './CreatePurchaseOrderModal';

interface SaleFormProps {
  saleData?: Sale | null;
  onSave: (saleData: Sale) => void;
  onCancel: () => void;
}

const FIXED_VAT_RATE_PERCENT = 19;

type SaleFormItem = CreateSaleItemDto & {
  productName?: string;
  lots?: { lotId: string; quantity: number }[];
};

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
          lots: item.orderItemLots?.map(oil => ({ lotId: oil.lotId, quantity: oil.quantityTaken })),
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
      lots: selectedLotId ? [{ lotId: selectedLotId, quantity }] : undefined,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setSearchTerm('');
    setSelectedProductToAdd(null);
    setSelectedProductLots([]);
    setQuantityToAdd('');
    setUnitPriceToAdd('');
    setSelectedLotId(null);
    setItemErrors({});
  }, [
    selectedProductToAdd,
    quantityToAdd,
    unitPriceToAdd,
    selectedLotId,
    validateItemForm,
  ]);

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
        lots: item.lots,
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
        response?: { data?: any };
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

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto flex flex-col gap-6 p-4">
        <Card className="bg-[#1e293b] text-white">
          <CardHeader floated={false} shadow={false} className="rounded-none bg-transparent">
            <Typography variant="h5" color="white">
              {isEditing
                ? `Editar Venta: ${saleData?.id.substring(0, 8)}...`
                : 'Crear Nueva Venta'}
            </Typography>
          </CardHeader>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography variant="small" className="mb-2 font-medium text-blue-gray-300">
                Cliente *
              </Typography>
              <Select
                label="Seleccionar Cliente"
                className="text-white bg-[#0f172a]"
                error={!!errors.selectedCompanyId}
                value={selectedCompanyId}
                onChange={(val) => setSelectedCompanyId(val || '')}
              >
                {companies.map((company) => (
                  <Option key={company.id} value={company.id}>
                    {company.name} {company.email ? `(${company.email})` : ''}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Typography variant="small" className="mb-2 font-medium text-blue-gray-300">
                Fecha de Venta *
              </Typography>
              <Input
                type="date"
                className="text-white bg-[#0f172a]"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                error={!!errors.saleDate}
                crossOrigin={undefined}
              />
            </div>
          </CardBody>
        </Card>

        {/* Items Card */}
        <Card className="bg-[#1e293b] text-white overflow-visible">
          <div className="p-4 bg-[#0f172a] border-b border-white/5">
            <Typography variant="h6" color="white">Artículos de la Venta (IVA {FIXED_VAT_RATE_PERCENT}%)</Typography>
          </div>
          <CardBody className="p-4 space-y-4">
            {/* Product Search Row */}
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full relative">
                <Typography variant="small" className="mb-1 font-medium text-blue-gray-300">Buscar Producto</Typography>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Escriba para buscar..."
                  className="text-white bg-[#0f172a]"
                  error={!!itemErrors.product}
                  crossOrigin={undefined}
                />
                {searchResults.length > 0 && (
                  <div className="absolute z-50 w-full bg-[#1e293b] border border-blue-gray-700 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="px-3 py-2 hover:bg-[#0f172a] cursor-pointer text-sm text-white border-b border-blue-gray-800 last:border-0"
                        onClick={() => handleProductSelect(product)}
                      >
                        {product.name} {product.sku ? `(${product.sku})` : ''} - {formatCurrencyChilean(product.price)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedProductToAdd && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-[#0f172a] p-4 rounded-lg border border-white/10">
                <div className="sm:col-span-2">
                  <Typography variant="small" className="mb-1 font-medium text-blue-gray-300">Cantidad</Typography>
                  <Input
                    type="number"
                    value={quantityToAdd}
                    onChange={(e) => setQuantityToAdd(e.target.value)}
                    className="text-white"
                    error={!!itemErrors.quantity}
                    crossOrigin={undefined}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Typography variant="small" className="mb-1 font-medium text-blue-gray-300">Precio Unit. (s/IVA)</Typography>
                  <Input
                    type="number"
                    value={unitPriceToAdd}
                    onChange={(e) => setUnitPriceToAdd(e.target.value)}
                    className="text-white"
                    error={!!itemErrors.price}
                    crossOrigin={undefined}
                  />
                </div>
                {selectedProductToAdd.productType === 'PRODUCT' && selectedProductLots.length > 0 && (
                  <div className="sm:col-span-4">
                    <Typography variant="small" className="mb-1 font-medium text-blue-gray-300">Lote (Opcional)</Typography>
                    <Select
                      className="text-white"
                      value={selectedLotId || ''}
                      onChange={(val) => setSelectedLotId(val || null)}
                      error={!!itemErrors.lot}
                      label="Seleccionar Lote"
                    >
                      {selectedProductLots.map((lot) => (
                        <Option key={lot.id} value={lot.id}>
                          {lot.lotNumber} (Disp: {lot.currentQuantity})
                        </Option>
                      ))}
                    </Select>
                  </div>
                )}
                <div className="sm:col-span-3">
                  <Button fullWidth onClick={handleAddItem} color="blue" className="flex items-center justify-center gap-2">
                    <PlusIcon className="w-4 h-4" /> Agregar
                  </Button>
                </div>
              </div>
            )}

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-100/10 bg-[#0f172a] p-4 text-xs font-semibold uppercase text-blue-gray-200">Producto</th>
                    <th className="border-b border-blue-gray-100/10 bg-[#0f172a] p-4 text-xs font-semibold uppercase text-blue-gray-200 text-right">Cant.</th>
                    <th className="border-b border-blue-gray-100/10 bg-[#0f172a] p-4 text-xs font-semibold uppercase text-blue-gray-200 text-right">P.Unit</th>
                    <th className="border-b border-blue-gray-100/10 bg-[#0f172a] p-4 text-xs font-semibold uppercase text-blue-gray-200 text-right">Subtotal</th>
                    <th className="border-b border-blue-gray-100/10 bg-[#0f172a] p-4 text-xs font-semibold uppercase text-blue-gray-200 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr><td colSpan={5} className="p-4 text-center text-blue-gray-400">Sin artículos</td></tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={index} className="hover:bg-white/5">
                        <td className="p-4 border-b border-blue-gray-100/5">
                          <Typography variant="small" color="white" className="font-normal">{item.productName}</Typography>
                          {item.lots && item.lots.length > 0 && <Typography variant="small" className="text-[10px] text-blue-gray-400">Lote ID: {item.lots[0].lotId.substring(0, 8)}...</Typography>}
                        </td>
                        <td className="p-4 border-b border-blue-gray-100/5 text-right"><Typography variant="small" color="blue-gray" className="font-normal">{item.quantity}</Typography></td>
                        <td className="p-4 border-b border-blue-gray-100/5 text-right"><Typography variant="small" color="blue-gray" className="font-normal">{formatCurrencyChilean(item.unitPrice)}</Typography></td>
                        <td className="p-4 border-b border-blue-gray-100/5 text-right"><Typography variant="small" color="white" className="font-medium">{formatCurrencyChilean(item.totalPrice)}</Typography></td>
                        <td className="p-4 border-b border-blue-gray-100/5 text-center">
                          <IconButton variant="text" color="red" size="sm" onClick={() => handleRemoveItem(index)}>
                            <TrashIcon className="w-4 h-4" />
                          </IconButton>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {errors.items && <Typography variant="small" color="red" className="text-center">{errors.items}</Typography>}

          </CardBody>
        </Card>

        {/* Footer with Totals */}
        <Card className="bg-[#1e293b] text-white">
          <CardBody className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="w-full md:w-1/2">
              <Textarea
                label="Observaciones"
                className="text-white"
                rows={3}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-gray-300">Subtotal Neto:</span>
                <span className="font-medium text-white">{formatCurrencyChilean(subTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-gray-300">IVA (19%):</span>
                <span className="font-medium text-white">{formatCurrencyChilean(totalVatAmount)}</span>
              </div>
              <div className="border-t border-white/10 my-1"></div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-blue-400">Total:</span>
                <span className="text-white">{formatCurrencyChilean(grandTotal)}</span>
              </div>
            </div>
          </CardBody>
          <CardFooter className="pt-0 border-t border-white/5 flex justify-end gap-3">
            <Button variant="outlined" color="white" onClick={onCancel}>Cancelar</Button>
            <Button variant="gradient" color="blue" type="submit" loading={isSubmitting}>
              {isEditing ? 'Actualizar Venta' : 'Guardar Venta'}
            </Button>
          </CardFooter>
        </Card>

      </form>
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
