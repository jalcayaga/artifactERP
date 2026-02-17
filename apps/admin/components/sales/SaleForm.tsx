'use client';

import React, { useState, FormEvent, useMemo, useCallback, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Input,
  Select,
  Option,
  Textarea,
  IconButton,
  Chip,
  List,
  ListItem
} from '@material-tailwind/react';
import {
  ShoppingCart,
  Plus,
  Trash2,
  FileText,
  Building2,
  Calendar,
  Search,
  Hash,
  Package,
  Clock,
  Banknote,
  TrendingUp,
  X,
  PlusCircle,
  AlertCircle,
  ChevronRight,
  Save,
  Boxes
} from 'lucide-react';
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
  OrderSource,
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
import { formatDate } from '@artifact/core';

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
  const [isNewClient, setIsNewClient] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    rut: '',
    giro: '',
    address: '',
    city: '',
    phone: '',
    email: '',
  });

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
  }, [saleData]);

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
          if (lots.length === 1) setSelectedLotId(lots[0].id);
        } catch (error) {
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
    return {
      subTotal: currentSubTotal,
      totalVatAmount: currentTotalVatAmount,
      grandTotal: currentSubTotal + currentTotalVatAmount,
    };
  }, [items]);

  const handleAddItem = useCallback(() => {
    const newItmErrors: { [key: string]: string } = {};
    if (!selectedProductToAdd) newItmErrors.product = 'Requerido';
    const quantity = parseFloat(quantityToAdd);
    if (isNaN(quantity) || quantity <= 0) newItmErrors.quantity = 'Monto inválido';
    const unitPrice = parseFloat(unitPriceToAdd);
    if (isNaN(unitPrice) || unitPrice < 0) newItmErrors.price = 'Precio inválido';
    if (selectedProductToAdd?.productType === 'PRODUCT' && !selectedLotId) newItmErrors.lot = 'Lote Requerido';

    if (Object.keys(newItmErrors).length > 0) {
      setItemErrors(newItmErrors);
      return;
    }

    const totalItemPrice = quantity * unitPrice;
    const itemVatAmount = totalItemPrice * (FIXED_VAT_RATE_PERCENT / 100);
    const totalPriceWithVat = totalItemPrice + itemVatAmount;

    const newItem: SaleFormItem = {
      productId: selectedProductToAdd!.id,
      quantity,
      unitPrice,
      totalPrice: totalItemPrice,
      itemVatAmount,
      totalPriceWithVat,
      productName: selectedProductToAdd!.name,
      lots: selectedLotId ? [{ lotId: selectedLotId, quantity }] : undefined,
    };

    setItems((prev) => [...prev, newItem]);
    setSearchTerm('');
    setSelectedProductToAdd(null);
    setSelectedProductLots([]);
    setQuantityToAdd('');
    setUnitPriceToAdd('');
    setSelectedLotId(null);
    setItemErrors({});
  }, [selectedProductToAdd, quantityToAdd, unitPriceToAdd, selectedLotId]);

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    const schemaErrors: { [key: string]: string } = {};
    if (!isNewClient && !selectedCompanyId) schemaErrors.client = 'Selecciona un cliente';
    if (isNewClient) {
      if (!newClientData.name) schemaErrors.name = 'Nombre requerido';
      if (!newClientData.rut) schemaErrors.rut = 'RUT requerido';
      if (!newClientData.giro) schemaErrors.giro = 'Giro requerido';
    }
    if (items.length === 0) schemaErrors.items = 'Añade al menos un producto';

    if (Object.keys(schemaErrors).length > 0) {
      setErrors(schemaErrors);
      Object.values(schemaErrors).forEach(err => toast.error(err));
      return;
    }

    if (!currentUser?.id && !isEditing) { toast.error('Error de sesión.'); return; }

    setIsSubmitting(true);
    try {
      let finalCompanyId = selectedCompanyId;

      if (isNewClient) {
        const createdCompany = await CompanyService.createCompany({
          ...newClientData,
          isClient: true,
          isSupplier: false,
        });
        finalCompanyId = createdCompany.id;
        toast.success(`Cliente ${createdCompany.name} creado.`);
      }

      const basePayload = {
        companyId: finalCompanyId,
        source: OrderSource.ADMIN,
        status: saleData?.status || OrderStatus.PENDING_PAYMENT,
        paymentStatus: saleData?.paymentStatus || PaymentStatus.PENDING,
        subTotalAmount: subTotal,
        vatAmount: totalVatAmount,
        vatRatePercent: FIXED_VAT_RATE_PERCENT,
        discountAmount: 0,
        shippingAmount: 0,
        grandTotalAmount: grandTotal,
        currency: 'CLP',
        customerNotes: observations.trim() || undefined,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          itemVatAmount: item.itemVatAmount,
          totalPriceWithVat: item.totalPriceWithVat,
          lots: item.lots,
        })),
      };

      let savedSale: Sale;
      if (isEditing && saleData?.id) {
        savedSale = await SaleService.updateSale(saleData.id, { ...basePayload, userId: saleData.userId } as any);
        toast.success(`Venta #${savedSale.id.substring(0, 8)} actualizada.`);
      } else {
        savedSale = await SaleService.createSale({ ...basePayload, userId: currentUser!.id } as any);
        toast.success(`Venta #${savedSale.id.substring(0, 8)} creada.`);
      }
      onSave(savedSale);
    } catch (error: any) {
      if (error?.response?.data?.errorCode === 'OUT_OF_STOCK') {
        setOutOfStockInfo(error.response.data);
        setShowPurchaseModal(true);
      } else {
        toast.error(error?.message || 'Error al procesar la venta.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPurchaseOrder = async (productId: string, quantity: number, companyId: string) => {
    try {
      await PurchaseService.createPurchase({
        companyId,
        status: 'PENDING',
        items: [{ productId, quantity, unitPrice: 0, totalPrice: 0, itemVatAmount: 0, totalPriceWithVat: 0 }],
        subTotalAmount: 0, totalVatAmount: 0, grandTotal: 0, purchaseDate: new Date().toISOString(),
      });
      toast.success('Orden de compra de reposición enviada.');
    } catch (error) {
      toast.error('Error al solicitar reposición.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="bg-[#1a2537]/60 backdrop-blur-3xl border border-white/[0.05] p-6 rounded-[2rem] shadow-2xl relative overflow-hidden" placeholder="" >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h4" color="white" className="font-black uppercase italic tracking-tighter leading-none" placeholder="" >
                {isEditing ? 'Editar' : 'Nueva'} <span className="text-blue-500">Orden de Venta</span>
              </Typography>
              <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2" placeholder="" >
                <TrendingUp className="w-4 h-4 text-blue-500/50" /> Generación de ingresos operativos
              </Typography>
            </div>
          </div>
          <IconButton variant="text" color="white" onClick={onCancel} className="rounded-full bg-white/5 hover:bg-white/10" placeholder=""  >
            <X className="w-6 h-6" />
          </IconButton>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Client & Products */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] p-8 rounded-[2rem]" placeholder="" >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Building2 className="w-5 h-5 text-blue-500" />
              </div>
              <Typography variant="h5" color="white" className="font-black uppercase italic tracking-tight" placeholder="" >
                Identificación de <span className="text-blue-500">Origen</span>
              </Typography>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Typography variant="small" color="white" className="font-bold uppercase tracking-widest text-[10px]" placeholder="" >
                    ¿Cliente Nuevo?
                  </Typography>
                  <Button
                    size="sm"
                    variant={isNewClient ? "gradient" : "text"}
                    color="blue"
                    onClick={() => setIsNewClient(!isNewClient)}
                    className="rounded-lg py-1 px-3 text-[9px] font-black"
                    placeholder=""
                  >
                    {isNewClient ? "CANCELAR" : "CREAR NUEVO"}
                  </Button>
                </div>
              </div>

              {!isNewClient ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cliente Solicitante</label>
                    <Select
                      label="Seleccionar Cliente"
                      value={selectedCompanyId}
                      onChange={(val) => setSelectedCompanyId(val || '')}
                      className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl h-12"
                      labelProps={{ className: "hidden" }}
                    >
                      {companies.map((company) => (
                        <Option key={company.id} value={company.id} className="font-bold uppercase text-xs tracking-tight">
                          {company.name} ({company.rut})
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha de Registro</label>
                    <Input
                      type="date"
                      className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase"
                      labelProps={{ className: "hidden" }}
                      value={saleDate}
                      onChange={(e) => setSaleDate(e.target.value)}
                      crossOrigin={undefined}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Razón Social</label>
                      <Input
                        className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase h-12"
                        labelProps={{ className: "hidden" }}
                        value={newClientData.name}
                        onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                        crossOrigin={undefined}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">RUT</label>
                      <Input
                        placeholder="12.345.678-9"
                        className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold h-12"
                        labelProps={{ className: "hidden" }}
                        value={newClientData.rut}
                        onChange={(e) => setNewClientData({ ...newClientData, rut: e.target.value })}
                        crossOrigin={undefined}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Giro</label>
                      <Input
                        className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase h-12"
                        labelProps={{ className: "hidden" }}
                        value={newClientData.giro}
                        onChange={(e) => setNewClientData({ ...newClientData, giro: e.target.value })}
                        crossOrigin={undefined}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Dirección</label>
                      <Input
                        className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase h-12"
                        labelProps={{ className: "hidden" }}
                        value={newClientData.address}
                        onChange={(e) => setNewClientData({ ...newClientData, address: e.target.value })}
                        crossOrigin={undefined}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Ciudad</label>
                      <Input
                        className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase h-12"
                        labelProps={{ className: "hidden" }}
                        value={newClientData.city}
                        onChange={(e) => setNewClientData({ ...newClientData, city: e.target.value })}
                        crossOrigin={undefined}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha Registro</label>
                      <Input
                        type="date"
                        className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold h-12"
                        labelProps={{ className: "hidden" }}
                        value={saleDate}
                        onChange={(e) => setSaleDate(e.target.value)}
                        crossOrigin={undefined}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Add Product Card */}
          <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] p-8 rounded-[2rem] overflow-visible" placeholder="" >
            <div className="flex items-center gap-3 mb-8 text-white">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <Typography variant="h5" color="white" className="font-black uppercase italic tracking-tight" placeholder="" >
                Buscador de <span className="text-blue-500">Stock</span>
              </Typography>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="ESCRIBE PARA BUSCAR PRODUCTOS O SKU..."
                  className="w-full bg-white/[0.03] border border-white/5 rounded-[1.5rem] py-4 px-14 text-sm font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 transition-all uppercase tracking-widest"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {searchResults.length > 0 && (
                  <Card className="absolute z-50 w-full bg-[#1e293b] border border-white/10 shadow-2xl mt-2 rounded-[1.5rem] overflow-hidden p-2" placeholder="" >
                    <List className="p-0" placeholder="" >
                      {searchResults.map((p) => (
                        <ListItem key={p.id} onClick={() => handleProductSelect(p)} className="text-white hover:bg-white/5 rounded-xl py-4 px-5 border-b border-white/5 last:border-0 group" placeholder="" >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="font-black uppercase tracking-tight italic group-hover:text-blue-400 transition-colors">{p.name}</span>
                              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{p.sku || 'SIN SKU'}</span>
                            </div>
                            <span className="font-black italic text-blue-500">{formatCurrencyChilean(p.price)}</span>
                          </div>
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                )}
              </div>

              {selectedProductToAdd && (
                <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/10 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    <div className="md:col-span-3 space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Cant. Solicitada</label>
                      <Input
                        type="number"
                        className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold text-center h-12"
                        labelProps={{ className: "hidden" }}
                        value={quantityToAdd}
                        onChange={(e) => setQuantityToAdd(e.target.value)}
                        crossOrigin={undefined}
                      />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Precio Liq. (Neto)</label>
                      <Input
                        type="number"
                        className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold h-12"
                        labelProps={{ className: "hidden" }}
                        value={unitPriceToAdd}
                        onChange={(e) => setUnitPriceToAdd(e.target.value)}
                        crossOrigin={undefined}
                      />
                    </div>

                    {selectedProductToAdd.productType === 'PRODUCT' && (
                      <div className="md:col-span-4 space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Lote / Ubicación (FIFO)</label>
                        <Select
                          label="Seleccionar Lote"
                          value={selectedLotId || ''}
                          onChange={(val) => setSelectedLotId(val || null)}
                          className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl h-12"
                          labelProps={{ className: "hidden" }}
                        >
                          {selectedProductLots.map((lot) => (
                            <Option key={lot.id} value={lot.id} className="font-bold uppercase text-[10px] tracking-widest">
                              {lot.lotNumber} (Disp: {lot.currentQuantity})
                            </Option>
                          ))}
                        </Select>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <Button
                        variant="gradient"
                        color="blue"
                        fullWidth
                        onClick={handleAddItem}
                        className="rounded-xl h-12 p-0 flex items-center justify-center"
                        placeholder=""
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="mt-10 overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Producto</th>
                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Cant.</th>
                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">P. Unit</th>
                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Monto Neto</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-slate-600 font-bold uppercase tracking-widest text-xs italic">
                        Sin artículos vinculados a la orden
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={index} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white uppercase italic tracking-tight">{item.productName}</span>
                            {item.lots && <span className="text-[10px] text-blue-500/60 font-black uppercase tracking-widest">FIFO LOTE: {item.lots[0].lotId.substring(0, 8)}</span>}
                          </div>
                        </td>
                        <td className="p-4 text-center font-black text-slate-300 italic">{item.quantity}</td>
                        <td className="p-4 text-right font-bold text-slate-400">{formatCurrencyChilean(item.unitPrice)}</td>
                        <td className="p-4 text-right font-black italic text-white">{formatCurrencyChilean(item.totalPrice)}</td>
                        <td className="p-4">
                          <IconButton variant="text" color="red" size="sm" onClick={() => handleRemoveItem(index)} className="rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" placeholder=""  >
                            <Trash2 className="w-4 h-4" />
                          </IconButton>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right: Overview & Actions */}
        <div className="space-y-6">
          <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] p-8 rounded-[2rem]" placeholder="" >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <FileText className="w-5 h-5 text-orange-500" />
              </div>
              <Typography variant="h5" color="white" className="font-black uppercase italic tracking-tight" placeholder="" >
                Observaciones <span className="text-orange-500">Int.</span>
              </Typography>
            </div>

            <Textarea
              placeholder="Notas del cliente o detalles logísticos..."
              className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl"
              labelProps={{ className: "hidden" }}
              rows={5}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}

            />
          </Card>

          {/* Totals & Submit */}
          <Card className="bg-[#1a2537] border-blue-500/20 p-8 rounded-[2rem] border shadow-[0_0_40px_rgba(59,130,246,0.1)]" placeholder="" >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Banknote className="w-5 h-5 text-white" />
              </div>
              <Typography variant="h5" color="white" className="font-black uppercase italic tracking-tight" placeholder="" >
                Liquidación <span className="text-blue-400">Total</span>
              </Typography>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Imponible (Neto)</span>
                <span className="text-sm font-bold text-white">{formatCurrencyChilean(subTotal)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Afecto IVA</span>
                  <Chip value="19%" size="sm" className="bg-blue-500/10 text-blue-400 text-[8px] font-black rounded px-1" />
                </div>
                <span className="text-sm font-bold text-slate-300">{formatCurrencyChilean(totalVatAmount)}</span>
              </div>
              <div className="flex justify-between items-center py-6">
                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Total Final</span>
                <div className="text-right">
                  <Typography variant="h2" color="white" className="font-black italic leading-none" placeholder="" >
                    {formatCurrencyChilean(grandTotal)}
                  </Typography>
                  <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Divisa: Pesos Chilenos (CLP)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <Button
                type="submit"
                variant="gradient"
                color="blue"
                fullWidth
                size="lg"
                loading={isSubmitting}
                onClick={handleSubmit}
                className="flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-widest text-sm py-5 shadow-xl shadow-blue-500/20 h-16"
                placeholder=""
              >
                <Save className="w-6 h-6" />
                {isEditing ? 'Actualizar Orden' : 'Emitir Orden'}
              </Button>
              <Button
                variant="text"
                color="white"
                fullWidth
                onClick={onCancel}
                className="rounded-2xl font-black uppercase tracking-widest text-xs py-4 opacity-50 hover:opacity-100 transition-opacity"
                placeholder=""
              >
                Descartar Cambios
              </Button>
            </div>
          </Card>
        </div>
      </form>

      <CreatePurchaseOrderModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onConfirm={handleConfirmPurchaseOrder}
        stockInfo={outOfStockInfo}
      />
    </div>
  );
};

export default SaleForm;
