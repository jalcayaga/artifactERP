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
import { Company, Product, Quote, QuoteStatus, formatCurrencyChilean, parseChileanCurrency } from '@artifact/core';
import { CompanyService, ProductService } from '@artifact/core/client';
import { toast } from 'sonner';

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

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const unitPrice = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
      const quantity = form.getValues(`items.${index}.quantity`) || 1;
      const totalPrice = unitPrice * quantity;
      const vatAmount = Math.round(totalPrice * 0.19);

      form.setValue(`items.${index}.productId`, productId);
      form.setValue(`items.${index}.unitPrice`, unitPrice);
      form.setValue(`items.${index}.totalPrice`, totalPrice);
      form.setValue(`items.${index}.itemVatAmount`, vatAmount);
      form.setValue(`items.${index}.totalPriceWithVat`, totalPrice + vatAmount);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const unitPrice = form.getValues(`items.${index}.unitPrice`) || 0;
    const totalPrice = unitPrice * quantity;
    const vatAmount = Math.round(totalPrice * 0.19);

    form.setValue(`items.${index}.quantity`, quantity);
    form.setValue(`items.${index}.totalPrice`, totalPrice);
    form.setValue(`items.${index}.itemVatAmount`, vatAmount);
    form.setValue(`items.${index}.totalPriceWithVat`, totalPrice + vatAmount);
  };

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
          <IconButton variant="text" color="white" onClick={onCancel} className="rounded-full bg-white/5 hover:bg-white/10" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
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
                placeholder=""  onResize={undefined} onResizeCapture={undefined}
              >
                <Plus className="w-4 h-4" />
                Añadir Línea
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white/[0.02] p-4 rounded-2xl border border-white/[0.05] group hover:bg-white/[0.04] transition-all">
                  <div className="md:col-span-1 flex items-center justify-center">
                    <span className="text-[10px] font-black text-slate-700">#{index + 1}</span>
                  </div>

                  <div className="md:col-span-5 space-y-1">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Producto / Servicio</label>
                    <Select
                      label="Seleccionar Producto"
                      value={form.watch(`items.${index}.productId`)}
                      onChange={(val) => handleProductChange(index, val || '')}
                      className="!border-white/5 !bg-white/5 text-white focus:!border-blue-500 rounded-xl"
                      labelProps={{ className: "hidden" }}
                    >
                      {products.map((p) => (
                        <Option key={p.id} value={p.id} className="font-bold uppercase text-xs tracking-tight">
                          {p.name} - {formatCurrencyChilean(typeof p.price === 'string' ? parseFloat(p.price) : (p.price || 0))}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 text-center block">Cant.</label>
                    <Input
                      type="number"
                      min="1"
                      className="!border-white/5 !bg-white/5 text-white focus:!border-blue-500 rounded-xl font-bold text-center"
                      labelProps={{ className: "hidden" }}
                      {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                       crossOrigin={undefined}
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1 text-right">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest mr-1 block">Subtotal</label>
                    <div className="bg-white/5 border border-white/5 rounded-xl h-10 flex items-center justify-end px-4">
                      <span className="text-sm font-black italic text-white">
                        {formatCurrencyChilean(form.watch(`items.${index}.totalPrice`) || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-1 flex items-center justify-center pb-1">
                    <IconButton
                      variant="text"
                      color="red"
                      onClick={() => remove(index)}
                      className="rounded-xl hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      placeholder=""  onResize={undefined} onResizeCapture={undefined}
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  </div>
                </div>
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
                  <Chip value="19%" size="sm" className="bg-blue-500/10 text-blue-400 text-[8px] font-black rounded px-1"  />
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
                placeholder=""  onResize={undefined} onResizeCapture={undefined}
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
                placeholder=""  onResize={undefined} onResizeCapture={undefined}
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
