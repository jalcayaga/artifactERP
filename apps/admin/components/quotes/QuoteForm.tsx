'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  Input,
  Typography,
  Button,
  IconButton,
  Select,
  Option,
  Textarea,
  Chip
} from "@material-tailwind/react";
import {
  X,
  Save,
  Plus,
  Trash2,
  Building2,
  Calendar,
  FileText,
  Package,
  Calculator,
  Search,
  ShoppingCart,
  Banknote,
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Company, Product, Quote, QuoteStatus, formatCurrencyChilean, parseChileanCurrency, useAuth, ProductIntelligence } from '@artifact/core';
import { CompanyService, ProductService } from '@artifact/core/client';
import { ProductIntelligencePopover } from '../products/ProductIntelligencePopover';
import { toast } from 'sonner';
import { Building2, Package, Calculator, Trash2, Info, Loader2 } from 'lucide-react';

interface QuoteItemRowProps {
  index: number;
  form: any;
  products: Product[];
  remove: (index: number) => void;
  token: string | null;
}

const QuoteItemRow: React.FC<QuoteItemRowProps> = ({ index, form, products, remove, token }) => {
  const [intelligence, setIntelligence] = useState<ProductIntelligence | null>(null);
  const [loading, setLoading] = useState(false);
  const productId = form.watch(`items.${index}.productId`);
  const lotId = form.watch(`items.${index}.lotId`);

  useEffect(() => {
    const fetchLots = async () => {
      if (!productId || !token) {
        setIntelligence(null);
        return;
      }
      setLoading(true);
      try {
        const data = await ProductService.getProductIntelligence(productId, token);
        setIntelligence(data);
      } catch (error) {
        console.error('Error fetching lots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLots();
  }, [productId, token]);

  const updateRowTotals = useCallback((unitPrice: number, quantity: number) => {
    const totalPrice = unitPrice * quantity;
    const vatAmount = Math.round(totalPrice * 0.19);
    form.setValue(`items.${index}.totalPrice`, totalPrice);
    form.setValue(`items.${index}.itemVatAmount`, vatAmount);
    form.setValue(`items.${index}.totalPriceWithVat`, totalPrice + vatAmount);
  }, [form, index]);

  const handleProductChange = (val: string) => {
    const product = products.find(p => p.id === val);
    if (product) {
      const unitPrice = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
      form.setValue(`items.${index}.productId`, val);
      form.setValue(`items.${index}.lotId`, '');
      form.setValue(`items.${index}.unitPrice`, unitPrice);
      updateRowTotals(unitPrice, form.getValues(`items.${index}.quantity`) || 1);
    }
  };

  const handleLotChange = (val: string) => {
    form.setValue(`items.${index}.lotId`, val);
    const selectedLot = intelligence?.lots.find(l => l.id === val);
    if (selectedLot && !form.getValues(`items.${index}.unitPrice`)) {
      // Only autocomplete if price is 0 or empty
      const suggested = Math.round(selectedLot.purchasePrice * 1.3);
      form.setValue(`items.${index}.unitPrice`, suggested);
      updateRowTotals(suggested, form.getValues(`items.${index}.quantity`) || 1);
    }
  };

  const applySuggestedPrice = () => {
    if (intelligence?.suggestedPrice) {
      const suggested = Math.round(intelligence.suggestedPrice);
      form.setValue(`items.${index}.unitPrice`, suggested);
      updateRowTotals(suggested, form.getValues(`items.${index}.quantity`) || 1);
      toast.success('Precio sugerido aplicado');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white/[0.02] p-4 rounded-2xl border border-white/[0.05] group hover:bg-white/[0.04] transition-all relative">
      <div className="md:col-span-1 flex items-center justify-center">
        <span className="text-[10px] font-black text-slate-700">#{index + 1}</span>
      </div>

      <div className="md:col-span-3 space-y-1">
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Producto</label>
        <Select
          label="Seleccionar Producto"
          value={productId}
          onChange={(val) => handleProductChange(val || '')}
          className="!border-white/5 !bg-white/5 text-white focus:!border-blue-500 rounded-xl"
          labelProps={{ className: "hidden" }}
        >
          {products.map((p) => (
            <Option key={p.id} value={p.id} className="font-bold uppercase text-xs tracking-tight">
              {p.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="md:col-span-3 space-y-1">
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Lote / Stock</label>
        <Select
          label="Seleccionar Lote"
          value={lotId || ''}
          onChange={(val) => handleLotChange(val || '')}
          disabled={!productId || loading}
          className="!border-white/5 !bg-white/5 text-white focus:!border-blue-500 rounded-xl"
          labelProps={{ className: "hidden" }}
        >
          {intelligence?.lots.map((lot) => (
            <Option key={lot.id} value={lot.id} className="font-bold uppercase text-[10px] tracking-tight">
              {lot.lotNumber} - {lot.warehouseName} ({lot.currentQuantity} unid.) @ {formatCurrencyChilean(lot.purchasePrice)}
            </Option>
          )) || <Option value="" disabled>No hay lotes disponibles</Option>}
        </Select>
        {loading && <div className="absolute right-4 bottom-4"><Loader2 className="w-4 h-4 text-blue-500 animate-spin" /></div>}
      </div>

      <div className="md:col-span-1 space-y-1">
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 text-center block">Cant.</label>
        <Input
          type="number"
          min="1"
          className="!border-white/5 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold text-center"
          labelProps={{ className: "hidden" }}
          {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
          onChange={(e) => {
            const q = parseInt(e.target.value) || 0;
            updateRowTotals(form.getValues(`items.${index}.unitPrice`), q);
          }}
          crossOrigin={undefined}
        />
      </div>

      <div className="md:col-span-2 space-y-1 relative">
        <div className="flex items-center justify-between ml-1">
          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Precio Unit.</label>
          {intelligence?.suggestedPrice && (
            <button
              type="button"
              onClick={applySuggestedPrice}
              className="text-[8px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-tighter flex items-center gap-0.5 transition-colors"
              title={`Sugerido: ${formatCurrencyChilean(intelligence.suggestedPrice)}`}
            >
              <Calculator className="w-2 h-2" /> Sugerir
            </button>
          )}
        </div>
        <Input
          type="number"
          className="!border-white/5 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold text-right pr-2"
          labelProps={{ className: "hidden" }}
          {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
          onChange={(e) => {
            const p = parseFloat(e.target.value) || 0;
            updateRowTotals(p, form.getValues(`items.${index}.quantity`));
          }}
          crossOrigin={undefined}
        />
        {/* Branch Price Indicators if available */}
        {intelligence?.branchPrices && intelligence.branchPrices.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1 leading-none">
            {intelligence.branchPrices.slice(0, 3).map((bp, i) => (
              <span key={i} className="text-[7px] font-black text-slate-500/80 bg-white/5 px-1 rounded border border-white/5 uppercase tracking-tighter">
                {bp.name}: <span className="text-blue-500/60">{formatCurrencyChilean(bp.price)}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-1 space-y-1 text-right">
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest mr-1 block">Subtotal</label>
        <div className="bg-white/5 border border-white/5 rounded-xl h-10 flex items-center justify-end px-3">
          <span className="text-[11px] font-black italic text-white leading-none">
            {formatCurrencyChilean(form.watch(`items.${index}.totalPrice`) || 0)}
          </span>
        </div>
      </div>

      <div className="md:col-span-1 flex items-center justify-center pb-1">
        <IconButton
          variant="text"
          color="red"
          size="sm"
          className="rounded-full hover:bg-red-500/10"
          onClick={() => remove(index)}
          placeholder=""
        >
          <Trash2 className="w-4 h-4" />
        </IconButton>
      </div>
    </div>
  );
};

const formSchema = z.object({
  companyId: z.string().min(1, 'La empresa es requerida.'),
  status: z.nativeEnum(QuoteStatus),
  quoteDate: z.string().min(1, 'La fecha es requerida.'),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'El producto es requerido.'),
        lotId: z.string().optional(),
        quantity: z.number().min(1, 'La cantidad debe ser al menos 1.'),
        unitPrice: z.number(),
        totalPrice: z.number(),
        itemVatAmount: z.number(),
        totalPriceWithVat: z.number(),
      })
    )
    .min(1, 'Debe haber al menos un ítem en la cotización.'),
  subTotalAmount: z.number(),
  vatAmount: z.number(),
  grandTotal: z.number(),
});

type QuoteFormValues = z.infer<typeof formSchema>;

interface QuoteFormProps {
  quoteData?: Quote | null;
  onSave: (data: QuoteFormValues) => Promise<void>;
  onCancel: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  quoteData,
  onSave,
  onCancel,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: quoteData
      ? {
        companyId: quoteData.companyId,
        status: quoteData.status,
        quoteDate: quoteData.quoteDate ? new Date(quoteData.quoteDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        expiryDate: quoteData.expiryDate ? new Date(quoteData.expiryDate).toISOString().split('T')[0] : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: quoteData.items?.map(item => ({
          productId: item.productId,
          lotId: item.lotId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          itemVatAmount: item.itemVatAmount,
          totalPriceWithVat: item.totalPriceWithVat
        })) || [],
        notes: quoteData.notes || '',
        subTotalAmount: quoteData.subTotalAmount,
        vatAmount: quoteData.vatAmount,
        grandTotal: quoteData.grandTotalAmount
      }
      : {
        companyId: '',
        status: QuoteStatus.DRAFT,
        quoteDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
        items: [{
          productId: '',
          lotId: '',
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
          itemVatAmount: 0,
          totalPriceWithVat: 0
        }],
        subTotalAmount: 0,
        vatAmount: 0,
        grandTotal: 0
      },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const fetchData = useCallback(async () => {
    try {
      const companyResponse = await CompanyService.getAllCompanies(1, 100, { isClient: true });
      setCompanies(companyResponse.data);

      const productResponse = await ProductService.getAllProducts('1', 1000);
      setProducts(productResponse.data);
    } catch (error) {
      toast.error('Error al cargar datos necesarios.');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const items = form.watch('items');

  const totals = useMemo(() => {
    const subTotal = items.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
    const vat = Math.round(subTotal * 0.19);
    const grandTotal = subTotal + vat;

    // Update form values silently to avoid re-renders if possible, or use useEffect
    return { subTotal, vat, grandTotal };
  }, [items]);

  useEffect(() => {
    form.setValue('subTotalAmount', totals.subTotal);
    form.setValue('vatAmount', totals.vat);
    form.setValue('grandTotal', totals.grandTotal);
  }, [totals, form]);

  const onSubmit = async (data: QuoteFormValues) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
    } catch (error: any) {
      toast.error(error?.message || 'Error al guardar la cotización.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { token } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Premium Header */}
      <Card className="bg-[#1a2537]/60 backdrop-blur-3xl border border-white/[0.05] p-6 rounded-[2rem] shadow-2xl overflow-hidden relative" placeholder="" >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h4" color="white" className="font-black uppercase italic tracking-tighter leading-none" placeholder="" >
                {quoteData ? 'Editar' : 'Nueva'} <span className="text-blue-500">Cotización</span>
              </Typography>
              <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2" placeholder="" >
                <Building2 className="w-4 h-4 text-blue-500/50" /> Transformando oportunidades en ventas
              </Typography>
            </div>
          </div>
          <IconButton variant="text" color="white" onClick={onCancel} className="rounded-full bg-white/5 hover:bg-white/10" placeholder="" onResize={undefined} onResizeCapture={undefined}>
            <X className="w-6 h-6" />
          </IconButton>
        </div>
      </Card>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: General Info & Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] p-8 rounded-[2rem]" placeholder="" >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Building2 className="w-5 h-5 text-blue-500" />
              </div>
              <Typography variant="h5" color="white" className="font-black uppercase italic tracking-tight" placeholder="" >
                Datos del <span className="text-blue-500">Cliente</span>
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Empresa Destinataria</label>
                <Select
                  label="Seleccionar Empresa"
                  value={form.watch('companyId')}
                  onChange={(val) => form.setValue('companyId', val || '')}
                  className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl h-12"
                  labelProps={{ className: "hidden" }}
                >
                  {companies.map((company) => (
                    <Option key={company.id} value={company.id} className="font-bold uppercase text-xs tracking-tight">
                      {company.name} ({company.taxId})
                    </Option>
                  ))}
                </Select>
                {errors.companyId && <span className="text-xs text-red-500 font-bold px-2">{errors.companyId.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha Emisión</label>
                  <Input
                    type="date"
                    className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase"
                    labelProps={{ className: "hidden" }}
                    {...form.register('quoteDate')}
                    crossOrigin={undefined}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Vencimiento</label>
                  <Input
                    type="date"
                    className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold uppercase"
                    labelProps={{ className: "hidden" }}
                    {...form.register('expiryDate')}
                    crossOrigin={undefined}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Items Section */}
          <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] p-8 rounded-[2rem]" placeholder="" >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                </div>
                <Typography variant="h5" color="white" className="font-black uppercase italic tracking-tight" placeholder="" >
                  Detalle de <span className="text-blue-500">Productos</span>
                </Typography>
              </div>
              <Button
                variant="text"
                color="blue"
                size="sm"
                onClick={() => append({ productId: '', quantity: 1, unitPrice: 0, totalPrice: 0, itemVatAmount: 0, totalPriceWithVat: 0 })}
                className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] bg-blue-500/10 hover:bg-blue-500/20 rounded-xl"
                placeholder="" onResize={undefined} onResizeCapture={undefined}
              >
                <Plus className="w-4 h-4" />
                Añadir Línea
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <QuoteItemRow
                  key={field.id}
                  index={index}
                  form={form}
                  products={products}
                  remove={remove}
                  token={token}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Status & Totals */}
        <div className="space-y-6">
          <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] p-8 rounded-[2rem]" placeholder="" >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <Typography variant="h5" color="white" className="font-black uppercase italic tracking-tight" placeholder="" >
                Estado de <span className="text-blue-500">Venta</span>
              </Typography>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estado Actual</label>
                <Select
                  label="Seleccionar Estado"
                  value={form.watch('status')}
                  onChange={(val) => form.setValue('status', val as QuoteStatus)}
                  className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl h-12"
                  labelProps={{ className: "hidden" }}
                >
                  {Object.values(QuoteStatus).map((status) => (
                    <Option key={status} value={status} className="font-bold uppercase text-xs tracking-tight">
                      {status}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Notas Internas / Condiciones</label>
                <Textarea
                  placeholder="Instrucciones especiales o términos comerciales..."
                  className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl"
                  labelProps={{ className: "hidden" }}
                  rows={4}
                  {...form.register('notes')}

                />
              </div>
            </div>
          </Card>

          {/* Resumen de Totales */}
          <Card className="bg-[#1a2537] border-blue-500/20 p-8 rounded-[2rem] border shadow-[0_0_40px_rgba(59,130,246,0.1)]" placeholder="" >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Banknote className="w-5 h-5 text-white" />
              </div>
              <Typography variant="h5" color="white" className="font-black uppercase italic tracking-tight" placeholder="" >
                Resumen <span className="text-blue-400">Total</span>
              </Typography>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subtotal Neto</span>
                <span className="text-sm font-bold text-white">{formatCurrencyChilean(totals.subTotal)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">IVA</span>
                  <Chip value="19%" size="sm" className="bg-blue-500/10 text-blue-400 text-[8px] font-black rounded px-1" />
                </div>
                <span className="text-sm font-bold text-slate-300">{formatCurrencyChilean(totals.vat)}</span>
              </div>
              <div className="flex justify-between items-center py-6">
                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Total Bruto</span>
                <div className="text-right">
                  <Typography variant="h3" color="white" className="font-black italic leading-none" placeholder="" >
                    {formatCurrencyChilean(totals.grandTotal)}
                  </Typography>
                  <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Pesos Chilenos</span>
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
                disabled={isSubmitting}
                className="flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-widest text-sm py-5 shadow-xl shadow-blue-500/20 group hover:scale-[1.02] transition-transform"
                placeholder="" onResize={undefined} onResizeCapture={undefined}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {quoteData ? 'Actualizar Cotización' : 'Emitir Cotización'}
                  </>
                )}
              </Button>
              <Button
                variant="text"
                color="white"
                fullWidth
                onClick={onCancel}
                className="rounded-2xl font-black uppercase tracking-widest text-xs py-4 opacity-50 hover:opacity-100 transition-opacity"
                placeholder="" onResize={undefined} onResizeCapture={undefined}
              >
                Descartar Cambios
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default QuoteForm;
