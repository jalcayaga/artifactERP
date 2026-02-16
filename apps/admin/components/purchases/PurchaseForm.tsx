'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShoppingCart,
  Plus,
  Trash2,
  FileText,
  Search,
  Package,
  Calculator,
  Building2,
  Calendar,
  Save,
  X,
  TrendingUp,
  Info,
  PackageSearch,
  Truck,
  ArrowRight
} from 'lucide-react';
import {
  Card,
  Typography,
  Button,
  IconButton,
  Input,
  Select,
  Option,
  Textarea,
  Chip
} from "@material-tailwind/react";
import { Product, Company, CreatePurchaseDto, formatCurrencyChilean, cn } from '@artifact/core';
import { ProductService, PurchaseService, CompanyService, useAuth } from '@artifact/core/client';
import { toast } from 'sonner';

interface PurchaseFormProps {
  onSave: () => Promise<void>;
  onCancel: () => void;
}

const FIXED_VAT_RATE_PERCENT = 19;

const PurchaseForm: React.FC<PurchaseFormProps> = ({ onSave, onCancel }) => {
  const { token } = useAuth();

  // Step 1: Document Header
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [internalNotes, setInternalNotes] = useState('');

  // Step 2: Line Items
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Suppliers
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

  // Product Search Logic (per line)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (token && activeLineIndex !== null && searchTerm.length > 2) {
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
  }, [searchTerm, token, activeLineIndex]);

  const { subTotal, totalVatAmount, grandTotal } = useMemo(() => {
    const currentSubTotal = items.reduce((total, item) => total + item.totalPrice, 0);
    const currentTotalVatAmount = items.reduce((total, item) => total + item.itemVatAmount, 0);
    return {
      subTotal: currentSubTotal,
      totalVatAmount: currentTotalVatAmount,
      grandTotal: currentSubTotal + currentTotalVatAmount,
    };
  }, [items]);

  const addEmptyLine = () => {
    setItems([...items, {
      id: Math.random().toString(36).substr(2, 9),
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      itemVatAmount: 0,
      totalPriceWithVat: 0
    }]);
  };

  const handleProductSelect = (index: number, product: Product) => {
    setItems(prev => {
      const newItems = [...prev];
      const unitPrice = product.price || 0;
      const quantity = newItems[index].quantity || 1;
      const totalPrice = quantity * unitPrice;
      const itemVatAmount = totalPrice * (FIXED_VAT_RATE_PERCENT / 100);

      newItems[index] = {
        ...newItems[index],
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        unitPrice,
        totalPrice,
        itemVatAmount,
        totalPriceWithVat: totalPrice + itemVatAmount
      };
      return newItems;
    });
    setActiveLineIndex(null);
    setSearchTerm('');
    setSearchResults([]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };

      if (field === 'quantity' || field === 'unitPrice') {
        const q = parseFloat(newItems[index].quantity) || 0;
        const p = parseFloat(newItems[index].unitPrice) || 0;
        newItems[index].totalPrice = q * p;
        newItems[index].itemVatAmount = newItems[index].totalPrice * (FIXED_VAT_RATE_PERCENT / 100);
        newItems[index].totalPriceWithVat = newItems[index].totalPrice + newItems[index].itemVatAmount;
      }
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyId) return toast.error('Debe seleccionar un proveedor.');
    if (items.length === 0) return toast.error('Debe agregar al menos un item.');

    setIsSubmitting(true);
    try {
      const purchaseDetails: CreatePurchaseDto = {
        companyId: selectedCompanyId,
        purchaseDate,
        status: 'COMPLETED',
        observations: internalNotes,
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName, // Extra descriptor for glosa
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
      toast.success('Compra ingresada correctamente.');
      await onSave();
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar la compra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-6xl mx-auto border-white/[0.05] bg-[#1a2537]/80 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] rounded-[3rem] overflow-hidden border" placeholder="" >
      {/* Emerald Header for Purchases */}
      <div className="p-10 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent relative">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ShoppingCart className="w-9 h-9 text-white relative z-10" />
          </div>
          <div>
            <Typography variant="h3" color="white" className="font-black uppercase italic tracking-tighter leading-none text-3xl" placeholder="" >
              Ingreso de <span className="text-emerald-500">Compras</span>
            </Typography>
            <div className="flex items-center gap-4 mt-2">
              <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2" placeholder="" >
                <Truck className="w-4 h-4 text-emerald-500/50" /> Abastecimiento e Inventario
              </Typography>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-1.5 text-blue-400">
                <Info className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Afecto a IVA Crédito</span>
              </div>
            </div>
          </div>
        </div>
        <IconButton variant="text" color="white" onClick={onCancel} className="rounded-full bg-white/5 hover:bg-white/10 w-12 h-12" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
          <X className="w-7 h-7" />
        </IconButton>
      </div>

      <form onSubmit={handleSubmit} className="p-12 space-y-12">
        {/* Section: Supplier & Date */}
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-emerald-500" />
              <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                Proveedor / Emisor
              </Typography>
            </div>
            <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.05]">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Seleccionar Proveedor Registrado</label>
                <Select
                  label="Buscar por Razón Social o RUT"
                  value={selectedCompanyId}
                  onChange={(val) => setSelectedCompanyId(val || '')}
                  className="!border-white/10 !bg-white/5 text-white focus:!border-emerald-500 rounded-xl h-12"
                  labelProps={{ className: "hidden" }}
                >
                  {companies.map((company) => (
                    <Option key={company.id} value={company.id} className="font-bold uppercase text-xs">
                      {company.name} ({company.taxId})
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 space-y-8">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                Fecha del Documento
              </Typography>
            </div>
            <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.05]">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha Contable</label>
                <Input
                  type="date"
                  size="lg"
                  className="!border-white/10 !bg-white/5 text-white focus:!border-emerald-500 rounded-xl font-bold uppercase tracking-widest text-xs"
                  labelProps={{ className: "hidden" }}
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                   crossOrigin={undefined}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Glosas */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Package className="w-5 h-5 text-emerald-500" />
              </div>
              <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                Detalle de Factura de Compra <span className="text-slate-600 text-[10px] ml-2 font-bold uppercase tracking-normal">({items.length} glosas)</span>
              </Typography>
            </div>
            <Button
              variant="gradient"
              color="emerald"
              onClick={addEmptyLine}
              className="flex items-center gap-3 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 py-3 shadow-lg shadow-emerald-500/10"
              placeholder="" 
            >
              <Plus className="w-4 h-4" /> Nueva Glosa
            </Button>
          </div>

          <div className="table-responsive">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left">
                  <th className="px-6 pb-2"><Typography className="text-[10px] font-black text-slate-600 uppercase tracking-widest" placeholder="" >Descripción / Glosa</Typography></th>
                  <th className="px-6 pb-2 text-center w-24"><Typography className="text-[10px] font-black text-slate-600 uppercase tracking-widest" placeholder="" >Cant.</Typography></th>
                  <th className="px-6 pb-2 text-right w-40"><Typography className="text-[10px] font-black text-slate-600 uppercase tracking-widest" placeholder="" >P. Unit (Neto)</Typography></th>
                  <th className="px-6 pb-2 text-right w-40"><Typography className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest" placeholder="" >Subtotal</Typography></th>
                  <th className="px-6 pb-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="bg-white/[0.03] border border-white/[0.05] group animate-in slide-in-from-right-4 duration-500">
                    <td className="px-6 py-5 rounded-l-[1.5rem] relative">
                      <div className="relative">
                        <Input
                          size="md"
                          placeholder="BUSCAR O ESCRIBIR..."
                          className="!border-white/10 !bg-transparent text-white focus:!border-emerald-500 rounded-lg font-bold uppercase text-xs pr-10"
                          labelProps={{ className: "hidden" }}
                          value={activeLineIndex === index ? searchTerm : item.productName}
                          onFocus={() => {
                            setActiveLineIndex(index);
                            setSearchTerm(item.productName);
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSearchTerm(val);
                            updateItem(index, 'productName', val);
                          }}
                           crossOrigin={undefined}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      </div>

                      {/* Results dropdown */}
                      {activeLineIndex === index && searchResults.length > 0 && (
                        <div className="absolute z-50 w-[120%] left-0 bg-[#1A2235] border border-white/10 rounded-2xl shadow-2xl mt-2 overflow-hidden backdrop-blur-3xl">
                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              className="w-full px-5 py-3.5 hover:bg-emerald-600 transition-colors flex items-center justify-between text-left group/res"
                              onClick={() => handleProductSelect(index, product)}
                            >
                              <div className="flex flex-col">
                                <span className="text-white font-black uppercase text-[11px]">{product.name}</span>
                                <span className="text-[9px] text-slate-500 group-hover/res:text-emerald-100 uppercase mt-0.5">SKU: {product.sku || 'N/A'}</span>
                              </div>
                              <span className="bg-emerald-500/10 text-emerald-400 group-hover/res:bg-white/20 group-hover/res:text-white px-2 py-1 rounded-md text-[9px] font-black">
                                REF: {formatCurrencyChilean(product.price || 0)}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <Input
                        size="md"
                        type="number"
                        className="!border-white/10 !bg-transparent text-white focus:!border-emerald-500 rounded-lg font-bold text-center text-xs"
                        labelProps={{ className: "hidden" }}
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                         crossOrigin={undefined}
                      />
                    </td>
                    <td className="px-6 py-5">
                      <Input
                        size="md"
                        type="number"
                        className="!border-white/10 !bg-transparent text-white focus:!border-emerald-500 rounded-lg font-black text-right text-xs"
                        labelProps={{ className: "hidden" }}
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                         crossOrigin={undefined}
                      />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Typography className="text-sm font-black text-white italic" placeholder="" >
                        {formatCurrencyChilean(item.totalPrice)}
                      </Typography>
                    </td>
                    <td className="px-6 py-5 rounded-r-[1.5rem] flex justify-center items-center">
                      <IconButton variant="text" color="red" onClick={() => removeItem(index)} className="rounded-xl hover:bg-red-500/10" placeholder="" >
                        <Trash2 className="w-4 h-4 text-red-500/40 group-hover:text-red-500 transition-colors" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-emerald-500/[0.01]">
                <PackageSearch className="w-10 h-10 text-slate-700 mb-4" />
                <Typography className="text-slate-600 font-black uppercase tracking-widest text-[10px]" placeholder="" >
                  No hay glosas ingresadas para este documento
                </Typography>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-white/5">
          {/* Internal Observations */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-emerald-500" />
              <Typography variant="h6" color="white" className="font-black uppercase tracking-widest text-sm" placeholder="" >
                Notas Internas de Contabilidad
              </Typography>
            </div>
            <Textarea
              rows={5}
              placeholder="NOTAS DE REGISTRO, NÚMERO DE FACTURA FÍSICA O COMENTARIOS..."
              className="!border-white/10 !bg-white/5 text-white focus:!border-emerald-500 rounded-3xl p-6 font-bold text-sm tracking-tight"
              labelProps={{ className: "hidden" }}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              
            />
          </div>

          {/* Totals Summary */}
          <div className="lg:col-span-5">
            <Card className="bg-[#0f172a]/90 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/[0.08] shadow-2xl space-y-6" placeholder="" >
              <div className="space-y-4">
                <div className="flex justify-between items-center opacity-50">
                  <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]" placeholder="" >Neto Imponible</Typography>
                  <Typography className="text-lg font-bold text-white tracking-tight" placeholder="" >{formatCurrencyChilean(subTotal)}</Typography>
                </div>
                <div className="flex justify-between items-center opacity-50">
                  <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]" placeholder="" >IVA (19%)</Typography>
                  <Typography className="text-lg font-bold text-white tracking-tight" placeholder="" >{formatCurrencyChilean(totalVatAmount)}</Typography>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <div className="flex justify-between items-center bg-emerald-600/10 p-6 rounded-2xl border border-emerald-600/20">
                  <div className="flex flex-col">
                    <Typography className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1" placeholder="" >Total Bruto</Typography>
                    <Typography className="text-[9px] text-slate-500 font-black uppercase tracking-widest" placeholder="" >Moneda Nacional (CLP)</Typography>
                  </div>
                  <Typography variant="h2" color="white" className="font-black italic text-4xl tracking-tighter" placeholder="" >
                    {formatCurrencyChilean(grandTotal)}
                  </Typography>
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                color="emerald"
                fullWidth
                size="lg"
                disabled={isSubmitting || items.length === 0}
                className="flex items-center justify-center gap-4 rounded-3xl font-black uppercase tracking-[0.2em] text-sm py-6 shadow-2xl shadow-emerald-500/40 relative group overflow-hidden"
                placeholder="" 
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Save className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{isSubmitting ? 'Procesando...' : 'Finalizar Ingreso'}</span>
              </Button>

              <Button
                variant="text"
                color="white"
                fullWidth
                onClick={onCancel}
                className="rounded-2xl font-black uppercase tracking-widest text-[10px] py-4 opacity-40 hover:opacity-100 transition-opacity"
                placeholder="" 
              >
                Cancelar Registro
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default PurchaseForm;
